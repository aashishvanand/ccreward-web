"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { ThemeRegistry } from '../components/ThemeRegistry';
import { AuthProvider } from './providers/AuthContext';

const LandingPage = dynamic(() => import('../components/LandingPage'), { ssr: false });
const MyCardsPage = dynamic(() => import('../components/MyCardsPage'), { ssr: false });
const Calculator = dynamic(() => import('../components/Calculator'), { ssr: false });

function Home() {
  const pathname = usePathname();
  const router = useRouter();

  const getComponent = () => {
    switch (pathname) {
      case '/':
        return <LandingPage />;
      case '/my-cards':
        return <MyCardsPage />;
      case '/calculator':
        return <Calculator />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {getComponent()}
    </Box>
  );
}

export default function WrappedHome() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </ThemeRegistry>
  );
}