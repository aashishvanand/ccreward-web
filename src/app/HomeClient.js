"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { initializeAnalytics, setupNetworkMonitoring } from '../core/services/analytics';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';
import PropTypes from 'prop-types';

const LandingPage = dynamic(() => import('../features/landing/components/LandingPage'), { ssr: false });

export default function HomeClient({ region }) {
    // Add this useEffect for performance monitoring
    useEffect(() => {
        const initPerformanceMonitoring = async () => {
            try {
                await initializeAnalytics();

                // Setup network monitoring if functionality exists
                if (typeof setupNetworkMonitoring === 'function') {
                    setupNetworkMonitoring();
                }
            } catch (error) {
                console.warn('Analytics initialization failed:', error);
            }
        };

        initPerformanceMonitoring();
    }, []);

    return (
        <PerformanceWrapper componentName="Home">
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <LandingPage region={region} />
            </Box>
        </PerformanceWrapper>
    );
}

HomeClient.propTypes = {
    region: PropTypes.string
};
