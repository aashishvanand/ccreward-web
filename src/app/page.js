"use client";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';

const LandingPage = dynamic(() => import('../features/landing/components/LandingPage'), { ssr: false });
const MyCardsPage = dynamic(() => import('../features/cards/components/MyCardsPage'), { ssr: false });
const Calculator = dynamic(() => import('../features/calculator/components/Calculator'), { ssr: false });

function Home() {
  const pathname = usePathname();

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