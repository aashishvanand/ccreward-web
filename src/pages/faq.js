import FAQPage from '../features/faq/components/FAQPage';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata, pageMetadata } from '../shared/components/seo';

const metadata = generateMetadata({
    ...pageMetadata.faq,
    path: '/faq'
});

export default function FAQWrapper() {
    return (
        <>
            <SEOHead metadata={metadata} />
            <FAQPage />
        </>
    );
}