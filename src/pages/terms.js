import TermsOfServicePage from '../features/legal/components/TermsOfServicePage';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata } from '../shared/components/seo';

const metadata = generateMetadata({
  title: "Terms of Service - ccreward",
  description: "Read ccreward's terms of service and user agreement for our credit card rewards calculator and comparison tools.",
  path: '/terms'
});

export default function TermsPage() {
  return (
    <>
      <SEOHead metadata={metadata} />
      <TermsOfServicePage />
    </>
  );
}