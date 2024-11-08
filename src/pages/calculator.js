import dynamic from 'next/dynamic';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import AuthRedirectWrapper from '../shared/components/auth/AuthRedirectWrapper';

const CalculatorWrapper = dynamic(() => import('../features/calculator/components/Calculator'), { ssr: false });

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