"use client";

import dynamic from 'next/dynamic';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const MyCardsList = dynamic(() => import('@/features/cards/components/MyCardsPage'), { ssr: false });

export default function MyCardsPage() {
  return (
    <PerformanceWrapper name="my_cards_page">
      <MyCardsList />
    </PerformanceWrapper>
  );
}
