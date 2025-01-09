import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import AuthRedirectWrapper from '../shared/components/auth/AuthRedirectWrapper';

const CalculatorWrapper = dynamic(() => import('../features/calculator/components/Calculator'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.calculator,
  path: '/calculator'
});

export default function CalculatorPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <AuthRedirectWrapper>
          <CalculatorWrapper />
        </AuthRedirectWrapper>
      </AuthProvider>
    </ThemeRegistry>
  );
}