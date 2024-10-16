import dynamic from 'next/dynamic';
import { AuthProvider } from '../app/providers/AuthContext';
import { ThemeRegistry } from '../components/ThemeRegistry';
import AuthRedirectWrapper from '../components/AuthRedirectWrapper';

const CalculatorWrapper = dynamic(() => import('../components/Calculator'), { ssr: false });

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