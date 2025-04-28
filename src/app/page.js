"use client";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import { RegionProvider } from '../core/providers/RegionContext';

const LandingPage = dynamic(() => import('../features/landing/components/LandingPage'), { ssr: false });
const MyCardsPage = dynamic(() => import('../features/cards/components/MyCardsPage'), { ssr: false });
const Calculator = dynamic(() => import('../features/calculator/components/Calculator'), { ssr: false });
const HowToGuide = dynamic(() => import('../features/how-to/HowToGuide'), { ssr: false });

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
      case '/how-to':
        return <HowToGuide />;
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
      <RegionProvider>
        <AuthProvider>
          <HowToProvider>
            <Home />
          </HowToProvider>
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
}