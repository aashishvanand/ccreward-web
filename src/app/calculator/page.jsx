"use client";

import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const Calculator = dynamic(() => import('@/features/calculator/components/Calculator'), { ssr: false });

export default function CalculatorPage() {
  return (
    <PerformanceWrapper name="calculator_page">
      <Calculator />
    </PerformanceWrapper>
  );
}
