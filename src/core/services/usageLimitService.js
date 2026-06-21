/**
 * Usage Limit Service
 *
 * Client-side tracking of per-feature daily usage.
 * Storage: localStorage with date-keyed counters so a new day starts at 0 automatically.
 * Limit: read from X-Feature-Limit response header — never hardcoded.
 *
 * API interceptor calls:
 *   handleSuccessHeaders(headers)  — on every 2xx response
 *   handleLimitExceeded(headers)   — on 429 FEATURE_LIMIT_EXCEEDED
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

const DEFAULT_LIMIT = 10;

// ─── Storage helpers ───────────────────────────────────────────────────────────

const todayStr = () => new Date().toISOString().slice(0, 10);

const USED_KEY = (feature) => `feature_used_${feature}_${todayStr()}`;
const LIMIT_KEY = (feature) => `feature_limit_${feature}`;

const ls = {
  get(key, fallback = null) {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, val) {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  remove(key) {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.removeItem(key); } catch {}
  },
  keys() {
    if (typeof localStorage === 'undefined') return [];
    try {
      return Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
    } catch { return []; }
  },
};

// Remove stale feature_used_ keys from previous days
const cleanupOldUsageKeys = () => {
  const today = todayStr();
  ls.keys().forEach((key) => {
    if (key?.startsWith('feature_used_') && !key.endsWith(`_${today}`)) {
      ls.remove(key);
    }
  });
};

if (typeof window !== 'undefined') {
  cleanupOldUsageKeys();
}

// ─── Event bus ────────────────────────────────────────────────────────────────

const _listeners = new Set();

const notify = () => {
  _listeners.forEach((fn) => {
    try { fn(); } catch { /* ignore */ }
  });
};

export const subscribe = (listener) => {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
};

// ─── Core operations ──────────────────────────────────────────────────────────

export const increment = (feature) => {
  const current = ls.get(USED_KEY(feature), 0);
  ls.set(USED_KEY(feature), current + 1);
  notify();
};

export const setLimit = (feature, limit) => {
  ls.set(LIMIT_KEY(feature), limit);
  notify();
};

export const exhaust = (feature) => {
  ls.set(USED_KEY(feature), dailyLimit(feature));
  notify();
};

// ─── Read accessors ───────────────────────────────────────────────────────────

export const dailyLimit = (feature) => {
  return ls.get(LIMIT_KEY(feature), DEFAULT_LIMIT);
};

const getUsed = (feature) => {
  return ls.get(USED_KEY(feature), 0);
};

export const remainingUsage = (feature) => {
  return Math.max(0, dailyLimit(feature) - getUsed(feature));
};

export const canUseFeature = (feature) => remainingUsage(feature) > 0;

export const getFeatureMeta = (feature) => {
  return FEATURE_META[feature] || { displayName: feature, iconName: 'Help' };
};

// ─── API interceptor handlers ─────────────────────────────────────────────────

export const handleSuccessHeaders = (headers) => {
  if (!headers) return;
  const featureName = headers['x-feature-name'];
  const featureLimit = headers['x-feature-limit'];
  if (!featureName) return;
  const key = mapBackendFeature(featureName);
  if (!key) return;
  increment(key);
  if (featureLimit != null) setLimit(key, +featureLimit);
};

export const handleLimitExceeded = (headers) => {
  if (!headers) return;
  const featureName = headers['x-feature-name'];
  if (!featureName) return;
  const key = mapBackendFeature(featureName);
  if (!key) return;
  exhaust(key);
};

// ─── Reset ────────────────────────────────────────────────────────────────────

export const resetUsageState = () => {
  const today = todayStr();
  Object.values(RateLimitedFeature).forEach((feature) => {
    ls.remove(`feature_used_${feature}_${today}`);
    ls.remove(LIMIT_KEY(feature));
  });
  notify();
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
