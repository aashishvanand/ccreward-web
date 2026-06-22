import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export const metadata = {
  title: 'Reward Calculator',
  description: 'Calculate your credit card rewards for specific spends and MCC codes. Compare rewards across HDFC, ICICI, SBI, Axis, AMEX and more.',
  alternates: {
    canonical: 'https://ccreward.app/calculator',
  },
  openGraph: {
    title: 'Reward Calculator | ccreward',
    description: 'Calculate your credit card rewards for specific spends and MCC codes.',
    url: 'https://ccreward.app/calculator',
  },
  twitter: {
    title: 'Reward Calculator | ccreward',
    description: 'Calculate your credit card rewards for specific spends and MCC codes.',
  },
};

const Calculator = dynamic(() => import('@/features/calculator/components/Calculator'));

export default function CalculatorPage() {
  return (
    <PerformanceWrapper name="calculator_page">
      <Calculator />
    </PerformanceWrapper>
  );
}
