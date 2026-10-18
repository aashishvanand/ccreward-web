import TermsClient from './TermsClient';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for ccreward. Read about our service terms, user content policies, data privacy, and liability information.',
  alternates: {
    canonical: 'https://ccreward.app/terms',
  },
  openGraph: {
    title: 'Terms of Service - ccreward',
    description: 'Terms of Service for ccreward.',
    url: 'https://ccreward.app/terms',
    type: 'website',
  },
};

export default function Terms() {
  return <TermsClient />;
}
