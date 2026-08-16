import React from 'react';
import { ShoppingCart, ExternalLink, ShieldAlert, MonitorSmartphone, Printer, Inbox } from 'lucide-react';
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isRentalTravelCategory } from "@/lib/business-category";

export const dynamic = 'force-dynamic';

export default async function HardwarePage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const metadata = (sessionClaims?.metadata as Record<string, any>) || {};
  const role = metadata.role as string | undefined;
  const tenantId = metadata.tenantId as string | undefined;
  const targetUserId = role === 'CASHIER' && tenantId ? tenantId : userId;

  const tenant = await prisma.tenant.findUnique({
    where: { userId: targetUserId },
    select: { category: true }
  });

  const isRental = isRentalTravelCategory(tenant?.category || "");

  const hardwareItems = [
    {
      id: 1,
      name: "Tablet Kasir Android 10 Inch",
      description: "Tablet performa standar untuk kelancaran aplikasi kasir, layar luas untuk kemudahan transaksi.",
      price: "Mulai dari Rp 1.500.000",
      icon: <MonitorSmartphone className="w-12 h-12 text-blue-500 mb-4" />,
      linkTokopedia: "https://tokopedia.com",
      linkShopee: "https://shopee.co.id",
    },
    {
      id: 2,
      name: isRental ? "Printer Tinta/Dokumen A4" : "Printer Thermal Bluetooth 58mm",
      description: isRental 
        ? "Printer handal untuk mencetak Invoice, Surat Jalan, dan Perjanjian Sewa format A4 secara profesional." 
        : "Printer ringkas tanpa kabel. Langsung cetak struk dari tablet atau HP Anda via Bluetooth.",
      price: isRental ? "Mulai dari Rp 950.000" : "Mulai dari Rp 250.000",
      icon: <Printer className={`w-12 h-12 mb-4 ${isRental ? 'text-indigo-500' : 'text-emerald-500'}`} />,
      linkTokopedia: "https://tokopedia.com",
      linkShopee: "https://shopee.co.id",
    },
    {
      id: 3,
      name: "Stand Holder & Cash Drawer (Laci Uang)",
      description: "Laci uang otomatis dan stand dudukan tablet untuk membuat meja kasir Anda terlihat profesional.",
      price: "Mulai dari Rp 350.000",
      icon: <Inbox className="w-12 h-12 text-orange-500 mb-4" />,
      linkTokopedia: "https://tokopedia.com",
      linkShopee: "https://shopee.co.id",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          Rekomendasi Alat Kasir
        </h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base max-w-2xl">
          Tingkatkan profesionalitas bisnis Anda. Berikut adalah perangkat keras pilihan yang dijamin kompatibel dengan PJTECH Kasir UMKM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hardwareItems.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-center pt-4 pb-2">
              {item.icon}
            </div>
            <div className="flex-1 text-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.name}</h3>
              <p className="text-sm text-slate-500">{item.description}</p>
              <div className="mt-4 inline-block bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-100">
                {item.price}
              </div>
            </div>
            
            <div className="space-y-3 mt-auto">
              <a 
                href={item.linkTokopedia} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Beli di Tokopedia <ExternalLink className="w-4 h-4" />
              </a>
              <a 
                href={item.linkShopee} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Beli di Shopee <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DISCLAIMER */}
      <div className="mt-12 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
          <ShieldAlert className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-1">Catatan Penting</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            PJTECH KASIR UMKM hanya menyediakan layanan perangkat lunak (Software). Seluruh perangkat keras (Hardware) yang dibeli melalui tautan rekomendasi pihak ketiga (Affiliate) di atas adalah tanggung jawab penuh dari penjual/marketplace terkait. Kami tidak menerima klaim garansi, retur, atau dukungan teknis atas kerusakan perangkat keras fisik.
          </p>
        </div>
      </div>
    </div>
  );
}
