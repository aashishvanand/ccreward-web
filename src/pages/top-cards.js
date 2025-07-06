import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';

const TopCardsWrapper = dynamic(() => import('../features/top-cards/components/TopCardsPage'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.topCards,
  path: '/top-cards'
});

export default function TopCards() {
  return (
    <PerformanceWrapper name="top_cards_page">
      <TopCardsWrapper />
    </PerformanceWrapper>
  );
}