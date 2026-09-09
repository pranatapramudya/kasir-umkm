import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import AdminProductsClientPage from "./page-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/');
  }

  const metadata = (sessionClaims?.metadata as Record<string, any>) || {};
  const role = metadata.role as string | undefined;
  const tenantId = metadata.tenantId as string | undefined;
  const targetUserId = role === 'CASHIER' && tenantId ? tenantId : userId;

  const tenant = await prisma.tenant.findUnique({
    where: { userId: targetUserId }
  });

  const kategoriUsaha = tenant?.category || "Retail";

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { userId: targetUserId, isArchived: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.product.count({
      where: { userId: targetUserId, isArchived: false },
    }),
  ]);

  const initialData = {
    products,
    totalPages: Math.max(1, Math.ceil(totalCount / 10)),
  };

  return <AdminProductsClientPage kategoriUsaha={kategoriUsaha} initialData={initialData} />;
}
