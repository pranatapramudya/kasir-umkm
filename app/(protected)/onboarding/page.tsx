"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding, selectSubscriptionPackage } from "./actions";
import { Store, Check, Coffee, ShoppingBag, Wrench, MoreHorizontal, CarFront, Building2, Package } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

import PricingSection from '@/components/PricingSection';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user) {
      const metadata = user.publicMetadata as Record<string, any>;
      // Jika user sudah menyelesaikan Step 1 (category terisi) tetapi belum memilih paket, bawa langsung ke Step 2
      if (metadata?.category && !metadata?.onboardingComplete) {
        setStep(2);
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    if (!selectedCategory) {
      setError("Silakan pilih kategori usaha terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await completeOnboarding(formData);
      if (result?.success) {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data toko");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
          <PricingSection onSuccessRedirect="/admin" />
        </div>
      </div>
    );
  }

  // BUGFIX UX ONBOARDING: Loading screen sebelumnya menyebabkan pengguna terjebak selamanya
  // jika metadata onboardingComplete = true tetapi tenant = null di database.
  // Sekarang kita selalu menampilkan form jika mereka sampai ke halaman ini.

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm shadow-blue-500/30">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
            Selamat Datang di PJTECH
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Mari siapkan toko kasir Anda dalam 1 menit.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100">
            <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                  Nama Toko / Usaha
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Cth: Warung Kopi Prana"
                    className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                  Nomor Telepon Bisnis (WhatsApp)
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    placeholder="Cth: 08123456789"
                    className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Kategori Usaha
                </label>
                <input type="hidden" name="category" value={selectedCategory} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "RENTAL_PROPERTI", label: "Properti & Penginapan", description: "Kost, Villa, Homestay, Hotel", icon: <Building2 className="w-5 h-5 mb-1.5" /> },
                    { id: "RENTAL_KENDARAAN", label: "Rental Kendaraan & Travel", description: "Sewa Mobil, Motor, Shuttle", icon: <CarFront className="w-5 h-5 mb-1.5" /> },
                    { id: "RENTAL_ALAT", label: "Rental Alat & Barang", description: "Kamera, Outdoor, Sound, Genset", icon: <Package className="w-5 h-5 mb-1.5" /> },
                    { id: "FNB", label: "F&B / Kuliner", description: "Kafe, Resto, Warung Makan", icon: <Coffee className="w-5 h-5 mb-1.5" /> },
                    { id: "RETAIL", label: "Retail & Toko", description: "Toko Kelontong, Butik, Minimarket", icon: <ShoppingBag className="w-5 h-5 mb-1.5" /> },
                    { id: "JASA", label: "Jasa / Servis", description: "Bengkel, Barbershop, Laundry", icon: <Wrench className="w-5 h-5 mb-1.5" /> },
                    { id: "LAINNYA", label: "Lainnya", description: "Usaha & Layanan Lainnya", icon: <MoreHorizontal className="w-5 h-5 mb-1.5" /> },
                  ].map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${selectedCategory === cat.id
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <div className={selectedCategory === cat.id ? "text-blue-600" : "text-slate-400"}>
                        {cat.icon}
                      </div>
                      <span className="text-sm font-semibold">{cat.label}</span>
                      {cat.description && (
                        <span className="mt-0.5 text-xs text-slate-500 leading-tight">{cat.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out px-3 py-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Menyimpan..." : "Lanjutkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
