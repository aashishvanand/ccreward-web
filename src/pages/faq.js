import dynamic from 'next/dynamic';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const FAQ = dynamic(() => import('../features/faq/components/FAQPage'), { ssr: false });

export default function FAQPage() {
    return (
        <ThemeRegistry>
            <AuthProvider>
                <FAQ />
            </AuthProvider>
        </ThemeRegistry>
    );
}