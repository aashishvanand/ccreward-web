import dynamic from 'next/dynamic';
import { AuthProvider } from '../app/providers/AuthContext';
import { ThemeRegistry } from '../components/ThemeRegistry';

const PrivacyPolicyWrapper = dynamic(() => import('../components/PrivacyPolicyPage'), { ssr: false });

export default function PrivacyPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <PrivacyPolicyWrapper />
      </AuthProvider>
    </ThemeRegistry>
  );
}