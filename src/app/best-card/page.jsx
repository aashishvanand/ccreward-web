import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export const metadata = {
  title: 'Best Card Finder',
  description: 'Find the best credit card for your spending category. Compare rewards rates across HDFC, ICICI, SBI, Axis, AMEX and more to maximize your benefits.',
  alternates: {
    canonical: 'https://ccreward.app/best-card',
  },
  openGraph: {
    title: 'Best Card Finder | ccreward',
    description: 'Find the best credit card for your spending category and maximize your rewards.',
    url: 'https://ccreward.app/best-card',
  },
  twitter: {
    title: 'Best Card Finder | ccreward',
    description: 'Find the best credit card for your spending category and maximize your rewards.',
  },
};

const BestCardCalculator = dynamic(() => import('@/features/best-card/components/BestCardCalculator'), { ssr: false });

export default function BestCardPage() {
  return (
    <PerformanceWrapper name="best_card_page">
      <BestCardCalculator />
    </PerformanceWrapper>
  );
}
