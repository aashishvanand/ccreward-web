import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { RegionProvider } from '../core/providers/RegionContext';
import PerformanceWrapper from '../shared/components/PerformanceWrapper'; // Add this

const TopCardsWrapper = dynamic(() => import('../features/top-cards/components/TopCardsPage'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.topCards,
  path: '/top-cards'
});

export default function TopCards() {
  return (
    <ThemeRegistry>
      <RegionProvider>
        <AuthProvider>
          <PerformanceWrapper name="top_cards_page">
            <TopCardsWrapper />
          </PerformanceWrapper>
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
}