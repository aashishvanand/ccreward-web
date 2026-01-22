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
      <BestCardCalculator />
    </>
  );
}
