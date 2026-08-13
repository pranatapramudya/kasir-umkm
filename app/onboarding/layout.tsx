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

  // PRD: "Cek ke database: const existingTenant = await prisma.tenant.findUnique({ where: { userId } })"
  // "Jika existingTenant sudah ada, PENGGUNA DILARANG MELIHAT FORM INI. Langsung redirect mereka ke /admin"
  const existingTenant = await prisma.tenant.findFirst({
    where: { userId }
  });

  if (existingTenant) {
    redirect('/');
  }

  return <>{children}</>;
}
