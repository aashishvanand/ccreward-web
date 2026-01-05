import TermsOfServicePage from '../features/legal/components/TermsOfServicePage';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const metadata = generateMetadata({
  title: "Terms of Service - ccreward",
  description: "Read ccreward's terms of service and user agreement for our credit card rewards calculator and comparison tools.",
  path: '/terms'
});

export default function TermsPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <SEOHead metadata={metadata} />
        <TermsOfServicePage />
      </AuthProvider>
    </ThemeRegistry>
  );
}