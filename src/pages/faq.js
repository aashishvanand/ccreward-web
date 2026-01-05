import FAQPage from '../features/faq/components/FAQPage';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import { AuthProvider } from '../core/providers/AuthContext';
import { ThemeRegistry } from '../core/providers/ThemeRegistry';

const metadata = generateMetadata({
    ...pageMetadata.faq,
    path: '/faq'
});

export default function FAQWrapper() {
    return (
        <ThemeRegistry>
            <AuthProvider>
                <SEOHead metadata={metadata} />
                <FAQPage />
            </AuthProvider>
        </ThemeRegistry>
    );
}