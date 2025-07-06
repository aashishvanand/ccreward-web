import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import { RegionProvider } from '../core/providers/RegionContext';
import PerformanceWrapper from '../shared/components/PerformanceWrapper'; // Add this

const HowToPage = dynamic(() => import('../features/how-to/HowToGuide'), { ssr: false });

export const metadata = generateMetadata({
  title: "How To Guide - CCReward",
  description: "Comprehensive guides for using the CCReward app across different platforms",
  path: '/howto'
});

export default function HowToRoute() {
  return (
    <ThemeRegistry>
      <RegionProvider>
        <AuthProvider>
          <PerformanceWrapper name="how_to_page">
            <HowToPage />
          </PerformanceWrapper>
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
}