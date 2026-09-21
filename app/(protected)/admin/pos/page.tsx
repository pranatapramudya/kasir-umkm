import POSAppClient from '@/app/page-client';
import { Sidebar } from '@/components/Sidebar';
import { checkSubscriptionStatus } from '@/lib/subscription';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function POSAppAdminRoute() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  const isSuperadmin = role === 'SUPERADMIN';

  if (!userId) {
    redirect('/sign-in');
  }

  if (isSuperadmin) {
    redirect('/superadmin');
  }

  const { isExpired } = await checkSubscriptionStatus();
  let targetUserId = userId;
  let isEmployee = false;

  let tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });

  if (!tenant) {
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId }
    });

    if (employee) {
      isEmployee = true;
      targetUserId = employee.tenantId;
      tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });
    }
  }

  if (!tenant && !isEmployee) {
    redirect('/onboarding');
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { userId: targetUserId, isArchived: false },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.product.count({ where: { userId: targetUserId, isArchived: false } })
  ]);

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading POS...</div>}>
      <POSAppClient
        sidebar={null}
        isExpired={isExpired}
        initialData={{
          products,
          totalPages: Math.max(1, Math.ceil(totalCount / 10))
        }}
        tenantName={tenant?.name || ""}
        tenantCategory={tenant?.category || ""}
        tenantPhone={tenant?.phone || ""}
        tenantSlug={tenant?.slug ?? null}
      />
    </Suspense>
  );
}
