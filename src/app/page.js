"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { useAuth } from './providers/AuthProvider';
import { ThemeRegistry, useTheme } from '../components/ThemeRegistry';

const LandingPage = dynamic(() => import('../components/LandingPage'), { ssr: false });
const LoginPage = dynamic(() => import('../components/LoginPage'), { ssr: false });
const MyCardsPage = dynamic(() => import('../components/MyCardsPage'), { ssr: false });
const CreditCardRewardsCalculator = dynamic(() => import('../components/CreditCardRewardsCalculator'), { ssr: false });

// Define authenticated and non-authenticated routes
const authenticatedRoutes = ['/my-cards'];
const nonAuthenticatedRoutes = ['/', '/signin', '/calculator'];

function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    if (authenticatedRoutes.includes(pathname) && !isAuthenticated()) {
      router.push('/signin');
    } else if (pathname === '/signin' && isAuthenticated()) {
      router.push('/my-cards');
    }
  }, [pathname, isAuthenticated, router]);

  const getComponent = () => {
    switch (pathname) {
      case '/':
        return <LandingPage />;
      case '/signin':
        return <LoginPage />;
      case '/my-cards':
        return isAuthenticated() ? <MyCardsPage /> : null;
      case '/calculator':
        return <CreditCardRewardsCalculator />;
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
      <Home />
    </ThemeRegistry>
  );
}