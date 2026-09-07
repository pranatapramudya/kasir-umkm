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
    const targetTenantId = tenantId || userId;

    // Fetch tenant profile for category and name
    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetTenantId }
    });

    const storeName = tenant?.name || "Toko";
    const category = tenant?.category || "Retail";
    const type = category.toUpperCase();
    const isServiceBusiness = type.includes("JASA") || type.includes("SERVIS") || isServiceBusinessCategory(category);
    const isRentalTravel = type.includes("RENTAL") || isRentalTravelCategory(category);

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
        userId: targetTenantId,
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

    let headers: string[] = [];
    if (isRentalTravel) {
      headers = ["Tanggal", "Nama Penyewa", "Unit / Properti / Armada", "Mulai Sewa", "Selesai Sewa", "Tujuan", "Total Sewa (Rp)"];
    } else if (isServiceBusiness) {
      headers = ["Tanggal", "Nama Pelanggan", "Layanan", "Waktu Booking", "Staf / Teknisi / Petugas", "Total Tagihan (Rp)"];
    } else {
      headers = ["Tanggal", "Nama Pelanggan", "Item", "Qty", "Harga Satuan", "Kasir", "Total Belanja (Rp)"];
    }

    let formattedData: any[] = [];

    if (transactions.length === 0) {
      const emptyRow: any = {};
      headers.forEach(h => emptyRow[h] = "");
      emptyRow[headers[0]] = "Belum ada data transaksi pada periode ini";
      formattedData.push(emptyRow);
    } else {
      transactions.forEach((t) => {
        const dateStr = t.createdAt.toLocaleString("id-ID");
        const itemsList = t.items.map(i => productMap.get(i.productId)?.name || "Produk").join(", ");
        const qtyList = t.items.map(i => i.qty).join(", ");
        const priceList = t.items.map(i => i.price).join(", ");

        const rowData: any = {};

        if (isRentalTravel) {
          rowData["Tanggal"] = dateStr;
          rowData["Nama Penyewa"] = t.customerName || "-";
          rowData["Unit / Properti / Armada"] = itemsList || "-";
          rowData["Mulai Sewa"] = t.startDate ? t.startDate.toLocaleDateString("id-ID") : "-";
          rowData["Selesai Sewa"] = t.endDate ? t.endDate.toLocaleDateString("id-ID") : "-";
          rowData["Tujuan"] = t.dropoffLocation || "-";
          rowData["Total Sewa (Rp)"] = t.total;
        } else if (isServiceBusiness) {
          rowData["Tanggal"] = dateStr;
          rowData["Nama Pelanggan"] = t.customerName || "-";
          rowData["Layanan"] = itemsList || "-";
          rowData["Waktu Booking"] = t.startDate ? t.startDate.toLocaleString("id-ID") : "-";
          rowData["Staf / Teknisi / Petugas"] = t.cashier?.name || "Sistem";
          rowData["Total Tagihan (Rp)"] = t.total;
        } else {
          rowData["Tanggal"] = dateStr;
          rowData["Nama Pelanggan"] = t.customerName || "-";
          rowData["Item"] = itemsList || "-";
          rowData["Qty"] = qtyList || "-";
          rowData["Harga Satuan"] = priceList || "-";
          rowData["Kasir"] = t.cashier?.name || "Sistem";
          rowData["Total Belanja (Rp)"] = t.total;
        }

        formattedData.push(rowData);
      });
    }

    // Generate Excel File
    const worksheet = xlsx.utils.json_to_sheet(formattedData, { header: headers });
    worksheet["!cols"] = headers.map(h => ({
      wch: Math.max(h.length + 4, 15)
    }));

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
