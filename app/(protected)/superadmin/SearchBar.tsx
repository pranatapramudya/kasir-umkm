"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    // Debounce pencarian agar tidak setiap ketikan men-trigger navigasi
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reset ke halaman pertama saat mencari
      router.push(`/superadmin?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams]);

  return (
    <div className="relative w-full sm:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari Nama Toko atau No. HP..."
        className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-white shadow-sm"
      />
    </div>
  );
}
