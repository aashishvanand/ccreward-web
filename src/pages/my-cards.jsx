import dynamic from 'next/dynamic';
import SEOHead from '@/shared/components/seo/SEOHead';
import { generateMetadata, pageMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const MyCardsList = dynamic(() => import('@/features/cards/components/MyCardsPage'), { ssr: false });

const metadata = generateMetadata({
  ...pageMetadata.myCards,
  path: '/my-cards'
});

export default function MyCardsPage() {
  return (
    <PerformanceWrapper name="my_cards_page">
      <SEOHead metadata={metadata} />
      <MyCardsList />
    </PerformanceWrapper>
  );
}