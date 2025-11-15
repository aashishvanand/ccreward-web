// src/pages/transfer-calculator.js
import dynamic from 'next/dynamic';
import { generateMetadata, pageMetadata } from '../shared/components/seo';
import PerformanceWrapper from '../shared/components/PerformanceWrapper';

const TransferCalculatorWrapper = dynamic(() => import('../features/transfer-calculator/components/TransferCalculator'), { ssr: false });

export const metadata = generateMetadata({
    ...pageMetadata.transferCalculator,
    path: '/transfer-calculator'
});

export default function TransferCalculatorPage() {
    // No providers needed - they're already in _app.js
    return (
        <PerformanceWrapper name="transfer_calculator_page">
            <TransferCalculatorWrapper />
        </PerformanceWrapper>
    );
}