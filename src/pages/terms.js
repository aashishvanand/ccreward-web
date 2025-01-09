import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const TermsOfServiceWrapper = dynamic(() => import('../features/legal/components/TermsOfServicePage'), { ssr: false });

export const metadata = generateMetadata({
  title: "Terms of Service - CCReward",
  description: "Read CCReward's terms of service and user agreement for our credit card rewards calculator and comparison tools.",
  path: '/terms'
});

export default function TermsPage() {
  return (
    <ThemeRegistry>
      <AuthProvider>
        <TermsOfServiceWrapper />
      </AuthProvider>
    </ThemeRegistry>
  );
}