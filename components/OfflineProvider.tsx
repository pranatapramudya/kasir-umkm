"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  getOfflineDB,
  saveTransactionOffline,
  getPendingTransactions,
  markTransactionSynced,
  cacheProducts,
  searchProductsOffline,
  getProductByBarcodeOffline,
  cacheTables,
  getCachedTables,
  setOfflineSetting,
  getOfflineSetting,
  startAutoSync,
  stopAutoSync,
  getOnlineStatus,
  processSyncQueue,
} from '@/lib/offline-db';
import { useAuth } from '@clerk/nextjs';
import { WifiOff, Wifi, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  saveTransaction: (data: any) => Promise<string>;
  searchProducts: (query: string, category?: string) => Promise<any[]>;
  getProductByBarcode: (barcode: string) => Promise<any | undefined>;
  cacheProducts: (products: any[]) => Promise<void>;
  cacheTables: (tables: any[]) => Promise<void>;
  getCachedTables: () => Promise<any[]>;
  setSetting: (key: string, value: any) => Promise<void>;
  getSetting: (key: string) => Promise<any>;
  forceSync: () => Promise<void>;
  lastSyncTime: number | null;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Update pending count
  const refreshPendingCount = useCallback(async () => {
    try {
      const pending = await getPendingTransactions();
      setPendingCount(pending.length);
    } catch (e) {
      console.warn('Failed to get pending count:', e);
    }
  }, []);

  // Force sync now
  const forceSync = useCallback(async () => {
    if (!isOnline) return;
    try {
      const token = await getToken();
      if (!token) {
        console.warn('No auth token available for sync');
        return;
      }
      await processSyncQueue(
        process.env.NEXT_PUBLIC_API_BASE || '/api',
        token
      );
      setLastSyncTime(Date.now());
      await refreshPendingCount();
    } catch (e) {
      console.error('Force sync failed:', e);
    }
  }, [isOnline, getToken, refreshPendingCount]);

  // Initialization
  useEffect(() => {
    setMounted(true);
    
    // Check initial online status
    const online = getOnlineStatus();
    setIsOnline(online);

    // Listen for online/offline
    const handleOnline = () => {
      setIsOnline(true);
      forceSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Start auto-sync
    startAutoSync(
      process.env.NEXT_PUBLIC_API_BASE || '/api',
      async () => {
        const token = await getToken();
        return token || '';
      },
      30000 // 30 detik
    );

    // Initial pending count
    refreshPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopAutoSync();
    };
  }, [getToken, refreshPendingCount, forceSync]);

  // Default context for SSR / before mount
  const defaultContext: OfflineContextType = {
    isOnline: true,
    pendingCount: 0,
    saveTransaction: saveTransactionOffline,
    searchProducts: searchProductsOffline,
    getProductByBarcode: getProductByBarcodeOffline,
    cacheProducts,
    cacheTables,
    getCachedTables,
    setSetting: setOfflineSetting,
    getSetting: getOfflineSetting,
    forceSync: async () => {},
    lastSyncTime: null,
  };

  return (
    <OfflineContext.Provider value={mounted ? {
      isOnline,
      pendingCount,
      saveTransaction: saveTransactionOffline,
      searchProducts: searchProductsOffline,
      getProductByBarcode: getProductByBarcodeOffline,
      cacheProducts,
      cacheTables,
      getCachedTables,
      setSetting: setOfflineSetting,
      getSetting: getOfflineSetting,
      forceSync,
      lastSyncTime,
    } : defaultContext}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}

// ---------- OFFLINE INDICATOR COMPONENT ----------

export function OfflineIndicator() {
  const { isOnline, pendingCount, forceSync, lastSyncTime } = useOffline();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (isOnline && pendingCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {!isOnline && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 shadow-lg text-sm font-medium animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-600 text-white rounded-full text-xs">
              {pendingCount} antrean
            </span>
          )}
        </div>
      )}
      {isOnline && pendingCount > 0 && (
        <button
          onClick={forceSync}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 shadow-lg text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Sinkronkan {pendingCount} transaksi</span>
        </button>
      )}
    </div>
  );
}

// ---------- PRODUCT SEARCH HOOK (OFFLINE-FIRST) ----------

export function useProductSearch() {
  const { searchProducts, getProductByBarcode, isOnline } = useOffline();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string, category?: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // Selalu coba offline dulu (instan)
      const offlineResults = await searchProducts(query, category);
      setResults(offlineResults);

      // Jika online & hasil offline kosong, fallback ke server (optional)
      if (isOnline && offlineResults.length === 0) {
        // TODO: Server search fallback
      }
    } catch (e) {
      console.error('Search failed:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchProducts, isOnline]);

  const scanBarcode = useCallback(async (barcode: string) => {
    setLoading(true);
    try {
      const product = await getProductByBarcode(barcode);
      if (product) setResults([product]);
      else setResults([]);
      return product;
    } catch (e) {
      console.error('Barcode lookup failed:', e);
      setResults([]);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [getProductByBarcode]);

  return { results, loading, search, scanBarcode };
}