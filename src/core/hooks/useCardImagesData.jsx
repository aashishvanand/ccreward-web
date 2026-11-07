"use client";

import { useRegionalJson } from './useRegionalJson';

const EMPTY = [];

/**
 * Card image metadata for the current region.
 * @param initialData server-provided images (used without refetching when non-empty)
 * @param initialRegion region the server data is for, e.g. "in"
 */
function useCardImagesData(initialData = null, initialRegion = null) {
    const { data, isLoading, error } = useRegionalJson({
        cachePrefix: 'cardImagesData_',
        fileName: 'cardImages',
        initialData,
        initialRegion,
    });
    return { cardImagesData: data ?? EMPTY, isLoading, error };
}

export default useCardImagesData;
