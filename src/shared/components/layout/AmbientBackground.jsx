"use client";

import { memo } from 'react';
import { Box, useTheme, alpha } from '@mui/material';

const AmbientBackground = memo(() => {
    const theme = useTheme();

    return (
        <Box sx={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
            contain: 'strict',          // CSS containment - isolates layout/paint
        }}>
             {/* Ambient Background Elements */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: '20%',
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                filter: 'blur(60px)',
                willChange: 'transform, opacity',  // Promote to GPU layer
                transform: 'translateZ(0)',         // Force GPU compositing
                animation: 'pulse 10s infinite alternate',
                '@keyframes pulse': {
                    '0%': { opacity: 0.5, transform: 'translateZ(0) scale(1)' },
                    '100%': { opacity: 1, transform: 'translateZ(0) scale(1.2)' }
                }
            }} />
             <Box sx={{
                position: 'absolute',
                top: 200,
                right: '10%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
                filter: 'blur(50px)',
                transform: 'translateZ(0)',         // Force GPU compositing
            }} />
        </Box>
    );
});

AmbientBackground.displayName = 'AmbientBackground';

export default AmbientBackground;
