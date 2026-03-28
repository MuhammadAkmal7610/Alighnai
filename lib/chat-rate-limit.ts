/**
 * In-memory sliding-window rate limiter per client IP.
 * Note: On serverless with many instances, limits are per instance, not global.
 * For strict global limits, use Upstash or similar.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 20;
const MAX_TRACKED_IPS = 5000;

const timestampsByIp = new Map<string, number[]>();

function pruneOld(ip: string, now: number): number[] {
  const arr = timestampsByIp.get(ip) ?? [];
  return arr.filter((t) => now - t < WINDOW_MS);
}

function sweepIfNeeded() {
  if (timestampsByIp.size <= MAX_TRACKED_IPS) return;
  const now = Date.now();
  for (const [ip, arr] of timestampsByIp) {
    const next = arr.filter((t) => now - t < WINDOW_MS);
    if (next.length === 0) timestampsByIp.delete(ip);
    else timestampsByIp.set(ip, next);
  }
}

/** Returns true if the request is allowed, false if rate limited. */
export function allowChatRequest(ip: string): boolean {
  const now = Date.now();
  const recent = pruneOld(ip, now);
  if (recent.length >= MAX_REQUESTS) {
    timestampsByIp.set(ip, recent);
    return false;
  }
  recent.push(now);
  timestampsByIp.set(ip, recent);
  sweepIfNeeded();
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}
