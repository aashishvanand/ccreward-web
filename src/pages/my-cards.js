import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';

const MyCardsList = dynamic(() => import('../features/cards/components/MyCardsPage'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.myCards,
  path: '/my-cards'
});

export default function MyCardsPage() {
  return (
    <PerformanceWrapper name="my_cards_page">
      <MyCardsList />
    </PerformanceWrapper>
  );
}