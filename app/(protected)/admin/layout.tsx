import { Sidebar } from "@/components/Sidebar";

import AdminLayoutClient from "./AdminLayoutClient";
import PushNotificationManager from "@/components/PushNotificationManager";
import { checkSubscriptionStatus } from "@/lib/subscription";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isRentalTravelCategory, isServiceBusinessCategory } from '@/lib/business-category';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpired, status } = await checkSubscriptionStatus();
  
  if (status === 'PENDING') {
    redirect('/pending-approval');
  }
  
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const role = (sessionClaims?.metadata as any)?.role;
  let isSuperadmin = role === 'SUPERADMIN';
  if (process.env.SUPER_ADMIN_USER_IDS?.includes(userId)) {
    isSuperadmin = true;
  }

  if (isSuperadmin) {
    redirect('/superadmin');
  }

  let targetUserId = userId;
  let isEmployee = false;
  
  let tenant = await prisma.tenant.findUnique({
    where: { userId: targetUserId }
  });

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

  if ((!tenant || !tenant.subscriptionPlan) && !isEmployee) {
    redirect('/onboarding');
  }

  const isBookingEnabled = isServiceBusinessCategory(tenant?.category) || isRentalTravelCategory(tenant?.category);

  return (
    <AdminLayoutClient 
      sidebar={<Sidebar />} 
      isExpired={isExpired} 
      serverUserId={userId} 
      tenantSlug={tenant?.slug ?? null}
      isBookingEnabled={isBookingEnabled}
    >
      <PushNotificationManager />
      {children}
    </AdminLayoutClient>
  );
}
