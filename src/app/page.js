"use client";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import { RegionProvider } from '../core/providers/RegionContext';
import { AnimatePresence } from 'framer-motion';
import { initializeAnalytics, setupNetworkMonitoring } from '../core/services/analytics'; // Add this import
import PerformanceWrapper from '../shared/components/PerformanceWrapper'; // Add this import

const LandingPage = dynamic(() => import('../features/landing/components/LandingPage'), { ssr: false });
const MyCardsPage = dynamic(() => import('../features/cards/components/MyCardsPage'), { ssr: false });
const Calculator = dynamic(() => import('../features/calculator/components/Calculator'), { ssr: false });
const HowToGuide = dynamic(() => import('../features/how-to/HowToGuide'), { ssr: false });

function Home() {
  const pathname = usePathname();

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

  const getComponent = () => {
    switch (pathname) {
      case '/':
        return (
          <PerformanceWrapper name="landing_page">
            <LandingPage />
          </PerformanceWrapper>
        );
      case '/my-cards':
        return (
          <PerformanceWrapper name="my_cards_page">
            <MyCardsPage />
          </PerformanceWrapper>
        );
      case '/calculator':
        return (
          <PerformanceWrapper name="calculator_page">
            <Calculator />
          </PerformanceWrapper>
        );
      case '/how-to':
        return (
          <PerformanceWrapper name="how_to_page">
            <HowToGuide />
          </PerformanceWrapper>
        );
      default:
        return (
          <PerformanceWrapper name="landing_page">
            <LandingPage />
          </PerformanceWrapper>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {getComponent()}
    </Box>
  );
}

// Rest of your component remains the same
function WrappedHome() {
  const pathname = usePathname();
  
  return (
    <ThemeRegistry>
      <RegionProvider>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Home key={pathname} />
          </AnimatePresence>
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
}

export default WrappedHome;