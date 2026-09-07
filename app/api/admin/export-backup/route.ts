import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isServiceBusinessCategory, isRentalTravelCategory } from "@/lib/business-category";
import * as xlsx from "xlsx";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: Silakan login terlebih dahulu." }, { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role || sessionClaims?.role;

    // Cashier is forbidden from downloading full financial transaction reports
    if (role === 'CASHIER') {
      return NextResponse.json({ error: "Forbidden: Kasir tidak memiliki izin mengunduh laporan keuangan." }, { status: 403 });
    }

    // Resolve tenant ID (supports both owner and admin staff)
    let targetTenantId = (sessionClaims?.metadata as any)?.tenantId || userId;
    const employee = await prisma.employee.findUnique({
      where: { clerkUserId: userId },
      select: { tenantId: true }
    });
    if (employee) {
      targetTenantId = employee.tenantId;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetTenantId }
    });

    const { searchParams } = new URL(req.url);
    const qsType = searchParams.get("type");
    const filter = searchParams.get("filter");
    const customDate = searchParams.get("customDate");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let dateFilter: any = undefined;

    if (from || to) {
      dateFilter = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        dateFilter.lte = toDate;
      }
    } else if (filter && filter !== 'all') {
      const nowStr = new Date().toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
      if (filter === 'hari_ini') {
        dateFilter = {
          gte: new Date(`${nowStr}T00:00:00+07:00`),
          lte: new Date(`${nowStr}T23:59:59.999+07:00`),
        };
      } else if (filter === 'bulan_ini') {
        const yearMonth = nowStr.substring(0, 7);
        const lastDay = new Date(parseInt(yearMonth.split('-')[0]), parseInt(yearMonth.split('-')[1]), 0).getDate();
        dateFilter = {
          gte: new Date(`${yearMonth}-01T00:00:00+07:00`),
          lte: new Date(`${yearMonth}-${lastDay}T23:59:59.999+07:00`),
        };
      } else if (filter === 'tahun_ini') {
        const year = nowStr.substring(0, 4);
        dateFilter = {
          gte: new Date(`${year}-01-01T00:00:00+07:00`),
          lte: new Date(`${year}-12-31T23:59:59.999+07:00`),
        };
      } else if (filter === 'manual' && customDate) {
        dateFilter = {
          gte: new Date(`${customDate}T00:00:00+07:00`),
          lte: new Date(`${customDate}T23:59:59.999+07:00`),
        };
      }
    }

    // Ambil data transaksi beserta relasi
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: targetTenantId,
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
      include: {
        items: true,
        cashier: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
    });

    const products = await prisma.product.findMany({
      where: { userId: targetTenantId }
    });
    const productMap = new Map(products.map(p => [p.id, p]));

    const category = qsType || tenant?.category || "Retail";
    const type = category.toUpperCase();
    const isRental = type.includes("RENTAL") || isRentalTravelCategory(category);
    const isService = type.includes("JASA") || type.includes("SERVIS") || isServiceBusinessCategory(category);

    let headers: string[] = [];
    let formattedData: any[] = [];

    if (isRental) {
      headers = [
        "No",
        "ID Transaksi",
        "Tanggal",
        "Nama Penyewa",
        "Unit / Properti / Armada",
        "Mulai Sewa",
        "Selesai Sewa",
        "Tujuan / Lokasi",
        "Petugas / PIC",
        "Metode Bayar",
        "Status",
        "Total Sewa (Rp)"
      ];
      formattedData = transactions.map((tx, index) => {
        const itemsList = tx.items.map(i => productMap.get(i.productId)?.name || i.note || "Unit").join(", ");
        return {
          "No": index + 1,
          "ID Transaksi": tx.id,
          "Tanggal": tx.createdAt ? tx.createdAt.toLocaleString("id-ID") : "-",
          "Nama Penyewa": tx.customerName || "-",
          "Unit / Properti / Armada": itemsList || "-",
          "Mulai Sewa": tx.startDate ? tx.startDate.toLocaleDateString("id-ID") : "-",
          "Selesai Sewa": tx.endDate ? tx.endDate.toLocaleDateString("id-ID") : "-",
          "Tujuan / Lokasi": tx.dropoffLocation || tx.pickupLocation || "-",
          "Petugas / PIC": tx.cashier?.name || "Owner / Admin",
          "Metode Bayar": tx.method ? tx.method.toUpperCase() : "CASH",
          "Status": tx.status ? tx.status.toUpperCase() : "COMPLETED",
          "Total Sewa (Rp)": tx.total
        };
      });
    } else if (isService) {
      headers = [
        "No",
        "ID Transaksi",
        "Tanggal",
        "Nama Pelanggan",
        "Layanan",
        "Waktu Booking",
        "Staf / Teknisi / Petugas",
        "Metode Bayar",
        "Status",
        "Total Tagihan (Rp)"
      ];
      formattedData = transactions.map((tx, index) => {
        const itemsList = tx.items.map(i => productMap.get(i.productId)?.name || i.note || "Layanan").join(", ");
        return {
          "No": index + 1,
          "ID Transaksi": tx.id,
          "Tanggal": tx.createdAt ? tx.createdAt.toLocaleString("id-ID") : "-",
          "Nama Pelanggan": tx.customerName || "-",
          "Layanan": itemsList || "-",
          "Waktu Booking": tx.startDate ? tx.startDate.toLocaleString("id-ID") : "-",
          "Staf / Teknisi / Petugas": tx.cashier?.name || "Owner / Admin",
          "Metode Bayar": tx.method ? tx.method.toUpperCase() : "CASH",
          "Status": tx.status ? tx.status.toUpperCase() : "COMPLETED",
          "Total Tagihan (Rp)": tx.total
        };
      });
    } else {
      // Retail & F&B
      headers = [
        "No",
        "ID Transaksi",
        "Tanggal",
        "Nama Pelanggan",
        "Item / Produk",
        "Qty",
        "Kasir",
        "Metode Bayar",
        "Status",
        "Total Belanja (Rp)"
      ];
      formattedData = transactions.map((tx, index) => {
        const itemsList = tx.items.map(i => productMap.get(i.productId)?.name || i.note || "Produk").join(", ");
        const qtyList = tx.items.map(i => i.qty).join(", ");
        return {
          "No": index + 1,
          "ID Transaksi": tx.id,
          "Tanggal": tx.createdAt ? tx.createdAt.toLocaleString("id-ID") : "-",
          "Nama Pelanggan": tx.customerName || "-",
          "Item / Produk": itemsList || "-",
          "Qty": qtyList || "1",
          "Kasir": tx.cashier?.name || "Owner / Kasir",
          "Metode Bayar": tx.method ? tx.method.toUpperCase() : "CASH",
          "Status": tx.status ? tx.status.toUpperCase() : "COMPLETED",
          "Total Belanja (Rp)": tx.total
        };
      });
    }

    if (formattedData.length === 0) {
      const emptyRow: any = {};
      headers.forEach(h => emptyRow[h] = "");
      emptyRow[headers[0]] = "-";
      emptyRow[headers[2]] = "Belum ada data transaksi pada periode ini";
      formattedData.push(emptyRow);
    }

    const worksheet = xlsx.utils.json_to_sheet(formattedData, { header: headers });
    worksheet["!cols"] = headers.map(h => ({
      wch: Math.max(h.length + 4, 15)
    }));

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Riwayat Transaksi");

    const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    const safeStoreName = (tenant?.name || "Toko").replace(/[^a-zA-Z0-9]/g, "_");
    const dateTag = filter ? `_${filter}` : "";
    const filename = `Laporan_Transaksi_${safeStoreName}${dateTag}.xlsx`;

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error) {
    console.error("Export Backup Error:", error);
    return NextResponse.json({ error: "Internal Server Error saat membuat file Excel" }, { status: 500 });
  }
}
