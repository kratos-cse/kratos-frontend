/** In-flight dedup + short-lived cache for idempotent GETs (client only). */

const inflight = new Map();
const cache = new Map();

const DEFAULT_TTL_MS = 30_000;

function cacheKey(method, url, auth) {
  return `${method}:${url}:${auth ? "auth" : "public"}`;
}

export function clearRequestCache() {
  inflight.clear();
  cache.clear();
}

/**
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} fetcher
 * @param {{ ttlMs?: number }} [options]
 */
export async function dedupeRequest(key, fetcher, options = {}) {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.at < ttlMs) {
    return hit.value;
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = fetcher()
    .then((value) => {
      cache.set(key, { value, at: Date.now() });
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}
