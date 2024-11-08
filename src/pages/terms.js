import dynamic from 'next/dynamic';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const TermsOfServiceyWrapper = dynamic(() => import('../features/legal/components/TermsOfServicePage'), { ssr: false });

export default function PrivacyPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <TermsOfServiceyWrapper />
      </AuthProvider>
    </ThemeRegistry>
  );
}