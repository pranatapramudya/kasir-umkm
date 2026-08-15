import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { days, plan } = body;

    if (!days || !plan) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Cari tenant milik owner ini
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { userId: userId },
          { id: userId }
        ]
      }
    });

    if (!tenant) {
      revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Kalkulasi tanggal berakhir baru: masa aktif baru dihitung mutlak mulai dari Hari Ini + Durasi Paket Baru
    const newEndsAt = new Date();
    newEndsAt.setDate(newEndsAt.getDate() + days);

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        subscriptionEndsAt: newEndsAt,
        subscriptionPlan: plan,
      }
    });

    const client = await (await import('@clerk/nextjs/server')).clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        plan: plan.toLowerCase(),
        subscriptionEndsAt: newEndsAt.toISOString(),
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, endsAt: updatedTenant.subscriptionEndsAt });

  } catch (error: any) {
    console.error("Extend Subscription Error:", error);
    revalidatePath('/', 'layout');
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
