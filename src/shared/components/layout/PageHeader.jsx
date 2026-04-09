import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, children }) => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: "800",

                    background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)'
                        : 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',

                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography
                    variant="h6"
                    sx={{
                        color: "text.secondary",
                        maxWidth: 650,
                        mx: 'auto',
                        mb: 5,
                        lineHeight: 1.6,
                        fontWeight: 400
                    }}>
                    {subtitle}
                </Typography>
            )}
            <Box sx={{ maxWidth: 700, mx: 'auto', position: 'relative' }}>
                 {/* Glow effect */}
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    height: '80%',
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
                    filter: 'blur(40px)',
                    zIndex: -1,
                }} />
                {children}
            </Box>
        </Box>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.node
};

export default PageHeader;
