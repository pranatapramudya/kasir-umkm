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

  return <AdminProductsClientPage kategoriUsaha={kategoriUsaha} />;
}
