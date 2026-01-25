import dynamic from 'next/dynamic';
import SEOHead from '@/shared/components/seo/SEOHead';
import { generateMetadata, pageMetadata } from '@/shared/components/seo';

const CalculatorWrapper = dynamic(() => import('@/features/calculator/components/Calculator'), { ssr: false });

const metadata = generateMetadata({
  ...pageMetadata.calculator,
  path: '/calculator'
});

export default function CalculatorPage() {
  // No providers needed - they're already in _app.js
  return (
    <>
      <SEOHead metadata={metadata} />
      <div style={{ display: 'none', visibility: 'hidden' }}>
        <h1>Reward Calculator</h1>
        <p>Calculate your credit card rewards for specific spends and MCC codes.</p>
      </div>
      <CalculatorWrapper />
    </>
  );
}