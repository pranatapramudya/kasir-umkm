import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { BottomNavClient } from "./BottomNavClient";

/**
 * Server Component wrapper — reads tenant category from Prisma
 * and passes it down to the client BottomNavClient.
 * Mirrors the same pattern as Sidebar.tsx → SidebarClient.tsx.
 */
export async function BottomNav() {
  let kategoriUsaha = "Retail";

  try {
    const { userId } = await auth();

    if (userId) {
      // Resolve to owner: check if this user is an employee first
      let targetUserId = userId;
      const employee = await prisma.employee.findUnique({
        where: { clerkUserId: userId },
        select: { tenantId: true },
      });
      if (employee) {
        targetUserId = employee.tenantId;
      }

      const tenant = await prisma.tenant.findUnique({
        where: { userId: targetUserId },
        select: { category: true },
      });

      if (tenant?.category) {
        kategoriUsaha = tenant.category;
      }
    }
  } catch {
    // Fail silently — BottomNav still renders, just without category isolation
  }

  return <BottomNavClient kategoriUsaha={kategoriUsaha} />;
}
