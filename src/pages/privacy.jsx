import PrivacyPolicyPage from '@/features/legal/components/PrivacyPolicyPage';
import SEOHead from '@/shared/components/seo/SEOHead';
import { generateMetadata } from '@/shared/components/seo';

const metadata = generateMetadata({
  title: "Privacy Policy - ccreward",
  description: "Learn about ccreward's privacy policy, data collection practices, and how we protect your information.",
  path: '/privacy'
});

export async function getStaticProps() {
  return { props: {} };
}

export default function PrivacyPage() {
  return (
    <>
      <SEOHead metadata={metadata} />
      <PrivacyPolicyPage />
    </>
  );
}