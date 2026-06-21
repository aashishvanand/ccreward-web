import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export const metadata = {
  title: 'Points Transfer Calculator',
  description: 'Calculate and compare credit card points transfer values across airline and hotel partner programs. Maximize the value of your reward points.',
  alternates: {
    canonical: 'https://ccreward.app/transfer-calculator',
  },
  openGraph: {
    title: 'Points Transfer Calculator | ccreward',
    description: 'Calculate and compare credit card points transfer values across partner programs.',
    url: 'https://ccreward.app/transfer-calculator',
  },
  twitter: {
    title: 'Points Transfer Calculator | ccreward',
    description: 'Calculate and compare credit card points transfer values across partner programs.',
  },
};

const TransferCalculator = dynamic(() => import('@/features/transfer-calculator/components/TransferCalculator'), { ssr: false });

export default function TransferCalculatorPage() {
  return (
    <PerformanceWrapper name="transfer_calculator_page">
      <TransferCalculator />
    </PerformanceWrapper>
  );
}
