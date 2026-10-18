import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ccreward. Learn how we collect, use, store, and protect your personal information.',
  alternates: {
    canonical: 'https://ccreward.app/privacy',
  },
  openGraph: {
    title: 'Privacy Policy - ccreward',
    description: 'Privacy Policy for ccreward.',
    url: 'https://ccreward.app/privacy',
    type: 'website',
  },
};

export default function Privacy() {
  return <PrivacyClient />;
}
