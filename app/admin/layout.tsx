import { Sidebar } from "@/components/Sidebar";
import AdminLayoutClient from "./AdminLayoutClient";
import { checkSubscriptionStatus } from "@/lib/subscription";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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

  if (!tenant && !isEmployee) {
    redirect('/onboarding');
  }

  return (
    <AdminLayoutClient sidebar={<Sidebar />} isExpired={isExpired}>
      {children}
    </AdminLayoutClient>
  );
}
