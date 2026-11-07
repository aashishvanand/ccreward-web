import HomeClient from './HomeClient';
import { appsJsonLd } from '../shared/constants/jsonLd';
import { serializeJsonLd } from '@/core/utils/jsonLd';
import { getCardStats } from '@/core/utils/cardStats';

export const metadata = {
  title: {
    absolute: 'ccreward - Maximize Your Credit Card Rewards',
  },
  description: 'ccreward helps you compare, calculate, and maximize your credit card rewards. Optimize spending across HDFC, ICICI, SBI, Axis, AMEX and more banks in India and Singapore.',
  alternates: {
    canonical: 'https://ccreward.app',
  },
  openGraph: {
    title: 'ccreward - Maximize Your Credit Card Rewards',
    description: 'ccreward helps you compare, calculate, and maximize your credit card rewards.',
    url: 'https://ccreward.app',
  },
  twitter: {
    title: 'ccreward - Maximize Your Credit Card Rewards',
    description: 'ccreward helps you compare, calculate, and maximize your credit card rewards.',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(appsJsonLd) }}
      />
      <HomeClient cardStats={getCardStats()} />
    </>
  );
}
