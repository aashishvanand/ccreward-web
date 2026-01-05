"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import { initializeAnalytics, setupNetworkMonitoring } from '../core/services/analytics';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';

const LandingPage = dynamic(() => import('../features/landing/components/LandingPage'), { ssr: false });

function Home() {
  // Add this useEffect for performance monitoring
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
    <Box sx={{ minHeight: '100vh' }}>
      <PerformanceWrapper name="landing_page">
        <LandingPage />
      </PerformanceWrapper>
    </Box>
  );
}

function WrappedHome() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </ThemeRegistry>
  );
}

export default WrappedHome;