type CacheEntry<T> = { value: T; expiresAt: number };

const store = new Map<string, CacheEntry<unknown>>();

/**
 * A short-lived in-memory cache for read-only public page data. The database
 * is a remote Postgres instance (real network latency per query), so without
 * this every navigation between public pages pays that round trip again —
 * this makes repeat visits within `ttlMs` instant instead.
 *
 * Admin loaders must NOT use this: an admin needs to see their own edits
 * immediately, not up to `ttlMs` later.
 */
export async function cached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  const now = Date.now();
  if (hit && hit.expiresAt > now) return hit.value as T;

  const value = await fetcher();
  store.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

/** Drops one cached entry (or everything, if no key given) — call after an admin write so the public side reflects it right away. */
export function invalidateCache(key?: string) {
  if (key) store.delete(key);
  else store.clear();
}
