import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../components/ThemeRegistry';
import { AuthProvider } from '../app/providers/AuthContext';
import AuthRedirectWrapper from '../components/AuthRedirectWrapper';

const BestCardCalculator = dynamic(() => import('../components/BestCardCalculator'), { ssr: false });

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