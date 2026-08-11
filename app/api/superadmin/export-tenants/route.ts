import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    // 1. Validasi Otorisasi Mutlak
    const role = (sessionClaims?.metadata as any)?.role || sessionClaims?.role;
    if (role !== "SUPERADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 2. Pengambilan Data Tenant
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Fetch omset per tenant for the current month
    const transactionsAggr = await prisma.transaction.groupBy({
      by: ["userId"],
      where: {
        userId: { in: tenants.map((t) => t.userId) },
        status: { in: ["completed", "COMPLETED", "paid", "PAID", "selesai", "SELESAI"] },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        total: true,
      },
    });

    const omsetMap = transactionsAggr.reduce((acc, curr) => {
      acc[curr.userId] = curr._sum.total || 0;
      return acc;
    }, {} as Record<string, number>);

    // 3. Setup ExcelJS Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "PJTECH SUPERADMIN";
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet("Master Data Tenant");

    // Define columns
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama Toko", key: "namaToko", width: 30 },
      { header: "Kategori", key: "kategori", width: 25 },
      { header: "Telepon", key: "telepon", width: 15 },
      { header: "Tanggal Daftar", key: "tanggalDaftar", width: 15 },
      { header: "Status Paket", key: "statusPaket", width: 15 },
      { header: "Status Sistem", key: "statusSistem", width: 15 },
      { header: "Omset Bulan Ini", key: "omset", width: 20 },
      { header: "Potensi Upgrade Tahunan (Rp)", key: "potensiUpgrade", width: 30 }
    ];

    // Style Header Row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2E8F0" } // Slate-200
    };

    // 4. Fill Data
    tenants.forEach((tenant, index) => {
      const isExpired = tenant.subscriptionEndsAt ? new Date(tenant.subscriptionEndsAt) < now : true;
      const isPro = tenant.subscriptionPlan?.toUpperCase().includes("PRO");
      const isTrial = tenant.subscriptionPlan?.toUpperCase() === "TRIAL";

      let statusSystem = "OFF";
      if ((isTrial || isPro) && !isExpired) {
        statusSystem = "ON";
      }

      const omset = omsetMap[tenant.userId] || 0;
      
      let potensiUpgrade = 0;
      if (isTrial || isPro || tenant.subscriptionPlan === "FREE") {
          potensiUpgrade = 1188000;
      }

      worksheet.addRow({
        no: index + 1,
        namaToko: tenant.name,
        kategori: tenant.category,
        telepon: tenant.phone || "-",
        tanggalDaftar: tenant.createdAt.toLocaleDateString("id-ID"),
        statusPaket: tenant.subscriptionPlan || "-",
        statusSistem: statusSystem,
        omset: omset,
        potensiUpgrade: potensiUpgrade
      });
    });

    // Formatting for Currency Columns (Omset & Potensi)
    worksheet.getColumn("omset").numFmt = '"Rp"#,##0;[Red]-"Rp"#,##0';
    worksheet.getColumn("potensiUpgrade").numFmt = '"Rp"#,##0;[Red]-"Rp"#,##0';

    // 5. Generate Excel Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 6. Return Response
    const response = new NextResponse(buffer);
    response.headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.headers.set("Content-Disposition", 'attachment; filename="Laporan_Tenant_PJTECH.xlsx"');
    
    return response;
  } catch (error) {
    console.error("Export Tenants Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
