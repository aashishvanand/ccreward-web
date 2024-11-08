import dynamic from 'next/dynamic';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const PrivacyPolicyWrapper = dynamic(() => import('../features/legal/components/PrivacyPolicyPage'), { ssr: false });

export default function PrivacyPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <PrivacyPolicyWrapper />
      </AuthProvider>
    </ThemeRegistry>
  );
}