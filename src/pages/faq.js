import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const FAQ = dynamic(() => import('../features/faq/components/FAQPage'), { ssr: false });

export const metadata = generateMetadata({
    ...pageMetadata.faq,
    path: '/faq'
});

export default function FAQPage() {
    return (
        <ThemeRegistry>
            <AuthProvider>
                <FAQ />
            </AuthProvider>
        </ThemeRegistry>
    );
}