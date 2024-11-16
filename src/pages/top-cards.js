import dynamic from 'next/dynamic';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const TopCardsWrapper = dynamic(() => import('../features/top-cards/components/TopCardsPage'), { ssr: false });

export default function TopCards() {
    return (
        <ThemeRegistry>
          <AuthProvider>
            <TopCardsWrapper />
          </AuthProvider>
        </ThemeRegistry>
      );
}

