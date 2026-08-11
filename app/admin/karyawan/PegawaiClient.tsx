"use client";

import { useState } from "react";
import { Plus, X, Loader2, Trash2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { createCashier, deleteEmployee } from "./actions";

interface Employee {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  createdAt: Date;
}

export function PegawaiClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // State untuk Modal Hapus Karyawan
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{id: string, clerkUserId: string, name: string} | null>(null);

  const maxEmployees = 2;
  const isLimitReached = initialEmployees.length >= maxEmployees;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createCashier(formData);
      if (res?.success) {
        setSuccess("Kasir berhasil ditambahkan.");
        setTimeout(() => setIsModalOpen(false), 1500);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menambahkan kasir.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(selectedEmployee.id);
    try {
      const res = await deleteEmployee(selectedEmployee.id, selectedEmployee.clerkUserId);
      if (res?.success) {
        setIsDeleteModalOpen(false);
        setSelectedEmployee(null);
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus karyawan.");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-800">Daftar Karyawan (Kasir)</h3>
            <p className="text-xs text-gray-500 mt-1">Kuota: {initialEmployees.length} / {maxEmployees} Kasir</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLimitReached}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isLimitReached
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-95"
            }`}
          >
            <Plus className="w-4 h-4" />
            {isLimitReached ? "Batas Maksimal" : "Tambah Kasir"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-700 uppercase font-bold text-xs border-b">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Email / Username</th>
                <th className="px-6 py-4">Tgl Terdaftar</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <p className="font-medium text-gray-500">Belum ada kasir yang terdaftar.</p>
                  </td>
                </tr>
              ) : (
                initialEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{emp.name}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{formatDate(emp.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                        AKTIF
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedEmployee({ id: emp.id, clerkUserId: emp.clerkUserId, name: emp.name });
                          setIsDeleteModalOpen(true);
                        }}
                        disabled={isDeleting === emp.id}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Hapus Karyawan"
                      >
                        {isDeleting === emp.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Kasir */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Tambah Kasir Baru</h3>
              <button
                type="button"
                onClick={() => !isLoading && setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Nama Lengkap Kasir
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ketik nama lengkap..."
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 text-gray-900 shadow-sm px-4 py-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Email / Username
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Ketik email aktif..."
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 text-gray-900 shadow-sm px-4 py-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Password Sementara
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={8}
                    placeholder="Ketik password sementara (min. 8 karakter)..."
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 text-gray-900 shadow-sm px-4 py-3 pr-12 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm border-0 transition-all duration-200 ease-in-out active:scale-[0.98] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Buat Akun"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 text-center p-6">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black mb-2 text-slate-800">Hapus Karyawan?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus <strong>{selectedEmployee.name}</strong>? Akun ini tidak akan dapat mengakses sistem lagi.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                disabled={!!isDeleting}
                className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete} 
                disabled={!!isDeleting}
                className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
