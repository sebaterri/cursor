import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  constructor() {
    // Cache with 10 minute standard TTL
    this.cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, ttl);
  }

  /**
   * Delete value from cache
   */
  delete(key: string): void {
    this.cache.del(key);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.flushAll();
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export const cacheService = new CacheService();
