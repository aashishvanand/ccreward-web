"use client";

import Box from '@mui/material/Box';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';
import PropTypes from 'prop-types';

import LandingPage from '../features/landing/components/LandingPage';

export default function HomeClient({ region, cardStats, browse }) {
    return (
        <PerformanceWrapper componentName="Home">
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <LandingPage region={region} cardStats={cardStats} browse={browse} />
            </Box>
        </PerformanceWrapper>
    );
}

HomeClient.propTypes = {
    region: PropTypes.string,
    cardStats: PropTypes.object,
    browse: PropTypes.object,
};
