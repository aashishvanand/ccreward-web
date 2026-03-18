import faqs from '@/shared/constants/faq';
import FAQClient from './FAQClient';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about ccreward. Learn about supported banks (HDFC, ICICI, SBI, AMEX, Axis), features, reward calculations, and how to maximize your credit card benefits.',
  alternates: {
    canonical: 'https://ccreward.app/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions - ccreward',
    description: 'Find answers to common questions about ccreward.',
    url: 'https://ccreward.app/faq',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ccreward FAQ',
    description: 'Find answers to common questions about ccreward.',
  },
};

export default function FAQ() {
  // Build FAQ JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Server-rendered FAQ content for SEO */}
      <article data-ssr-content="faq">
        <header style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Everything you need to know about ccreward and maximizing your credit card rewards.
          </p>
        </header>

        <section style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
                {faq.question}
              </h2>
              <p style={{ lineHeight: 1.7, color: '#444' }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </section>
      </article>
      <FAQClient />
    </>
  );
}
