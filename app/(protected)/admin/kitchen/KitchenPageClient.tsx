"use client";

import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { ChefHat, Clock, CheckCircle2, Flame, RefreshCw, Volume2, AlertCircle, Bell, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

// Professional sound notification (base64 encoded short beep)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA';

export default function KitchenPageClient() {
  const { data, error, mutate, isLoading } = useSWR<{ success: boolean; orders: KitchenOrder[] }>(
    '/api/kitchen',
    fetcher,
    { refreshInterval: 3000, revalidateOnFocus: true, dedupingInterval: 1000 }
  );

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const prevOrdersRef = useRef<string[]>([]);

  const orders = data?.orders || [];

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    // Get token from meta tag or localStorage
    const token = document.querySelector('meta[name="ws-token"]')?.getAttribute('content') || 
                  localStorage.getItem('ws_token');
    
    if (!token) {
      console.warn('[KDS] No WebSocket token found, falling back to polling');
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[KDS] WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'order_status_update') {
          // Optimistic update already applied, just revalidate to sync
          mutate();
          // Play sound for status changes
          if (soundEnabled) {
            const audio = new Audio(NOTIFICATION_SOUND);
            audio.volume = 0.4;
            audio.play().catch(() => {});
          }
        } else if (msg.type === 'new_order') {
          // New order arrived - revalidate
          mutate();
          if (soundEnabled) {
            const audio = new Audio(NOTIFICATION_SOUND);
            audio.volume = 0.6;
            audio.play().catch(() => {});
          }
        }
      } catch (e) {
        console.warn('[KDS] WS message parse error:', e);
      }
    };

    ws.onclose = () => {
      console.log('[KDS] WebSocket disconnected');
      setWsConnected(false);
      // Auto-reconnect after 5s
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          // Trigger re-render to reconnect
          mutate();
        }
      }, 5000);
    };

    ws.onerror = (err) => {
      console.error('[KDS] WebSocket error:', err);
      setWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [mutate, soundEnabled]);

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
      if (!res.ok) throw new Error('Gagal update status');
      
      toast.success(
        nextStatus === 'cooking'
          ? 'Mulai memasak'
          : nextStatus === 'ready'
          ? 'Pesanan siap antar!'
          : 'Pesanan selesai disajikan'
      );
      // Revalidate to ensure sync
      mutate();
    } catch (err) {
      toast.error('Gagal memperbarui status dapur');
      // Revert on error
      mutate();
    } finally {
      setUpdatingId(null);
    }
  };

  // Play notification sound on new orders (fallback for polling)
  useEffect(() => {
    if (!soundEnabled || !data || wsConnected) return; // Skip if WS connected
    const currentIds = orders.map(o => o.id);
    const prevIds = prevOrdersRef.current;
    const newOrders = currentIds.filter(id => !prevIds.includes(id));
    
    if (newOrders.length > 0) {
      setNewOrderCount(c => c + newOrders.length);
      const audio = new Audio(NOTIFICATION_SOUND);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    }
    prevOrdersRef.current = currentIds;
  }, [orders, soundEnabled, wsConnected]);

  const clearNewOrderBadge = () => setNewOrderCount(0);

  const getTimeAgo = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff}m lalu`;
    return `${Math.floor(diff / 60)}j lalu`;
  };

  const getStatusConfig = (status: KitchenOrder['status']) => {
    type NextStatus = 'cooking' | 'ready' | 'completed';
    switch (status) {
      case 'pending':
        return { label: 'Antre', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, next: 'cooking' as NextStatus, nextLabel: 'Mulai Masak', pulse: true, buttonBg: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700' };
      case 'cooking':
        return { label: 'Memasak', bg: 'bg-orange-100 text-orange-800 border-orange-200', icon: Flame, next: 'ready' as NextStatus, nextLabel: 'Siap Antar', pulse: true, buttonBg: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700' };
      case 'ready':
        return { label: 'Siap Antar', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2, next: 'completed' as NextStatus, nextLabel: 'Selesai', pulse: false, buttonBg: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700' };
      case 'completed':
        return { label: 'Selesai', bg: 'bg-slate-100 text-slate-600 border-slate-200', icon: CheckCircle2, next: null, nextLabel: '', pulse: false, buttonBg: 'bg-slate-400' };
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Top Bar KDS - Compact Mobile-First */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 truncate">KITCHEN DISPLAY SYSTEM</h1>
            <p className="text-xs text-gray-500">Antrean Pesanan Dapur & Barista</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          {/* Live indicator with WS status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 shrink-0">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-xs font-medium text-emerald-700">{wsConnected ? 'LIVE' : 'POLLING'}</span>
            <span className="text-xs text-emerald-600 hidden sm:inline">({orders.length} Pesanan)</span>
          </div>

          <button
            onClick={() => { mutate(); clearNewOrderBadge(); }}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors shrink-0"
            title="Refresh Manual"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={e => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            <Volume2 className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Suara Notif</span>
          </label>

          {newOrderCount > 0 && (
            <button
              onClick={clearNewOrderBadge}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold animate-pulse shrink-0"
            >
              <Bell className="w-3 h-3" />
              <span className="hidden sm:inline">{newOrderCount} Baru</span>
            </button>
          )}

          <Link
            href="/admin/pos"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition-colors text-center shrink-0"
          >
            ← Kembali ke Kasir
          </Link>
        </div>
      </div>

      {/* Main Grid Pesanan - Mobile Optimized */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 py-8">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="font-bold">Gagal memuat data dapur</p>
            <p className="text-sm text-gray-500 mt-1">Cek koneksi atau refresh halaman</p>
            <button onClick={() => mutate()} className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-xs font-bold text-white">
              Coba Lagi
            </button>
          </div>
        )}

        {orders.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <ChefHat className="w-20 h-20 text-gray-300 mb-3 opacity-50" />
            <p className="text-base font-medium text-gray-600">Tidak ada pesanan yang antre</p>
            <p className="text-sm text-gray-500">Pesanan baru akan muncul otomatis di sini</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-3" role="list" aria-label="Daftar pesanan dapur">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              const Icon = config.icon;
              const isExpanded = expandedOrders.has(order.id);
              const isUpdating = updatingId === order.id;

              return (
                <article
                  key={order.id}
                  className={`relative bg-white rounded-2xl border-2 shadow-sm transition-all duration-300 ease-out ${
                    config.pulse ? 'animate-pulse ring-2 ring-amber-300' : 'border-gray-200'
                  } ${order.status === 'completed' ? 'opacity-60' : ''}`}
                  style={{ willChange: 'transform, opacity, box-shadow' }}
                >
                  {/* Header Pesanan - Always Visible */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full p-4 flex items-start justify-between gap-3 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${config.bg} shrink-0`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400 font-mono truncate">#{order.id.replace('#', '')}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:inline">{getTimeAgo(order.createdAt)}</span>
                      <span className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </div>
                  </button>

                  {/* Expandable Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isExpanded ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
                    }`}
                    style={{ willChange: 'max-height, opacity' }}
                  >
                    <div className="px-4 border-t border-gray-100 pt-3">
                      {/* Meja / Pelanggan */}
                      <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 text-sm mb-1">
                          <ChefHat className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-semibold text-gray-900 truncate">{order.tableName}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{order.customerName}</p>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm gap-2">
                            <span className="text-gray-700 truncate flex-1 font-medium min-w-0">
                              {item.qty}x {item.productName}
                            </span>
                            {item.note && (
                              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded whitespace-nowrap shrink-0 border border-amber-100">
                                {item.note}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action Button - Full Width Mobile */}
                      {config.next && (
                        <button
                          onClick={() => updateStatus(order.id, config.next)}
                          disabled={isUpdating}
                          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-150 flex items-center justify-center gap-2 ${config.buttonBg} disabled:opacity-50 disabled:cursor-not-allowed shadow-sm touch-manipulation active:scale-[0.98}`}
                        >
                          {isUpdating ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <Icon className="w-5 h-5" />
                              {config.nextLabel}
                            </>
                          )}
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <div className="w-full py-2 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                          Pesanan selesai disajikan
                        </div>
                      )}
                    </div>
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

// Helper component for chevron
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}