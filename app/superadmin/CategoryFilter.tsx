"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

const categories = [
  { value: "all", label: "Semua" },
  { value: "F&B", label: "F&B" },
  { value: "Retail", label: "Retail" },
  { value: "Jasa/Servis", label: "Jasa / Servis" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentKategori = searchParams.get("kategori") || "Semua";

  // Normalise: nilai URL "Semua" atau tidak ada → value "all"
  const currentValue =
    currentKategori === "Semua" || !currentKategori ? "all" : currentKategori;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (selected === "all") {
      params.set("kategori", "Semua");
    } else {
      params.set("kategori", selected);
    }
    params.set("page", "1"); // Reset ke halaman pertama saat filter berubah
    router.push(`/superadmin?${params.toString()}`);
  }

  return (
    <div className="relative w-full md:w-64">
      {/* Ikon Filter di dalam select */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Filter className="h-4 w-4 text-slate-400" />
      </div>
      <select
        value={currentValue}
        onChange={handleChange}
        className="block w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer"
        aria-label="Filter Kategori Tenant"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      {/* Chevron custom agar appearance-none tetap punya arrow */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
