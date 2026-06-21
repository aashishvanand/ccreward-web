import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export const metadata = {
  title: 'MCC Lookup',
  description: 'Look up Merchant Category Codes (MCC) to find which credit card gives the best rewards for any merchant or spending category.',
  alternates: {
    canonical: 'https://ccreward.app/mcc-lookup',
  },
  openGraph: {
    title: 'MCC Lookup | ccreward',
    description: 'Look up Merchant Category Codes to find the best credit card for any merchant.',
    url: 'https://ccreward.app/mcc-lookup',
  },
  twitter: {
    title: 'MCC Lookup | ccreward',
    description: 'Look up Merchant Category Codes to find the best credit card for any merchant.',
  },
};

const MccLookup = dynamic(() => import('@/features/mcc/components/MccLookup'), { ssr: false });

export default function MccLookupPage() {
  return (
    <PerformanceWrapper name="mcc_lookup_page">
      <MccLookup />
    </PerformanceWrapper>
  );
}
