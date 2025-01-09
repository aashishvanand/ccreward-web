import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';
import AuthRedirectWrapper from '../shared/components/auth/AuthRedirectWrapper';

const BestCardCalculator = dynamic(() => import('../features/best-card/components/BestCardCalculator'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.bestCard,
  path: '/best-card'
});

export default function BestCardPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <AuthRedirectWrapper>
          <BestCardCalculator />
        </AuthRedirectWrapper>
      </AuthProvider>
    </ThemeRegistry>
  );
}