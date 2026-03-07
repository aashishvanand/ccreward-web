"use client";

import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const BestCardCalculator = dynamic(() => import('@/features/best-card/components/BestCardCalculator'), { ssr: false });

export default function BestCardPage() {
  return (
    <PerformanceWrapper name="best_card_page">
      <BestCardCalculator />
    </PerformanceWrapper>
  );
}
