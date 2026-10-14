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
      <FAQClient />
    </>
  );
}
