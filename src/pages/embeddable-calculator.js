"use client";
import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../components/ThemeRegistry';
import { AuthProvider } from '../app/providers/AuthContext';

const EmbeddableCalculator = dynamic(() => import('../components/EmbeddableCalculator'), { ssr: false });

export default function EmbeddableCalculatorPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <EmbeddableCalculator />
      </AuthProvider>
    </ThemeRegistry>
  );
}