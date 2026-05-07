'use client';

import { useSyncExternalStore } from 'react';
import {
  subscribe,
  remainingUsage,
  dailyLimit,
  getFeatureMeta,
} from '@/core/services/usageLimitService';

/**
 * React hook for usage limit display on a specific feature.
 *
 * Usage is incremented by the API interceptor on every 2xx response;
 * exhausted immediately on 429 FEATURE_LIMIT_EXCEEDED.
 * The limit is read from the X-Feature-Limit response header.
 *
 * @param {string} feature - One of RateLimitedFeature values ('calculator', 'bestCard', 'transfers')
 * @returns {object} { remaining, limit, canUse, limitMessage, featureDisplayName }
 */
export default function useUsageLimit(feature) {
  const limit = dailyLimit(feature);
  const meta = getFeatureMeta(feature);

  const remaining = useSyncExternalStore(
    subscribe,
    () => remainingUsage(feature),
    () => limit,
  );

  const canUse = remaining > 0;
  const limitMessage = `Daily free limit reached (${limit}/day). Download the CCReward app for more.`;

  return {
    remaining,
    limit,
    canUse,
    limitMessage,
    featureDisplayName: meta.displayName,
  };
}
