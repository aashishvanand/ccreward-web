"use client";

import { memo, useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';

const AmbientBackground = memo(() => {
    const theme = useTheme();
    const [isHidden, setIsHidden] = useState(false);

    // Pause the infinite pulse while the tab is hidden — CSS animations are
    // throttled there, but an explicitly paused animation lets the browser
    // skip the compositor work entirely.
    useEffect(() => {
        const onVisibility = () => setIsHidden(document.hidden);
        onVisibility();
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);

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
                background: `radial-gradient(circle, rgba(${theme.vars.palette.primary.mainChannel} / 0.15) 0%, transparent 70%)`,
                filter: 'blur(60px)',
                willChange: 'transform, opacity',  // Promote to GPU layer
                transform: 'translateZ(0)',         // Force GPU compositing
                animation: 'pulse 10s infinite alternate',
                animationPlayState: isHidden ? 'paused' : 'running',
                '@keyframes pulse': {
                    '0%': { opacity: 0.5, transform: 'translateZ(0) scale(1)' },
                    '100%': { opacity: 1, transform: 'translateZ(0) scale(1.2)' }
                },
                // Animating a 500px blur(60px) layer costs real paint/GPU on
                // phones, where it contributes nothing: keep it static there.
                [theme.breakpoints.down('md')]: {
                    animation: 'none',
                    opacity: 0.7,
                },
                '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                }
            }} />
             <Box sx={{
                position: 'absolute',
                top: 200,
                right: '10%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(${theme.vars.palette.secondary.mainChannel} / 0.1) 0%, transparent 70%)`,
                filter: 'blur(50px)',
                transform: 'translateZ(0)',         // Force GPU compositing
            }} />
        </Box>
    );
});

AmbientBackground.displayName = 'AmbientBackground';

export default AmbientBackground;
