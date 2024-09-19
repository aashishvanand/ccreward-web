import dynamic from 'next/dynamic';
import { ThemeRegistry } from '../components/ThemeRegistry';

const EmbeddableCalculator = dynamic(() => import('../components/EmbeddableCalculator'), { ssr: false });

export default function EmbeddableCalculatorPage() {
  return (
    <ThemeRegistry>
      <EmbeddableCalculator />
    </ThemeRegistry>
  );
}