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
  // Smart App Banner with the App Clip (scan a payment QR without installing the app).
  // Replaces the layout's app-only banner; `itunes` can't express the App Clip fields.
  itunes: null,
  other: {
    'apple-itunes-app': 'app-id=6736835206, app-clip-bundle-id=app.ccreward.Clip, app-clip-display=card',
  },
};

const MccLookup = dynamic(() => import('@/features/mcc/components/MccLookup'));

export default function MccLookupPage() {
  return (
    <PerformanceWrapper name="mcc_lookup_page">
      <MccLookup />
    </PerformanceWrapper>
  );
}
