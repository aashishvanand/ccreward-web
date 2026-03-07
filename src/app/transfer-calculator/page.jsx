"use client";

import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const TransferCalculator = dynamic(() => import('@/features/transfer-calculator/components/TransferCalculator'), { ssr: false });

export default function TransferCalculatorPage() {
  return (
    <PerformanceWrapper name="transfer_calculator_page">
      <TransferCalculator />
    </PerformanceWrapper>
  );
}
