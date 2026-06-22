"use client";

import { useState, useEffect } from 'react';

const CACHE_KEY = 'partnerLogos';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

// Fetch function for a single JSON file
async function fetchLogoData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok for ${url}`);
    }
    return await response.json();
}

function usePartnerLogos() {
    const [logos, setLogos] = useState({ airline: {}, hotel: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadLogos() {
            setIsLoading(true);
            setError(null);

            try {
                // Check cache first
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < CACHE_EXPIRATION) {
                        setLogos(data);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch fresh data
                const [airlineData, hotelData] = await Promise.all([
                    fetchLogoData('https://files.ccreward.app/airline_logo.json'),
                    fetchLogoData('https://files.ccreward.app/hotel_logo.json')
                ]);

                // Process data into lookup objects
                const airlineLogos = airlineData.reduce((acc, item) => {
                    acc[item.iata] = item.id;
                    return acc;
                }, {});

                const hotelLogos = hotelData.reduce((acc, item) => {
                    // Normalize brand name for better matching (e.g., 'Hilton' vs 'Hilton Honors')
                    acc[item.brand_name.toLowerCase()] = item.id;
                    return acc;
                }, {});

                const combinedLogos = { airline: airlineLogos, hotel: hotelLogos };

                setLogos(combinedLogos);

                // Update cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: combinedLogos,
                    timestamp: Date.now()
                }));

            } catch (err) {
                setError(err);
                console.error('Error fetching partner logos:', err);
            } finally {
                setIsLoading(false);
            }
        }

        loadLogos();
    }, []);

    return { logos, isLoadingLogos: isLoading, logosError: error };
}

export default usePartnerLogos;