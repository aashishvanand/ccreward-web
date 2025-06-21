import { useState, useEffect } from 'react';
import { useRegion } from '../providers/RegionContext';

const CACHE_KEY_PREFIX = 'cardCategories_';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

// The function now accepts a region to fetch the correct file
async function fetchCardCategories(region) {
    const regionCode = region.toLowerCase();
    const response = await fetch(`https://files.ccreward.app/cardCategories_${regionCode}.json`);
    if (!response.ok) {
        throw new Error(`Network response was not ok for region ${region}`);
    }
    return await response.json();
}

function useCardCategories() {
    // Get the current region from the context
    const { region } = useRegion();
    const [categories, setCategories] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create a dynamic cache key based on the region
    const cacheKey = `${CACHE_KEY_PREFIX}${region.toLowerCase()}`;

    useEffect(() => {
        // Reset state when region changes to provide immediate feedback
        setIsLoading(true);
        setCategories(null);
        setError(null);

        async function loadCategories() {
            try {
                // Check region-specific cache first
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < CACHE_EXPIRATION) {
                        setCategories(data);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch fresh data for the current region
                const freshData = await fetchCardCategories(region);
                setCategories(freshData);

                // Update the region-specific cache
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: freshData,
                    timestamp: Date.now()
                }));

            } catch (err) {
                setError(err);
                console.error(`Error fetching card categories for region ${region}:`, err);
            } finally {
                setIsLoading(false);
            }
        }

        loadCategories();
    // Add `region` and `cacheKey` to the dependency array
    // This ensures the hook re-runs whenever the region changes
    }, [region, cacheKey]);

    return { categories, isLoading, error };
}

// Helper function to get cards for a specific category
export function getCardsForCategory(categoryName, categoriesData) {
    if (!categoriesData || !categoryName) return [];
    return categoriesData[categoryName]?.cards || [];
}

export default useCardCategories;