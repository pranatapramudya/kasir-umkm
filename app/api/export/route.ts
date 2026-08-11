import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
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
    if (category === 'F&B / Kuliner') {
      headers = ["No", "Tanggal", "ID Transaksi", "No. Meja", "Nama Menu", "Catatan Pesanan", "Qty", "Harga Satuan", "Total Pendapatan", "Metode Pembayaran"];
    } else if (category === 'Jasa / Servis') {
      headers = ["No", "Tanggal", "ID Transaksi", "Nama Layanan", "Petugas/Karyawan", "Qty", "Total Pendapatan", "Metode Pembayaran"];
    } else {
      headers = ["No", "Tanggal", "ID Transaksi", "Nama Produk", "SKU/Kode", "Qty Terjual", "Harga Satuan", "Total HPP", "Total Pendapatan", "Laba Bersih", "Metode Pembayaran"];
    }

    let formattedData: any[] = [];

    if (transactions.length === 0) {
      // Zero-Data Handling: still create the headers and add 1 note row
      const emptyRow: any = {};
      headers.forEach(h => emptyRow[h] = "");
      emptyRow[headers[0]] = "Belum ada data transaksi pada periode ini";
      formattedData.push(emptyRow);
    } else {
      let no = 1;
      transactions.forEach((t) => {
        t.items.forEach(item => {
          const p = productMap.get(item.productId);
          if (category === 'F&B / Kuliner') {
            formattedData.push({
              "No": no++,
              "Tanggal": t.createdAt.toLocaleString("id-ID"),
              "ID Transaksi": t.id,
              "No. Meja": t.tableId || "-",
              "Nama Menu": p?.name || "-",
              "Catatan Pesanan": item.note || "-",
              "Qty": item.qty,
              "Harga Satuan": item.price,
              "Total Pendapatan": item.qty * item.price,
              "Metode Pembayaran": t.method
            });
          } else if (category === 'Jasa / Servis') {
            formattedData.push({
              "No": no++,
              "Tanggal": t.createdAt.toLocaleString("id-ID"),
              "ID Transaksi": t.id,
              "Nama Layanan": p?.name || "-",
              "Petugas/Karyawan": t.customerName || "-",
              "Qty": item.qty,
              "Total Pendapatan": item.qty * item.price,
              "Metode Pembayaran": t.method
            });
          } else {
            const hpp = p?.hpp || 0;
            const totalHpp = hpp * item.qty;
            const pendapatan = item.qty * item.price;
            const labaBersih = pendapatan - totalHpp;
            
            formattedData.push({
              "No": no++,
              "Tanggal": t.createdAt.toLocaleString("id-ID"),
              "ID Transaksi": t.id,
              "Nama Produk": p?.name || "-",
              "SKU/Kode": p?.kodeBarang || "-",
              "Qty Terjual": item.qty,
              "Harga Satuan": item.price,
              "Total HPP": totalHpp,
              "Total Pendapatan": pendapatan,
              "Laba Bersih": labaBersih,
              "Metode Pembayaran": t.method
            });
          }
        });
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
