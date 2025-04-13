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
    const { region } = useRegion();
    const [cardImagesData, setCardImagesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create a region-specific cache key
    const cacheKey = `${CACHE_KEY_PREFIX}${region}`;

    useEffect(() => {
        async function loadCardImagesData() {
            setIsLoading(true);
            try {
                // Check region-specific cache first
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < CACHE_EXPIRATION) {
                        setCardImagesData(data);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch fresh data for the current region
                const freshData = await fetchCardImagesData(region);
                setCardImagesData(freshData);
                
                // Update cache with region-specific data
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: freshData,
                    timestamp: Date.now()
                }));
                
            } catch (err) {
                console.error(`Error loading card images for region ${region}:`, err);
                setError(err);
                
                // Fallback to cached data if available, even if expired
                try {
                    const cachedData = localStorage.getItem(cacheKey);
                    if (cachedData) {
                        const { data } = JSON.parse(cachedData);
                        setCardImagesData(data);
                    }
                } catch (cacheErr) {
                    console.error('Error retrieving from cache:', cacheErr);
                }
            } finally {
                setIsLoading(false);
            }
        }
        
        loadCardImagesData();
    }, [region, cacheKey]);

    return { cardImagesData, isLoading, error };
}

export default useCardImagesData;