import TermsOfServicePage from '../features/legal/components/TermsOfServicePage';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata } from '../shared/components/seo';

const metadata = generateMetadata({
  title: "Terms and Conditions - ccreward",
  description: "Read ccreward's terms and conditions of use.",
  path: '/terms'
});

export async function getStaticProps() {
  return { props: {} };
}

export default function TermsPage() {
  return (
    <>
      <SEOHead metadata={metadata} />
      <TermsOfServicePage />
    </>
  );
}