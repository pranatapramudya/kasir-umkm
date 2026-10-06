import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ManajemenMejaClient from './ManajemenMejaClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manajemen Meja | PJTech Kasir',
  description: 'Pengaturan denah dan kapasitas meja restoran',
};

export default async function ManajemenMejaPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const role = (sessionClaims?.metadata as any)?.role;
  const metaTenantId = (sessionClaims?.metadata as any)?.tenantId;

  let targetUserId = userId;
  if (role === 'CASHIER' && metaTenantId) {
    targetUserId = metaTenantId;
  }
  
  // Periksa apakah dia kasir dari model Employee
  const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
  if (employee) {
    targetUserId = employee.tenantId;
  }

  const initialTables = await prisma.diningTable.findMany({
    where: { userId: targetUserId },
    orderBy: { createdAt: 'desc' }
  });

  const serializedTables = initialTables.map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString()
  }));

  return <ManajemenMejaClient initialTables={serializedTables} tenantId={targetUserId} />;
}