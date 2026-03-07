"use client";

import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const MccLookup = dynamic(() => import('@/features/mcc/components/MccLookup'), { ssr: false });

export default function MccLookupPage() {
  return (
    <PerformanceWrapper name="mcc_lookup_page">
      <MccLookup />
    </PerformanceWrapper>
  );
}
