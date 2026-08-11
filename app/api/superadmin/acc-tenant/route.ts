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
    const { tenantId, plan } = body;

    if (!tenantId || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let days = 0;
    if (plan === 'PRO_SEMI_ANNUAL') days = 180;
    else if (plan === 'PRO_YEARLY') days = 365;
    else if (plan === 'PRO_YEARLY_BUNDLE') days = 365;
    else days = 30; // fallback

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const newEndsAt = new Date();
    newEndsAt.setDate(newEndsAt.getDate() + days);

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: 'ACTIVE',
        subscriptionEndsAt: newEndsAt,
      }
    });

    try {
      const client = await (await import('@clerk/nextjs/server')).clerkClient();
      await client.users.updateUserMetadata(tenant.userId, {
        publicMetadata: {
          subscriptionEndsAt: newEndsAt.toISOString(),
        },
      });
    } catch (e) {
      console.error("Failed updating clerk metadata", e);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("ACC Tenant Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
