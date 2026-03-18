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
  return (
    <>
      {/* Server-rendered content for SEO */}
      <article data-ssr-content="terms">
        <header style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Terms of Service</h1>
          <p style={{ color: '#666' }}>Last Updated: January 2, 2026</p>
        </header>
        <section style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using ccreward, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
          <h2>2. Description of Service</h2>
          <p>ccreward provides a credit card rewards calculation and comparison tool that helps users maximize their credit card benefits across multiple banks in India and Singapore.</p>
          <h2>3. User Content</h2>
          <p>Users are responsible for any content they provide through the service. We reserve the right to remove content that violates these terms.</p>
          <h2>4. Data Privacy</h2>
          <p>Your privacy is important to us. Please review our <a href="/privacy">Privacy Policy</a> for details on how we collect, use, and protect your information.</p>
        </section>
      </article>
      <TermsClient />
    </>
  );
}
