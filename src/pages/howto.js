import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';

const HowToPage = dynamic(() => import('../features/how-to/HowToGuide'), { ssr: false });

export const metadata = generateMetadata({
  title: "How To Guide - CCReward",
  description: "Comprehensive guides for using the CCReward app across different platforms",
  path: '/howto'
});

export default function HowToRoute() {
  return (
    <PerformanceWrapper name="how_to_page">
      <HowToPage />
    </PerformanceWrapper>
  );
}