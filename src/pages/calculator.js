import dynamic from 'next/dynamic';

const CreditCardRewardsCalculator = dynamic(() => import('../components/CreditCardRewardsCalculator'), { ssr: false });

export default function CalculatorPage() {
  return <CreditCardRewardsCalculator />;
}