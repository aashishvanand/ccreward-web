import { useState, useEffect } from 'react';

const CACHE_KEY = 'cardCategories';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

async function fetchCardCategories() {
    const response = await fetch('https://files.ccreward.app/cardCategories.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

function useCardCategories() {
    const [categories, setCategories] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                // Check cache first
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < CACHE_EXPIRATION) {
                        setCategories(data);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch fresh data if cache is expired or missing
                const freshData = await fetchCardCategories();
                setCategories(freshData);

                // Update cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: freshData,
                    timestamp: Date.now()
                }));

            } catch (err) {
                setError(err);
                console.error('Error fetching card categories:', err);
            } finally {
                setIsLoading(false);
            }
        }

        loadCategories();
    }, []);

    return { categories, isLoading, error };
}

// Helper function to get cards for a specific category
export function getCardsForCategory(categoryName, categoriesData) {
    if (!categoriesData || !categoryName) return [];
    return categoriesData[categoryName]?.cards || [];
}

export default useCardCategories;