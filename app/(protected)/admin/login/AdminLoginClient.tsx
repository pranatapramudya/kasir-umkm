"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginClient() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Mencegah input selain angka
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setPin(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Tembak API autentikasi kita
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok) {
        // Jika sukses, cookie `auth_token` sudah tertanam di browser.
        // Kita bebas redirect ke halaman admin.
        router.push('/admin/dashboard');
      } else {
        setError(data.message || "PIN Salah");
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-slate-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">Login Owner</h1>
        <p className="text-sm text-gray-500 mb-8">Masukkan PIN untuk mengakses dashboard</p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            maxLength={6} 
            className="text-center text-3xl w-full border-b-2 mb-4 outline-none focus:border-blue-600 transition-colors tracking-[0.5em] font-mono" 
            value={pin} 
            onChange={handlePinChange} 
            autoFocus 
            disabled={isLoading}
          />
          
          {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading || pin.length < 4}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm border-0 transition-all duration-200 ease-in-out rounded-xl font-bold disabled:opacity-50 mt-4"
          >
            {isLoading ? "MEMERIKSA..." : "MASUK"}
          </button>
        </form>
      </div>
    </div>
  );
}
