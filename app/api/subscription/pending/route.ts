import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role;
    if (role === 'CASHIER') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan) {
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
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Perbarui status menjadi PENDING dan catat rencana paket berlangganan.
    // Masa aktif tidak di-update karena menunggu approval manual.
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        subscriptionStatus: 'PENDING',
        subscriptionPlan: plan,
      }
    });

    return NextResponse.json({ success: true, status: updatedTenant.subscriptionStatus });

  } catch (error: any) {
    console.error("Set Subscription Pending Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
