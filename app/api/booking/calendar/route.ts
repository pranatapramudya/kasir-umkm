import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve tenantId (same pattern as other pages)
    let tenantId = (sessionClaims?.metadata as any)?.tenantId || userId;
    const employee = await prisma.employee.findUnique({ where: { clerkUserId: userId } });
    if (employee) {
      tenantId = employee.tenantId;
    }

    const rawBookings = await prisma.booking.findMany({
      where: {
        userId: tenantId,
        status: { in: ["PENDING", "COMPLETED", "IN_PROGRESS", "FINISHED"] }
      },
      include: {
        product: { select: { name: true } }
      },
      orderBy: { startDate: "asc" }
    });

    const rawTransactions = await prisma.transaction.findMany({
      where: {
        userId: tenantId,
        startDate: { not: null },
        status: { not: "CANCELLED" }
      },
      include: {
        items: true
      },
      orderBy: { startDate: "asc" }
    });

    const productIds = Array.from(new Set(rawTransactions.flatMap(tx => tx.items.map(i => i.productId))));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));

    const now = new Date();

    const bookings = rawBookings.map(b => {
      let derivedStatus = b.status;
      const start = b.startDate || b.bookingDate;
      const end = b.endDate || b.bookingDate;

      if (derivedStatus === "IN_PROGRESS" && now > end) {
        derivedStatus = "OVERDUE" as any;
      }

      // Handle potential null dates
      const safeStart = start ? start.toISOString() : new Date().toISOString();
      const safeEnd = end ? end.toISOString() : new Date().toISOString();

      return {
        id: b.id,
        customerName: b.customerName,
        itemName: b.product?.name || "Tanpa Armada",
        startDate: safeStart,
        endDate: safeEnd,
        status: derivedStatus as "PENDING" | "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "OVERDUE",
        pickupLocation: b.pickupLocation || undefined,
        dropoffLocation: b.dropoffLocation || undefined,
        returnTime: b.returnTime || undefined,
        deposit: b.deposit || undefined,
        conditionNotes: b.conditionNotes || undefined,
        source: "ONLINE" as const
      };
    });

    const txBookings = rawTransactions.map(tx => {
      let derivedStatus = "FINISHED";
      const start = tx.startDate;
      const end = tx.endDate || tx.startDate;

      if (!start || !end) {
        // Skip invalid transactions
        return null;
      }

      if (now > end) {
        derivedStatus = "OVERDUE";
      } else if (now >= start && now <= end) {
        derivedStatus = "IN_PROGRESS";
      }

      return {
        id: tx.id,
        customerName: tx.customerName || "Pelanggan POS",
        itemName: tx.items.map(i => productMap.get(i.productId) || `Produk ${i.productId}`).join(", ") || "Transaksi POS",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        status: derivedStatus as "PENDING" | "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "OVERDUE",
        pickupLocation: tx.pickupLocation || undefined,
        dropoffLocation: tx.dropoffLocation || undefined,
        returnTime: tx.returnTime || undefined,
        deposit: tx.deposit || undefined,
        conditionNotes: tx.conditionNotes || undefined,
        source: "POS" as const
      };
    }).filter((b): b is NonNullable<typeof b> => b !== null);

    const allBookings = [...bookings, ...txBookings].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return NextResponse.json({ bookings: allBookings });
  } catch (error) {
    console.error("Fetch calendar error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
