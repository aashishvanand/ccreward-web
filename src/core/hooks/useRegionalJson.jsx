"use client";

import { useState, useEffect } from 'react';
import { useRegion } from '../providers/RegionContext';
import { setCachedJson } from '../utils/storage';

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

const hasData = (data) =>
    data != null && !(Array.isArray(data) && data.length === 0);

const readCache = (key) => {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        const { data, timestamp } = JSON.parse(cached);
        return { data, isFresh: Date.now() - timestamp < CACHE_EXPIRATION };
    } catch {
        return null;
    }
};

/**
 * Region-specific JSON from files.ccreward.app with a localStorage cache.
 *
 * - Server data (initialData for initialRegion) is used as is: no spinner, no
 *   refetch, nothing cleared on hydration.
 * - Otherwise shows cached data straight away and refreshes it in the background
 *   when it's older than a day, without clearing what's on screen.
 * - Data for a different region is never shown: on a region change the old
 *   data is dropped and the new region's data loads.
 */
export function useRegionalJson({ cachePrefix, fileName, initialData = null, initialRegion = null }) {
    const { region, isInitialized } = useRegion();
    const [state, setState] = useState(() => ({
        data: hasData(initialData) ? initialData : null,
        // Without an explicit region, server data is assumed to match the first region seen
        region: hasData(initialData) ? (initialRegion?.toUpperCase() ?? null) : null,
        fromServer: hasData(initialData),
        error: null,
    }));

    useEffect(() => {
        if (!isInitialized || !region) return;

        // Server data for this region (or of unspecified region): adopt it, skip the fetch
        if (state.fromServer && (state.region === null || state.region === region)) {
            if (state.region === null) setState(s => ({ ...s, region }));
            return;
        }
        const regionCode = region.toLowerCase();
        const cacheKey = `${cachePrefix}${regionCode}`;
        const cached = readCache(cacheKey);

        if (cached) {
            setState({ data: cached.data, region, fromServer: false, error: null });
            if (cached.isFresh) return;
        } else if (state.region !== region) {
            // Never show another region's data while loading
            setState({ data: null, region, fromServer: false, error: null });
        }

        let cancelled = false;
        (async () => {
            try {
                const response = await fetch(`https://files.ccreward.app/${fileName}_${regionCode}.json`);
                if (!response.ok) throw new Error(`Failed to load ${fileName} for region ${region}`);
                const data = await response.json();
                if (cancelled) return;
                setState({ data, region, fromServer: false, error: null });
                setCachedJson(cacheKey, data);
            } catch (error) {
                if (cancelled) return;
                console.error(`Error loading ${fileName} for region:`, region, error);
                // Keep whatever is on screen (possibly expired cache)
                setState(s => ({ ...s, region, error }));
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only on region changes
    }, [region, isInitialized, cachePrefix, fileName]);

    const matchesRegion = !region || state.region === null || state.region === region;
    const data = matchesRegion ? state.data : null;
    return {
        data,
        isLoading: data == null && !state.error,
        error: state.error,
    };
}
