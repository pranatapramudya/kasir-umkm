import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const existingTenant = await prisma.tenant.findFirst({
    where: { userId }
  });

  // HANYA redirect ke dashboard jika tenant sudah ada DAN sudah memilih paket langganan/trial
  if (existingTenant && existingTenant.subscriptionPlan) {
    redirect('/');
  }

  return <>{children}</>;
}
