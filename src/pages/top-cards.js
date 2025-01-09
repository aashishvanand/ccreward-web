import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const TopCardsWrapper = dynamic(() => import('../features/top-cards/components/TopCardsPage'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.topCards,
  path: '/top-cards'
});

export default function TopCards() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <TopCardsWrapper />
      </AuthProvider>
    </ThemeRegistry>
  );
}