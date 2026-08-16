import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AuthCallback() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const role = (sessionClaims?.metadata as any)?.role;
  if (role === 'SUPERADMIN') {
    redirect('/superadmin');
  }

  let targetUserId = userId;
  let tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });

  if (!tenant) {
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId }
    });
    if (employee) {
      targetUserId = employee.tenantId;
      tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });
    }
  }

  if (!tenant) {
    redirect('/onboarding');
  }

  redirect('/admin');
}
