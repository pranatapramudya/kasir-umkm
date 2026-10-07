import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { BottomNavClient } from "./BottomNavClient";

/**
 * Server Component wrapper — reads tenant category and user role from Prisma / sessionClaims
 * and passes it down to the client BottomNavClient.
 * Returns null safely during logout or when unauthenticated.
 */
export async function BottomNav() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) return null;

    let role: string | undefined = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.role;
    let kategoriUsaha = "Retail";
    let targetUserId = userId;

    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
      select: { tenantId: true },
    });
    if (employee) {
      role = 'CASHIER';
      targetUserId = employee.tenantId;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId },
      select: { category: true },
    });

    if (tenant?.category) {
      kategoriUsaha = tenant.category;
    }

    return <BottomNavClient kategoriUsaha={kategoriUsaha} role={role} tenantId={targetUserId} />;
  } catch {
    // When user logs out or session is destroyed, return null safely
    return null;
  }
}
