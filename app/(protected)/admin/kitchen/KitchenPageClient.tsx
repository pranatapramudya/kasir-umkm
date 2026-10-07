"use client";

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { ChefHat, Clock, CheckCircle2, Flame, RefreshCw, Volume2, AlertCircle, Bell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { playNotificationChime } from '@/lib/audio';

type KitchenItem = {
  id: number;
  productId: number;
  productName: string;
  qty: number;
  note: string;
};

type KitchenOrder = {
  id: string;
  customerName: string;
  status: 'pending' | 'cooking' | 'ready' | 'completed';
  tableName: string;
  createdAt: string;
  items: KitchenItem[];
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function KitchenPageClient() {
  const { data, error, mutate, isLoading } = useSWR<{ success: boolean; orders: KitchenOrder[] }>(
    '/api/kitchen',
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: true,
      dedupingInterval: 1500,
    }
  );

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const orders = data?.orders || [];

  // Track incoming orders to trigger real-time bell chime (matching SOP/fundamental pattern)
  const isInitialLoadRef = useRef(true);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!data?.orders) return;

    const currentIds = data.orders.map(o => o.id);

    // Pada muat halaman pertama kali, cukup simpan daftar order yang sudah ada tanpa membunyikan bel
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      knownOrderIdsRef.current = new Set(currentIds);
      return;
    }

    // Jika ada ID pesanan baru yang belum pernah tercatat sebelumnya, bunyikan bel notifikasi
    const newOrderIds = currentIds.filter(id => !knownOrderIdsRef.current.has(id));

    if (newOrderIds.length > 0) {
      setNewOrderCount(c => c + newOrderIds.length);
      if (soundEnabled) {
        playNotificationChime();
      }
    }

    knownOrderIdsRef.current = new Set(currentIds);
  }, [data, soundEnabled]);

  // Optimistic status update for instant UI response
  const updateStatusOptimistic = (transactionId: string, nextStatus: KitchenOrder['status']) => {
    mutate(
      (current: any) => {
        if (!current?.orders) return current;
        return {
          ...current,
          orders: current.orders.map((o: KitchenOrder) =>
            o.id === transactionId ? { ...o, status: nextStatus } : o
          )
        };
      },
      { revalidate: false }
    );
  };

  const updateStatus = async (transactionId: string, nextStatus: 'cooking' | 'ready' | 'completed') => {
    // Optimistic update for instant feel
    updateStatusOptimistic(transactionId, nextStatus);
    setUpdatingId(transactionId);

    try {
      const res = await fetch('/api/kitchen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, status: nextStatus }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Gagal update status');
      }

      toast.success(
        nextStatus === 'cooking'
          ? 'Mulai memasak pesanan'
          : nextStatus === 'ready'
          ? 'Pesanan siap diantar!'
          : 'Pesanan selesai disajikan'
      );
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui status dapur');
      mutate();
    } finally {
      setUpdatingId(null);
    }
  };

  const clearNewOrderBadge = () => setNewOrderCount(0);

  const getTimeAgo = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff}m lalu`;
    return `${Math.floor(diff / 60)}j lalu`;
  };

  // Status configuration - Bersih, tegas, TANPA animasi kedap-kedip
  const getStatusConfig = (status: KitchenOrder['status']) => {
    type NextStatus = 'cooking' | 'ready' | 'completed';
    switch (status) {
      case 'pending':
        return {
          label: 'Antre',
          badgeBg: 'bg-amber-100 text-amber-900 border border-amber-300',
          borderClass: 'border-amber-400 bg-white shadow-sm ring-1 ring-amber-200/50',
          headerBg: 'bg-amber-50/70 border-b border-amber-100',
          icon: Clock,
          next: 'cooking' as NextStatus,
          nextLabel: 'Mulai Masak',
          buttonBg: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
        };
      case 'cooking':
        return {
          label: 'Memasak',
          badgeBg: 'bg-orange-100 text-orange-900 border border-orange-300',
          borderClass: 'border-orange-400 bg-white shadow-sm ring-1 ring-orange-200/50',
          headerBg: 'bg-orange-50/70 border-b border-orange-100',
          icon: Flame,
          next: 'ready' as NextStatus,
          nextLabel: 'Siap Antar',
          buttonBg: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
        };
      case 'ready':
        return {
          label: 'Siap Antar',
          badgeBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
          borderClass: 'border-emerald-400 bg-white shadow-sm ring-1 ring-emerald-200/50',
          headerBg: 'bg-emerald-50/70 border-b border-emerald-100',
          icon: CheckCircle2,
          next: 'completed' as NextStatus,
          nextLabel: 'Selesai Saji',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
        };
      case 'completed':
        return {
          label: 'Selesai',
          badgeBg: 'bg-slate-100 text-slate-700 border border-slate-300',
          borderClass: 'border-slate-200 bg-slate-50/50 opacity-60',
          headerBg: 'bg-slate-100/50 border-b border-slate-200',
          icon: CheckCircle2,
          next: null,
          nextLabel: '',
          buttonBg: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden select-none">
      {/* Top Bar - Clean & Responsive */}
      <div className="bg-white border-b px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-800">KITCHEN DISPLAY SYSTEM</h1>
            <p className="text-xs text-slate-500 font-medium">Antrean Pesanan Dapur & Barista Real-time</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">AKTIF</span>
            <span className="text-xs text-emerald-600 font-semibold">({orders.length} Pesanan)</span>
          </div>

          <button
            onClick={() => { mutate(); clearNewOrderBadge(); }}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors shrink-0"
            title="Refresh Manual"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer shrink-0 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={e => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-xs hidden sm:inline">Suara Bel</span>
          </label>

          {newOrderCount > 0 && (
            <button
              onClick={clearNewOrderBadge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shrink-0 shadow-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{newOrderCount} Pesanan Baru</span>
            </button>
          )}

          <Link
            href="/admin/pos"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg text-xs font-bold text-white transition-colors text-center shrink-0 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Kasir</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Pesanan - Nyaman & Tidak Berkedip */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 py-8">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="font-bold">Gagal memuat data dapur</p>
            <p className="text-sm text-slate-500 mt-1">Cek koneksi atau refresh halaman</p>
            <button onClick={() => mutate()} className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-xs font-bold text-white">
              Coba Lagi
            </button>
          </div>
        )}

        {orders.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <ChefHat className="w-20 h-20 text-slate-300 mb-3 opacity-60" />
            <p className="text-base font-bold text-slate-700">Tidak ada pesanan aktif</p>
            <p className="text-sm text-slate-500 mt-1">Pesanan baru dari kasir akan langsung muncul dan membunyikan bel di sini</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" role="list" aria-label="Daftar pesanan dapur">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              const Icon = config.icon;
              const isUpdating = updatingId === order.id;

              return (
                <article
                  key={order.id}
                  className={`rounded-2xl border-2 transition-shadow flex flex-col justify-between overflow-hidden ${config.borderClass}`}
                >
                  <div>
                    {/* Header Pesanan */}
                    <div className={`p-4 flex items-start justify-between gap-3 ${config.headerBg}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-slate-900 text-lg tracking-tight truncate">{order.id}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${config.badgeBg}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-800 truncate">{order.customerName}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-md block mb-1">
                          {order.tableName}
                        </span>
                        <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{getTimeAgo(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Daftar Item Menu */}
                    <div className="p-4 space-y-2.5 max-h-60 overflow-y-auto">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-start justify-between gap-2 text-sm pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900">
                              {item.qty}x {item.productName}
                            </span>
                            {item.note && (
                              <div className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-amber-200/80 font-medium">
                                Catatan: {item.note}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-4 pt-0">
                    {config.next ? (
                      <button
                        onClick={() => updateStatus(order.id, config.next)}
                        disabled={isUpdating}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-150 flex items-center justify-center gap-2 ${config.buttonBg} disabled:opacity-50 disabled:cursor-not-allowed shadow-xs touch-manipulation active:scale-[0.98] cursor-pointer`}
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <Icon className="w-4 h-4" />
                            <span>{config.nextLabel}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 bg-slate-100 rounded-xl border border-slate-200">
                        Pesanan selesai disajikan
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
