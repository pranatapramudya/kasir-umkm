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

    const tenantId = (sessionClaims?.metadata as any)?.tenantId;
    const targetTenantId = tenantId || userId;

    // Ambil data profil tenant
    const tenant = await prisma.tenant.findUnique({
      where: { userId: targetTenantId }
    });

    const storeName = tenant?.name || "Toko";
    const category = tenant?.category || "Retail";
    const isRental = isRentalTravelCategory(category);
    const isJasa = isServiceBusinessCategory(category) && !isRental;
    const isFNB = category === "FNB" || category === "F&B" || category === "F&B / Kuliner";

    // Ambil seluruh produk/layanan milik tenant yang tidak diarsipkan
    const products = await prisma.product.findMany({
      where: {
        userId: targetTenantId,
        isArchived: false,
      },
      orderBy: [
        { category: "asc" },
        { name: "asc" }
      ]
    });

    let headers: string[] = [];
    let formattedData: any[] = [];

    if (isRental) {
      headers = [
        "Nama Unit / Properti",
        "Kategori",
        "Biaya Operasional (B.Ops)",
        "Harga Sewa (Rp)",
        "Fasilitas / Deskripsi",
        "Status"
      ];
      formattedData = products.map((p) => ({
        "Nama Unit / Properti": p.name,
        "Kategori": p.category || "Umum",
        "Biaya Operasional (B.Ops)": p.hpp,
        "Harga Sewa (Rp)": p.hargaJual,
        "Fasilitas / Deskripsi": p.description || "-",
        "Status": p.isActive ? "Aktif" : "Nonaktif"
      }));
    } else if (isJasa) {
      headers = [
        "Nama Layanan",
        "Kategori",
        "Tarif Layanan (Rp)",
        "Komisi Staf (Rp)",
        "Deskripsi Layanan",
        "Status"
      ];
      formattedData = products.map((p) => ({
        "Nama Layanan": p.name,
        "Kategori": p.category || "Umum",
        "Tarif Layanan (Rp)": p.hargaJual,
        "Komisi Staf (Rp)": p.employeeCommission || 0,
        "Deskripsi Layanan": p.description || "-",
        "Status": p.isActive ? "Aktif" : "Nonaktif"
      }));
    } else {
      // Retail / F&B
      headers = [
        "Kode Barang / SKU",
        isFNB ? "Nama Menu" : "Nama Produk",
        "Kategori",
        "Harga Modal (HPP)",
        "Harga Jual (Rp)",
        "Stok",
        "Batas Minimum Stok",
        "Status"
      ];
      formattedData = products.map((p) => ({
        "Kode Barang / SKU": p.kodeBarang || "-",
        [isFNB ? "Nama Menu" : "Nama Produk"]: p.name,
        "Kategori": p.category || "Umum",
        "Harga Modal (HPP)": p.hpp,
        "Harga Jual (Rp)": p.hargaJual,
        "Stok": p.stock,
        "Batas Minimum Stok": p.minStockThreshold,
        "Status": p.isActive ? "Aktif" : "Nonaktif"
      }));
    }

    if (formattedData.length === 0) {
      const emptyRow: any = {};
      headers.forEach(h => emptyRow[h] = "");
      emptyRow[headers[0]] = "Belum ada data produk/layanan pada katalog";
      formattedData.push(emptyRow);
    }

    // Generate Excel Sheet & Book
    const worksheet = xlsx.utils.json_to_sheet(formattedData, { header: headers });

    const colWidths = headers.map(h => ({
      wch: Math.max(h.length + 4, 18)
    }));
    worksheet["!cols"] = colWidths;

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Katalog Produk");

    const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    const safeStoreName = storeName.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Katalog_Produk_${safeStoreName}.xlsx`;

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error) {
    console.error("[EXPORT_PRODUCTS_ERROR]", error);
    return NextResponse.json({ error: "Gagal mengekspor katalog produk" }, { status: 500 });
  }
}
