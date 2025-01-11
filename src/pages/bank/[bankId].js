"use client";

import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../../core/providers/ThemeRegistry';
import { AuthProvider } from '../../core/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const BankPage = dynamic(() => import('../../features/bank/components/BankPage'), { ssr: false });

const CACHE_KEY = 'cardsData';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const BANK_NAME_MAPPING = {
    'amex': 'AMEX',
    'au': 'AU',
    'axis': 'Axis',
    'bob': 'BOB',
    'canara': 'Canara',
    'dbs': 'DBS',
    'federal': 'Federal',
    'hdfc': 'HDFC',
    'hsbc': 'HSBC',
    'icici': 'ICICI',
    'idbi': 'IDBI',
    'idfcfirst': 'IDFCFirst',
    'indusind': 'IndusInd',
    'kotak': 'Kotak',
    'onecard': 'OneCard',
    'pnb': 'PNB',
    'rbl': 'RBL',
    'sbi': 'SBI',
    'sc': 'SC',
    'yesbank': 'YesBank'
};

const getFromCache = () => {
    if (typeof window === 'undefined') return null;
    
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }
    } catch (error) {
        console.error('Error reading from cache:', error);
    }
    return null;
};

const setToCache = (data) => {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Error writing to cache:', error);
    }
};

const fetchCardsData = async () => {
    const cachedData = getFromCache();
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch('https://files.ccreward.app/cards.json');
    const data = await response.json();
    setToCache(data);
    return data;
};

function BankRoute() {
    const router = useRouter();
    const [bankData, setBankData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const pathname = window.location.pathname;
                const bankId = pathname.split('/').pop().toLowerCase();
                
                if (!bankId || !BANK_NAME_MAPPING[bankId]) {
                    setError('Invalid bank');
                    router.push('/');
                    return;
                }

                const mappedBankName = BANK_NAME_MAPPING[bankId];
                const data = await fetchCardsData();
                const cards = data.issuers[mappedBankName]?.cards || [];

                if (!cards.length) {
                    setError('No cards found');
                    router.push('/');
                    return;
                }

                setBankData({
                    bank: mappedBankName,
                    cards
                });
            } catch (error) {
                console.error('Error fetching bank data:', error);
                setError(error.message);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        }

        if (typeof window !== 'undefined') {
            fetchData();
        }
    }, [router]);

    if (isLoading) {
        return (
            <ThemeRegistry>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '100vh' 
                    }}
                >
                    <CircularProgress />
                </Box>
            </ThemeRegistry>
        );
    }

    if (error || !bankData) {
        return null;
    }

    return (
        <ThemeRegistry>
            <AuthProvider>
                <BankPage bank={bankData.bank} cards={bankData.cards} />
            </AuthProvider>
        </ThemeRegistry>
    );
}

// Enable static generation for all bank routes
export async function getStaticPaths() {
    const paths = Object.keys(BANK_NAME_MAPPING).map(bank => ({
        params: { bankId: bank }
    }));

    return {
        paths,
        fallback: true // Enable fallback for client-side rendering
    };
}

// Provide minimal props for static generation
export async function getStaticProps() {
    return {
        props: {}
    };
}

export default BankRoute;