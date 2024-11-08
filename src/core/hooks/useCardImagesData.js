import { useState, useEffect } from 'react';

const CACHE_KEY = 'cardImagesData';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function fetchCardImagesData() {
    const response = await fetch('https://files.ccreward.app/cardImages.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

function useCardImagesData() {
    const [cardImagesData, setCardImagesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCardImagesData() {
            try {
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < CACHE_EXPIRATION) {
                        setCardImagesData(data);
                        setIsLoading(false);
                        return;
                    }
                }

                const freshData = await fetchCardImagesData();
                setCardImagesData(freshData);
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: freshData,
                    timestamp: Date.now()
                }));
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        }
        loadCardImagesData();
    }, []);

    return { cardImagesData, isLoading, error };
}

export default useCardImagesData;