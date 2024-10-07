import dynamic from 'next/dynamic';
import { AuthProvider } from '../app/providers/AuthContext';
import { ThemeRegistry } from '../components/ThemeRegistry';

const TermsOfServiceyWrapper = dynamic(() => import('../components/TermsOfServicePage'), { ssr: false });

export default function PrivacyPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <TermsOfServiceyWrapper />
      </AuthProvider>
    </ThemeRegistry>
  );
}