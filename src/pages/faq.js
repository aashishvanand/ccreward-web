import FAQPage from '../features/faq/components/FAQPage';
import SEOHead from '../shared/components/seo/SEOHead';
import { generateMetadata, pageMetadata } from '../shared/components/seo';

const metadata = generateMetadata({
    title: "Frequently Asked Questions - ccreward",
    description: "Find answers to common questions about ccreward.",
    path: '/faq'
});

export async function getStaticProps() {
    return { props: {} };
}

export default function FAQWrapper() {
    return (
        <>
            <SEOHead metadata={metadata} />
            <FAQPage />
        </>
    );
}