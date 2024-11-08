"use client";
import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { AuthProvider } from '../core/providers/AuthContext';

const EmbeddableCalculator = dynamic(() => import('../features/embedded/components/EmbeddableCalculator'), { ssr: false });

export default function EmbeddableCalculatorPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <EmbeddableCalculator />
      </AuthProvider>
    </ThemeRegistry>
  );
}