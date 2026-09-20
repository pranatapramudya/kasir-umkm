import Redis from 'ioredis';

// Redis connection (Upstash, Railway, or local)
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 100, 3000),
  enableReadyCheck: true,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

redis.on('connect', () => {
  console.log('[Redis] Connected');
});

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  keyPrefix?: string;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (err) {
    console.warn('[Cache] Get error:', err);
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
  try {
    const { ttl = 300, keyPrefix = 'kasir:' } = options;
    const fullKey = `${keyPrefix}${key}`;
    await redis.setex(fullKey, ttl, JSON.stringify(value));
    
    // Track tags for invalidation
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        await redis.sadd(`tag:${tag}`, fullKey);
        await redis.expire(`tag:${tag}`, ttl + 60);
      }
    }
    return true;
  } catch (err) {
    console.warn('[Cache] Set error:', err);
    return false;
  }
}

export async function cacheDelete(key: string, keyPrefix = 'kasir:'): Promise<boolean> {
  try {
    await redis.del(`${keyPrefix}${key}`);
    return true;
  } catch (err) {
    console.warn('[Cache] Delete error:', err);
    return false;
  }
}

export async function cacheInvalidateByTag(tag: string): Promise<number> {
  if (!process.env.REDIS_URL) return 0;
  try {
    const keys = await redis.smembers(`tag:${tag}`);
    if (keys.length === 0) return 0;
    await redis.del(...keys);
    await redis.del(`tag:${tag}`);
    return keys.length;
  } catch (err) {
    console.warn('[Cache] Invalidate tag error:', err);
    return 0;
  }
}

export async function cacheInvalidatePattern(pattern: string, keyPrefix = 'kasir:'): Promise<number> {
  try {
    const keys = await redis.keys(`${keyPrefix}${pattern}*`);
    if (keys.length === 0) return 0;
    await redis.del(...keys);
    return keys.length;
  } catch (err) {
    console.warn('[Cache] Invalidate pattern error:', err);
    return 0;
  }
}

// Wrapper for API route handlers with caching
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  const fresh = await fetcher();
  await cacheSet(key, fresh, options);
  return fresh;
}

// Specific cache helpers for common queries
export const CacheKeys = {
  products: (tenantId: string) => `products:${tenantId}`,
  productsByCategory: (tenantId: string, category: string) => `products:${tenantId}:cat:${category}`,
  orders: (tenantId: string, status?: string) => `orders:${tenantId}${status ? `:${status}` : ''}`,
  transactions: (tenantId: string, date?: string) => `transactions:${tenantId}${date ? `:${date}` : ''}`,
  analytics: (tenantId: string, range: string) => `analytics:${tenantId}:${range}`,
  kitchenOrders: (tenantId: string) => `kitchen:${tenantId}`,
  tenant: (tenantId: string) => `tenant:${tenantId}`,
  employee: (clerkUserId: string) => `employee:${clerkUserId}`,
};

export const CacheTags = {
  products: (tenantId: string) => `products:${tenantId}`,
  orders: (tenantId: string) => `orders:${tenantId}`,
  transactions: (tenantId: string) => `transactions:${tenantId}`,
  analytics: (tenantId: string) => `analytics:${tenantId}`,
};

export async function invalidateTenantCache(tenantId: string) {
  await Promise.all([
    cacheInvalidateByTag(CacheTags.products(tenantId)),
    cacheInvalidateByTag(CacheTags.orders(tenantId)),
    cacheInvalidateByTag(CacheTags.transactions(tenantId)),
    cacheInvalidateByTag(CacheTags.analytics(tenantId)),
  ]);
}

export { redis };
export default redis;