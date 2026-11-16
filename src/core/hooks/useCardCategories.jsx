"use client";

import { useRegionalJson } from './useRegionalJson';

/**
 * Top-card categories for the current region.
 * @param initialData server-rendered categories (used without refetching)
 * @param initialRegion region the server data is for, e.g. "in"
 */
function useCardCategories(initialData = null, initialRegion = null) {
    const { data, isLoading, error } = useRegionalJson({
        cachePrefix: 'cardCategories_',
        fileName: 'cardCategories',
        initialData,
        initialRegion,
    });
    return { categories: data, isLoading, error };
}

// Helper function to get cards for a specific category
export function getCardsForCategory(categoryName, categoriesData) {
    if (!categoriesData || !categoryName) return [];
    return categoriesData[categoryName]?.cards || [];
}

export default useCardCategories;
