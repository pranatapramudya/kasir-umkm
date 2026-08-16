import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isServiceBusinessCategory, isRentalTravelCategory } from "@/lib/business-category";
import * as xlsx from "xlsx";

export async function GET(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const role = (sessionClaims?.metadata as any)?.role;
    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    
    if (role === 'CASHIER') {
      return NextResponse.json({ error: "Unauthorized: Kasir dilarang mengakses laporan laba." }, { status: 403 });
    }
    
    // 1. Tenant Scoping
    let targetUserIds = [userId];
    let targetTenantId = userId; // Defaults to self if Owner

    // Owner: see transactions from themselves & all cashiers
    const cashiers = await prisma.employee.findMany({
      where: { tenantId: userId },
      select: { clerkUserId: true }
    });
    const cashierIds = cashiers.map(c => c.clerkUserId);
    targetUserIds = [userId, ...cashierIds];

    // Fetch tenant profile for category and name
    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetTenantId }
    });
    
    const storeName = tenant?.name || "Toko";
    const category = tenant?.category || "Retail";
    const isServiceBusiness = isServiceBusinessCategory(category);
    const isRentalTravel = isRentalTravelCategory(category);

    // 2. Parse Period
    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    let dateFilter: any = {};
    const now = new Date();
    
    if (!from && !to) {
      // Default to current month if no params
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter.gte = firstDay;
      dateFilter.lte = now;
    } else {
      if (from) dateFilter.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        dateFilter.lte = toDate;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: { in: targetUserIds },
        createdAt: dateFilter,
      },
      include: {
        items: true,
        cashier: { select: { name: true } }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    // To get Product Details, we need the products of the tenant
    const products = await prisma.product.findMany({
      where: { userId: targetTenantId }
    });
    const productMap = new Map(products.map(p => [p.id, p]));

    let headers: string[] = ["No", "Tanggal Transaksi", "Nama Pelanggan", "Subtotal", "Total", "Metode Pembayaran", "Kasir"];
    
    if (isServiceBusiness) {
      headers.push("Tanggal Booking", "Waktu (Slot)");
    } else if (isRentalTravel) {
      headers.push("Tgl Mulai Sewa", "Tgl Selesai Sewa", "Nama Supir", "Plat Nomor", "Tujuan");
    }

    let formattedData: any[] = [];

    if (transactions.length === 0) {
      const emptyRow: any = {};
      headers.forEach(h => emptyRow[h] = "");
      emptyRow[headers[0]] = "Belum ada data transaksi pada periode ini";
      formattedData.push(emptyRow);
    } else {
      let no = 1;
      transactions.forEach((t) => {
        const rowData: any = {
          "No": no++,
          "Tanggal Transaksi": t.createdAt.toLocaleString("id-ID"),
          "Nama Pelanggan": t.customerName || "-",
          "Subtotal": t.total - (t.discount || 0), // Assuming total in DB is after discount. Or Subtotal is just total + discount
          "Total": t.total,
          "Metode Pembayaran": t.method,
          "Kasir": t.cashier?.name || "Owner/Sistem"
        };

        if (isServiceBusiness) {
          // You might need to map from your schema for Jasa/Servis if it exists in Transaction or Booking.
          // Assuming these are mapped to startDate/endDate if they were added to Transaction
          rowData["Tanggal Booking"] = t.startDate ? t.startDate.toLocaleDateString("id-ID") : "-";
          rowData["Waktu (Slot)"] = t.startDate ? t.startDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "-";
        } else if (isRentalTravel) {
          rowData["Tgl Mulai Sewa"] = t.startDate ? t.startDate.toLocaleDateString("id-ID") : "-";
          rowData["Tgl Selesai Sewa"] = t.endDate ? t.endDate.toLocaleDateString("id-ID") : "-";
          rowData["Nama Supir"] = t.driverName || "-";
          rowData["Plat Nomor"] = t.licensePlate || "-";
          rowData["Titik Jemput"] = t.pickupLocation || "-";
          rowData["Titik Tujuan"] = t.dropoffLocation || "-";
        }

        formattedData.push(rowData);
      });
    }

    // Generate Excel File
    const worksheet = xlsx.utils.json_to_sheet(formattedData, { header: headers });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi");

    // Convert to Buffer
    const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    const safeStoreName = storeName.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = now.toLocaleDateString('id-ID').replace(/\//g, '-');
    const filename = `Laporan_PJTECH_${safeStoreName}_${dateStr}.xlsx`;

    // Return the response as a downloadable file
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
