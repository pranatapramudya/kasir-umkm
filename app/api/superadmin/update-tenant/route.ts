import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = sessionClaims?.role || (sessionClaims?.metadata as any)?.role;
    if (role !== 'SUPERADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { tenantId, plan, status } = body;

    if (!tenantId || !plan || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Kalkulasi kedaluwarsa baru jika diatur ke ACTIVE dan merupakan paket berbayar
    let newEndsAt = tenant.subscriptionEndsAt;
    let days = 0;
    
    if (plan === 'PRO_SEMI_ANNUAL') days = 180;
    else if (plan === 'PRO_YEARLY') days = 365;
    else if (plan === 'PRO_YEARLY_BUNDLE') days = 365;

    // Jika Superadmin memaksa status ACTIVE untuk paket berbayar, kita perbarui masa kedaluwarsanya
    if (status === 'ACTIVE' && days > 0) {
      newEndsAt = new Date();
      newEndsAt.setDate(newEndsAt.getDate() + days);
    } else if (plan === 'FREE' || status === 'TRIAL') {
       // Optional: Logika jika kembali ke FREE atau TRIAL (bisa dibiarkan null atau reset)
       if (plan === 'FREE') newEndsAt = null;
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: status,
        subscriptionPlan: plan,
        subscriptionEndsAt: newEndsAt,
      }
    });

    // Update Clerk metadata
    try {
      const client = await (await import('@clerk/nextjs/server')).clerkClient();
      await client.users.updateUserMetadata(tenant.userId, {
        publicMetadata: {
          plan: plan.toLowerCase(),
          ...(newEndsAt && { subscriptionEndsAt: newEndsAt.toISOString() }),
        },
      });
    } catch (e) {
      console.error("Failed updating clerk metadata", e);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Update Tenant Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
