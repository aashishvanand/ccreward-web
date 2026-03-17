/**
 * Usage Limit Service
 *
 * Client-side cache of per-feature daily usage, driven entirely by
 * backend response headers (X-Feature-Used / X-Feature-Remaining).
 *
 * The Cloudflare KV backend is the single source of truth.
 * This module simply caches the last-known values so the UI can
 * show badges and block requests locally without an extra API call.
 *
 * On fresh page load (no cached values), the client assumes full
 * quota — the backend 429 acts as the safety net until the first
 * successful response populates the cache.
 */

// ─── Feature definitions ───────────────────────────────────────────────────────

export const RateLimitedFeature = Object.freeze({
  CALCULATOR: 'calculator',
  BEST_CARD: 'bestCard',
  TRANSFERS: 'transfers',
});

const FEATURE_META = {
  [RateLimitedFeature.CALCULATOR]: { displayName: 'Calculator', iconName: 'Calculate' },
  [RateLimitedFeature.BEST_CARD]: { displayName: 'Best Card', iconName: 'Compare' },
  [RateLimitedFeature.TRANSFERS]: { displayName: 'Transfers', iconName: 'SwapHoriz' },
};

// ─── Default limits (must match backend) ───────────────────────────────────────

const FREE_LIMITS = {
  [RateLimitedFeature.CALCULATOR]: 10,
  [RateLimitedFeature.BEST_CARD]: 10,
  [RateLimitedFeature.TRANSFERS]: 10,
};

// ─── In-memory cache ───────────────────────────────────────────────────────────
// Keyed by feature name → { used, remaining }
// null = not yet populated from a response header

const _cache = {
  [RateLimitedFeature.CALCULATOR]: null,
  [RateLimitedFeature.BEST_CARD]: null,
  [RateLimitedFeature.TRANSFERS]: null,
};

// Simple event bus so React hooks can re-render when headers arrive
const _listeners = new Set();

const notify = () => {
  _listeners.forEach((fn) => {
    try { fn(); } catch { /* ignore */ }
  });
};

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Subscribe to usage updates. Returns an unsubscribe function.
 * Used by the useUsageLimit hook.
 */
export const subscribe = (listener) => {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
};

/**
 * Called from the API response interceptor.
 * Reads X-Feature-Used and X-Feature-Remaining headers and updates cache.
 */
export const updateFromResponseHeaders = (headers) => {
  if (!headers) return;

  const feature = headers['x-feature-name'] || headers['X-Feature-Name'];
  const used = headers['x-feature-used'] || headers['X-Feature-Used'];
  const remaining = headers['x-feature-remaining'] || headers['X-Feature-Remaining'];

  if (!feature || used == null || remaining == null) return;

  // Map backend feature names to our local keys
  const featureKey = mapBackendFeature(feature);
  if (!featureKey) return;

  _cache[featureKey] = {
    used: parseInt(used, 10),
    remaining: parseInt(remaining, 10),
  };

  notify();
};

/**
 * Returns the daily limit for a feature (free tier only on web).
 */
export const dailyLimit = (feature) => {
  return FREE_LIMITS[feature] || 10;
};

/**
 * Returns the remaining usage count for a feature.
 * If we haven't received headers yet, assumes full quota.
 */
export const remainingUsage = (feature) => {
  const cached = _cache[feature];
  if (cached !== null) {
    return Math.max(0, cached.remaining);
  }
  // No data yet — optimistic: assume full quota.
  // Backend 429 is the safety net.
  return dailyLimit(feature);
};

/**
 * Returns true if the user can still use the feature today.
 */
export const canUseFeature = (feature) => {
  return remainingUsage(feature) > 0;
};

/**
 * Optimistically decrement remaining after a successful API call,
 * before the next response headers arrive. Keeps the badge accurate
 * between requests.
 */
export const decrementLocal = (feature) => {
  const cached = _cache[feature];
  if (cached !== null) {
    cached.used += 1;
    cached.remaining = Math.max(0, cached.remaining - 1);
  } else {
    // First usage before any headers — seed from defaults
    _cache[feature] = {
      used: 1,
      remaining: dailyLimit(feature) - 1,
    };
  }
  notify();
};

/**
 * Returns feature metadata (displayName, iconName).
 */
export const getFeatureMeta = (feature) => {
  return FEATURE_META[feature] || { displayName: feature, iconName: 'Help' };
};

/**
 * Resets in-memory cache. Called on logout / account deletion.
 */
export const resetUsageState = () => {
  Object.keys(_cache).forEach((key) => {
    _cache[key] = null;
  });
  notify();
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Map backend feature header value to local RateLimitedFeature key.
 * The backend sends e.g. "calculateRewards", "calculateBestCard", "transfer".
 */
const mapBackendFeature = (backendName) => {
  if (!backendName) return null;
  const lower = backendName.toLowerCase();

  if (lower.includes('reward') || lower.includes('calculator') || lower === 'calculaterewards') {
    return RateLimitedFeature.CALCULATOR;
  }
  if (lower.includes('bestcard') || lower.includes('best_card') || lower === 'calculatebestcard') {
    return RateLimitedFeature.BEST_CARD;
  }
  if (lower.includes('transfer')) {
    return RateLimitedFeature.TRANSFERS;
  }

  return null;
};
