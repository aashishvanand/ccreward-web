import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const PrivacyPolicyWrapper = dynamic(() => import('../features/legal/components/PrivacyPolicyPage'), { ssr: false });

export const metadata = generateMetadata({
  title: "Privacy Policy - CCReward",
  description: "Learn about CCReward's privacy policy, data collection practices, and how we protect your information.",
  path: '/privacy'
});

export default function PrivacyPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <PrivacyPolicyWrapper />
      </AuthProvider>
    </ThemeRegistry>
  );
}