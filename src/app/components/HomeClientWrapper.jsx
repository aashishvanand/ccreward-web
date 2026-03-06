"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { initializeAnalytics, setupNetworkMonitoring } from '@/core/services/analytics';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const LandingPage = dynamic(() => import('@/features/landing/components/LandingPage'), { ssr: false });

export default function HomeClientWrapper() {
    useEffect(() => {
        const initPerformanceMonitoring = async () => {
            try {
                await initializeAnalytics();
                setupNetworkMonitoring();
            } catch (error) {
                console.error('Failed to initialize performance monitoring:', error);
            }
        };

        initPerformanceMonitoring();
    }, []);

    return (
        <PerformanceWrapper name="landing_page">
            <LandingPage />
        </PerformanceWrapper>
    );
}
