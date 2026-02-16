const hits = new Map<string, { count: number; resetAt: number }>();

export function throttle(key: string, limit = 8, windowMs = 60000) {
  const now = Date.now();
  const item = hits.get(key);
  if (!item || item.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  item.count += 1;
  return item.count > limit;
}
