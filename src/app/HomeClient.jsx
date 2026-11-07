"use client";

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';
import PropTypes from 'prop-types';

import LandingPage from '../features/landing/components/LandingPage';

export default function HomeClient({ region, cardStats }) {
    useEffect(() => {
        // Hide SSR content once client component mounts
        const ssrContent = document.querySelector('[data-ssr-content="region"]');
        if (ssrContent) {
            ssrContent.style.display = 'none';
        }
    }, []);

    return (
        <PerformanceWrapper componentName="Home">
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <LandingPage region={region} cardStats={cardStats} />
            </Box>
        </PerformanceWrapper>
    );
}

HomeClient.propTypes = {
    region: PropTypes.string,
    cardStats: PropTypes.object,
};
