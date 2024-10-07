import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../components/ThemeRegistry';
import { AuthProvider } from '../app/providers/AuthContext';

const BestCardCalculator = dynamic(() => import('../components/BestCardCalculator'), { ssr: false });

export default function BestCardPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <BestCardCalculator />
      </AuthProvider>
    </ThemeRegistry>
  );
}