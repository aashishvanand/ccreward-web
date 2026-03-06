// src/pages/transfer-calculator.js
import dynamic from 'next/dynamic';
import SEOHead from '@/shared/components/seo/SEOHead';
import { generateMetadata, pageMetadata } from '@/shared/components/seo';
import PerformanceWrapper from '@/shared/components/PerformanceWrapper';

const TransferCalculatorWrapper = dynamic(() => import('@/features/transfer-calculator/components/TransferCalculator'), { ssr: false });

const metadata = generateMetadata({
    ...pageMetadata.transferCalculator,
    path: '/transfer-calculator'
});

export default function TransferCalculatorPage() {
    // No providers needed - they're already in _app.js
    return (
        <PerformanceWrapper name="transfer_calculator_page">
            <SEOHead metadata={metadata} />
            <div style={{ display: 'none', visibility: 'hidden' }}>
                <h1>Transfer Partner Calculator</h1>
                <p>Calculate point transfers to airline and hotel partners.</p>
            </div>
            <TransferCalculatorWrapper />
        </PerformanceWrapper>
    );
}