import { openDB, DBSchema, IDBPDatabase } from 'idb';

type KasirOfflineDB = DBSchema & {
  pendingTransactions: {
    key: string;
    value: any;
    indexes: { 'by-synced': boolean; 'by-created': number };
  };
  cachedProducts: {
    key: string;
    value: any;
    indexes: { 'by-category': string; 'by-name': string; 'by-barcode': string };
  };
  cachedTables: {
    key: string;
    value: any;
  };
  settings: {
    key: string;
    value: any;
  };
  syncQueue: {
    key: string;
    value: any;
    indexes: { 'by-status': string; 'by-type': string };
  };
};

let dbPromise: Promise<IDBPDatabase<KasirOfflineDB>> | null = null;

export function getOfflineDB() {
  if (!dbPromise) {
    dbPromise = openDB<KasirOfflineDB>('kasir-umkm-offline', 1, {
      upgrade(db) {
        const txStore = db.createObjectStore('pendingTransactions', { keyPath: 'id' });
        txStore.createIndex('by-synced', 'synced');
        txStore.createIndex('by-created', 'createdAt');

        const prodStore = db.createObjectStore('cachedProducts', { keyPath: 'id' });
        prodStore.createIndex('by-category', 'category');
        prodStore.createIndex('by-name', 'name');
        prodStore.createIndex('by-barcode', 'barcode');

        db.createObjectStore('cachedTables', { keyPath: 'id' });

        db.createObjectStore('settings', { keyPath: 'key' });

        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('by-status', 'status');
        syncStore.createIndex('by-type', 'type');
      },
    });
  }
  return dbPromise;
}

// ---------- HIGH-LEVEL HELPERS ----------

export async function saveTransactionOffline(txData: any) {
  const db = await getOfflineDB();
  const localId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await db.put('pendingTransactions', {
    id: localId,
    data: txData,
    createdAt: Date.now(),
    retryCount: 0,
    synced: false,
  });
  await addToSyncQueue('transaction', { localId, ...txData });
  return localId;
}

export async function getPendingTransactions() {
  const db = await getOfflineDB();
  return db.getAllFromIndex('pendingTransactions', 'by-synced', false);
}

export async function markTransactionSynced(localId: string) {
  const db = await getOfflineDB();
  const tx = await db.get('pendingTransactions', localId);
  if (tx) {
    (tx as any).synced = true;
    await db.put('pendingTransactions', tx);
  }
  await updateSyncQueueStatus(localId, 'done');
}

export async function cacheProducts(products: any[]) {
  const db = await getOfflineDB();
  const tx = db.transaction('cachedProducts', 'readwrite');
  for (const p of products) {
    await tx.store.put({ ...p, updatedAt: Date.now() });
  }
  await tx.done;
}

export async function searchProductsOffline(query: string, category?: string) {
  const db = await getOfflineDB();
  const lowerQuery = query.toLowerCase();

  if (query.includes(' ') || query.length > 2) {
    const all = await db.getAll('cachedProducts');
    return all.filter((p: any) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.barcode?.includes(query) ||
      (category ? p.category === category : true)
    );
  }
  if (/^\d{8,14}$/.test(query)) {
    const byBarcode = await db.getFromIndex('cachedProducts', 'by-barcode', query);
    return byBarcode ? [byBarcode] : [];
  }
  return [];
}

export async function getProductByBarcodeOffline(barcode: string) {
  const db = await getOfflineDB();
  return db.getFromIndex('cachedProducts', 'by-barcode', barcode);
}

export async function cacheTables(tables: any[]) {
  const db = await getOfflineDB();
  const tx = db.transaction('cachedTables', 'readwrite');
  for (const t of tables) {
    await tx.store.put({ ...t, updatedAt: Date.now() });
  }
  await tx.done;
}

export async function getCachedTables() {
  const db = await getOfflineDB();
  return db.getAll('cachedTables');
}

export async function setOfflineSetting(key: string, value: any) {
  const db = await getOfflineDB();
  await db.put('settings', { key, value, updatedAt: Date.now(), id: key });
}

export async function getOfflineSetting(key: string) {
  const db = await getOfflineDB();
  const record = await db.get('settings', key);
  return record?.value;
}

// ---------- SYNC QUEUE ----------

async function addToSyncQueue(type: string, payload: any) {
  const db = await getOfflineDB();
  const id = `sync_${type}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await db.put('syncQueue', {
    id,
    type: type as any,
    payload,
    status: 'pending',
    attempts: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

async function updateSyncQueueStatus(id: string, status: string, error?: string) {
  const db = await getOfflineDB();
  const item = await db.get('syncQueue', id);
  if (item) {
    const i = item as any;
    i.status = status;
    i.attempts += 1;
    i.updatedAt = Date.now();
    if (error) i.lastError = error;
    await db.put('syncQueue', i);
  }
}

export async function getPendingSyncQueue() {
  const db = await getOfflineDB();
  return db.getAllFromIndex('syncQueue', 'by-status', 'pending');
}

export async function processSyncQueue(apiBase: string, authToken: string) {
  const queue = await getPendingSyncQueue();
  for (const item of queue) {
    const i = item as any;
    await updateSyncQueueStatus(i.id, 'syncing');
    try {
      const endpoint = i.type === 'transaction' ? '/api/transactions' :
                       i.type === 'product' ? '/api/products' :
                       i.type === 'table' ? '/api/tables' : '/api/settings';

      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(i.payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (i.type === 'transaction') {
        await markTransactionSynced(i.payload.localId);
      }
      await updateSyncQueueStatus(i.id, 'done');
    } catch (err: any) {
      await updateSyncQueueStatus(i.id, 'failed', err.message);
      if (i.attempts >= 5) {
        console.error('Sync max retry reached:', i.id, err.message);
      }
    }
  }
}

// ---------- NETWORK DETECTION & AUTO SYNC ----------

let syncInterval: ReturnType<typeof setInterval> | null = null;
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
// Bug 1 fix: store handler refs so removeEventListener works correctly
let _onlineHandler: (() => void) | null = null;
let _offlineHandler: (() => void) | null = null;

export function startAutoSync(apiBase: string, getToken: () => Promise<string | null>, intervalMs = 30000) {
  if (syncInterval) return;

  const attemptSync = async () => {
    if (!isOnline) return;
    try {
      const token = await getToken();
      if (!token) return;
      await processSyncQueue(apiBase, token);
    } catch (e) {
      console.warn('Auto-sync failed:', e);
    }
  };

  attemptSync();

  syncInterval = setInterval(attemptSync, intervalMs);

  _onlineHandler = () => { isOnline = true; attemptSync(); };
  _offlineHandler = () => { isOnline = false; };

  window.addEventListener('online', _onlineHandler);
  window.addEventListener('offline', _offlineHandler);
}

export function stopAutoSync() {
  if (syncInterval) { clearInterval(syncInterval); syncInterval = null; }
  if (_onlineHandler) { window.removeEventListener('online', _onlineHandler); _onlineHandler = null; }
  if (_offlineHandler) { window.removeEventListener('offline', _offlineHandler); _offlineHandler = null; }
}

export function getOnlineStatus() {
  return isOnline;
}