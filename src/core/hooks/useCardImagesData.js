import { useState, useEffect } from 'react';
import { useRegion } from '../providers/RegionContext';

const CACHE_KEY_PREFIX = 'cardImagesData_';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

async function fetchCardImagesData(region) {
    // Use region-specific file
    const regionCode = region.toLowerCase();
    const response = await fetch(`https://files.ccreward.app/cardImages_${regionCode}.json`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

function useCardImagesData() {
    const { region, isInitialized } = useRegion();
    const [cardImagesData, setCardImagesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Don't create cache key if region is not available
    const cacheKey = region ? `${CACHE_KEY_PREFIX}${region.toLowerCase()}` : null;

    useEffect(() => {
        // Don't run if region is not initialized or not available
        if (!isInitialized || !region) {
            setIsLoading(true);
            return;
        }

        async function loadCardImagesData() {
            setIsLoading(true);
            try {
                // Check region-specific cache first
                if (cacheKey) {
                    const cachedData = localStorage.getItem(cacheKey);
                    if (cachedData) {
                        const { data, timestamp } = JSON.parse(cachedData);
                        if (Date.now() - timestamp < CACHE_EXPIRATION) {
                            setCardImagesData(data);
                            setIsLoading(false);
                            return;
                        }
                    }
                }

                // Fetch fresh data for the current region
                const freshData = await fetchCardImagesData(region);
                setCardImagesData(freshData);
                
                // Update cache with region-specific data
                if (cacheKey) {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        data: freshData,
                        timestamp: Date.now()
                    }));
                }
                
            } catch (err) {
                console.error(`Error loading card images for region ${region}:`, err);
                setError(err);
                
                // Fallback to cached data if available, even if expired
                if (cacheKey) {
                    try {
                        const cachedData = localStorage.getItem(cacheKey);
                        if (cachedData) {
                            const { data } = JSON.parse(cachedData);
                            setCardImagesData(data);
                        }
                    } catch (cacheErr) {
                        console.error('Error retrieving from cache:', cacheErr);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        }
        
        loadCardImagesData();
    }, [region, cacheKey, isInitialized]);

    return { cardImagesData, isLoading, error };
}

export default useCardImagesData;