import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { SidebarClient } from "./SidebarClient";

export async function Sidebar() {
  const { userId, sessionClaims } = await auth();

  // Extract role from Clerk session claims (still needed for UI logic)
  const metadata = (sessionClaims?.metadata as Record<string, any>) || {};
  let role = metadata.role as string | undefined;
  const tenantId = metadata.tenantId as string | undefined;

  // Hapus pengambilan plan dan endsAt dari sessionClaims, gunakan Prisma (Source of Truth)
  let plan = "TRIAL";
  let endsAt: string | undefined = undefined;
  let category = "Retail";
  let tenantName = "";

  let targetUserId: string | undefined = userId ?? undefined;

  if (userId) {
    // Selalu cek database: Apakah user ini Karyawan?
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId }
    });

    if (employee) {
      role = 'CASHIER';
      targetUserId = employee.tenantId;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId }
    });

    if (tenant) {
      plan = tenant.subscriptionPlan || "TRIAL";
      // Pastikan merubah objek Date menjadi ISO String sebelum dikirim ke Client Component
      endsAt = tenant.subscriptionEndsAt ? tenant.subscriptionEndsAt.toISOString() : undefined;
      category = tenant.category || "Retail";
      tenantName = tenant.name || "";
    }

    console.log("=== SIDEBAR DEBUG ===");
    console.log("Current Store Category (raw):", tenant?.category);
    console.log("Current Store Category (normalized):", category);
    console.log("Role:", role);
    console.log("Tenant Name:", tenantName);
    console.log("========================");
  }

  return <SidebarClient role={role} plan={plan} endsAt={endsAt} kategoriUsaha={category} tenantName={tenantName} />;
}
