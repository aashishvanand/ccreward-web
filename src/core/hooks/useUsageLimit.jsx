'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import {
  subscribe,
  remainingUsage,
  dailyLimit,
  getFeatureMeta,
  decrementLocal,
} from '@/core/services/usageLimitService';

/**
 * React hook for usage limit enforcement on a specific feature.
 *
 * Driven entirely by backend response headers (X-Feature-Used / X-Feature-Remaining).
 * On fresh page load the client assumes full quota; the backend 429 is the safety net
 * until the first API response populates the cache.
 *
 * @param {string} feature - One of RateLimitedFeature values ('calculator', 'bestCard', 'transfers')
 * @returns {object} { remaining, limit, canUse, onSuccess, limitMessage, featureDisplayName }
 */
export default function useUsageLimit(feature) {
  const limit = dailyLimit(feature);
  const meta = getFeatureMeta(feature);

  // Re-render whenever the usage cache is updated (from response headers)
  const remaining = useSyncExternalStore(
    subscribe,
    () => remainingUsage(feature),
    () => limit, // SSR snapshot: assume full quota
  );

  const canUse = remaining > 0;

  /**
   * Optimistically decrement the local counter after a successful API call.
   * The next API response will overwrite with the authoritative backend value.
   */
  const onSuccess = useCallback(() => {
    decrementLocal(feature);
  }, [feature]);

  const limitMessage = `Daily free limit reached (${limit}/day). Download the CCReward app for more.`;

  return {
    remaining,
    limit,
    canUse,
    onSuccess,
    limitMessage,
    featureDisplayName: meta.displayName,
  };
}
