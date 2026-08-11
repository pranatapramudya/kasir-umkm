"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding, selectSubscriptionPackage } from "./actions";
import { Store, Check } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

import PricingSection from '@/components/PricingSection';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
    // Dihapus pengecekan onboardingComplete di sini untuk mencegah infinite loop
    // jika tenant di database ternyata kosong/terhapus.
  }, [isLoaded, user, router, step, isLoading]);

  if (!isLoaded || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await completeOnboarding(formData);
      if (result?.success) {
        await user?.reload();
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
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700">
                Kategori Usaha
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  required
                  className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="F&B / Kuliner">F&B / Kuliner</option>
                  <option value="Retail / Toko Kelontong">Retail / Toko Kelontong</option>
                  <option value="Jasa / Servis">Jasa / Servis</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
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
