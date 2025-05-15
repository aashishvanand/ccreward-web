import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';
import { RegionProvider } from '../core/providers/RegionContext';

const CalculatorWrapper = dynamic(() => import('../features/calculator/components/Calculator'), { ssr: false });

export const metadata = generateMetadata({
  ...pageMetadata.calculator,
  path: '/calculator'
});

export default function CalculatorPage() {
  console.log("📄 [CalculatorPage] Rendering calculator page");

  return (
    <ThemeRegistry>
      <RegionProvider>
        <AuthProvider>
          <CalculatorWrapper />
        </AuthProvider>
      </RegionProvider>
    </ThemeRegistry>
  );
}