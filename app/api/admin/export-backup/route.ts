import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const role = (sessionClaims?.metadata as any)?.role || sessionClaims?.role;

    if (role !== 'OWNER') {
        return new NextResponse("Forbidden: Access restricted to OWNER only", { status: 403 });
    }

    const targetUserId = userId;

    // Ambil data tenant
    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetUserId }
    });

    const { searchParams } = new URL(req.url);
    const qsType = searchParams.get("type");

    // Ambil semua transaksi
    const transactions = await prisma.transaction.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = tenant?.name || "Kasir UMKM";
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet("Riwayat Transaksi");

    const category = qsType || tenant?.category || "RETAIL";
    const businessType = category.toUpperCase();
    
    const isRental = businessType.includes("RENTAL");
    const isService = businessType.includes("JASA") || businessType.includes("SERVIS");

    let pelangganHeader = "Nama Pelanggan";
    let totalHeader = "Total Belanja (Rp)";

    if (isRental) {
      pelangganHeader = "Nama Penyewa";
      totalHeader = "Total Sewa (Rp)";
    } else if (isService) {
      pelangganHeader = "Nama Pelanggan";
      totalHeader = "Total Tagihan (Rp)";
    }

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "ID Transaksi", key: "id", width: 15 },
      { header: "Tanggal", key: "tanggal", width: 20 },
      { header: pelangganHeader, key: "pelanggan", width: 25 },
      { header: "Metode Bayar", key: "metode", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: totalHeader, key: "total", width: 20 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2E8F0" }
    };

    transactions.forEach((tx, index) => {
      worksheet.addRow({
        no: index + 1,
        id: tx.id,
        tanggal: tx.createdAt.toLocaleString("id-ID"),
        pelanggan: tx.customerName || "-",
        metode: tx.method.toUpperCase(),
        status: tx.status.toUpperCase(),
        total: tx.total
      });
    });

    worksheet.getColumn("total").numFmt = '"Rp"#,##0;[Red]-"Rp"#,##0';

    const buffer = await workbook.xlsx.writeBuffer();

    const response = new NextResponse(buffer);
    response.headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.headers.set("Content-Disposition", `attachment; filename="Laporan_Transaksi_${tenant?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Toko'}.xlsx"`);
    
    return response;
  } catch (error) {
    console.error("Export Backup Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
