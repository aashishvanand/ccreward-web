import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export const metadata = {
  title: 'My Cards Portfolio',
  description: 'Manage your credit card portfolio and track your benefits, rewards, and spending across all your cards.',
  alternates: {
    canonical: 'https://ccreward.app/my-cards',
  },
  openGraph: {
    title: 'My Cards Portfolio | ccreward',
    description: 'Manage your credit card portfolio and track your benefits.',
    url: 'https://ccreward.app/my-cards',
  },
  twitter: {
    title: 'My Cards Portfolio | ccreward',
    description: 'Manage your credit card portfolio and track your benefits.',
  },
};

const MyCardsList = dynamic(() => import('@/features/cards/components/MyCardsPage'));

export default function MyCardsPage() {
  return (
    <PerformanceWrapper name="my_cards_page">
      <MyCardsList />
    </PerformanceWrapper>
  );
}
