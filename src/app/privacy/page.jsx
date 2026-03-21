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
  return (
    <>
      {/* Server-rendered content for SEO */}
      <article data-ssr-content="privacy">
        <header style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Privacy Policy</h1>
          <p style={{ color: '#666' }}>Last Updated: January 2, 2026</p>
        </header>
        <section style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          <h2>Information We Collect</h2>
          <p>When you use ccreward, we may collect information such as your email address (if you sign in with Google or Apple), and usage data to improve the service.</p>
          <h2>How We Use Your Information</h2>
          <p>We use collected information to provide and improve our credit card rewards calculation service, personalize your experience, and communicate important updates.</p>
          <h2>Data Storage and Security</h2>
          <p>We implement industry-standard security measures to protect your data. Your information is stored securely and accessed only as needed to provide the service.</p>
          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us through the app or via our social media channels.</p>
        </section>
      </article>
      <PrivacyClient />
    </>
  );
}
