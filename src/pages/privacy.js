import PrivacyPolicyPage from '../features/legal/components/PrivacyPolicyPage';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const metadata = generateMetadata({
  title: "Privacy Policy - ccreward",
  description: "Learn about ccreward's privacy policy, data collection practices, and how we protect your information.",
  path: '/privacy'
});

export default function PrivacyPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <SEOHead metadata={metadata} />
        <PrivacyPolicyPage />
      </AuthProvider>
    </ThemeRegistry>
  );
}