import dynamic from 'next/dynamic';
import SEOHead from '@/shared/components/seo/SEOHead';
import { generateMetadata, pageMetadata } from '@/shared/components/seo';

const BestCardCalculator = dynamic(() => import('@/features/best-card/components/BestCardCalculator'), { ssr: false });

const metadata = generateMetadata({
  ...pageMetadata.bestCard,
  path: '/best-card'
});

export default function BestCardPage() {
  return (
    <>
      <SEOHead metadata={metadata} />
      <div style={{ display: 'none', visibility: 'hidden' }}>
        <h1>Best Card Calculator</h1>
        <p>Find the best card to use for your next purchase.</p>
      </div>
      <BestCardCalculator />
    </>
  );
}
