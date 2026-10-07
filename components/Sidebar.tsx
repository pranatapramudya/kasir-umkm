import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { SidebarClient } from "./SidebarClient";

export async function Sidebar() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) return null;

    const metadata = (sessionClaims?.metadata as Record<string, any>) || {};
    let role = metadata.role as string | undefined;

    let plan = "TRIAL";
    let endsAt: string | undefined = undefined;
    let category = "Retail";
    let tenantName = "";
    let targetUserId = userId;

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
      endsAt = tenant.subscriptionEndsAt ? tenant.subscriptionEndsAt.toISOString() : undefined;
      category = tenant.category || "Retail";
      tenantName = tenant.name || "";
    }

    return <SidebarClient role={role} plan={plan} endsAt={endsAt} kategoriUsaha={category} tenantName={tenantName} tenantId={targetUserId} />;
  } catch {
    return null;
  }
}
