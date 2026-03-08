"use client";

import HowToGuide from '@/features/how-to/HowToGuide';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

export default function HowToClient({ initialGuidesData }) {
  return (
    <PerformanceWrapper name="how_to_page">
      <HowToGuide initialGuidesData={initialGuidesData} />
    </PerformanceWrapper>
  );
}
