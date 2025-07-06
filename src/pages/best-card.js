import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';

const BestCardCalculator = dynamic(() => import('../features/best-card/components/BestCardCalculator'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.bestCard,
  path: '/best-card'
});

export default function BestCardPage() {
  return <BestCardCalculator />;
}
