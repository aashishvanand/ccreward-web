import ToolsIndexPage from '@/features/tools/components/ToolsIndexPage';
import { TOOL_PAGES, STATS } from '@/features/tools/toolPages';

const URL = 'https://ccreward.app/tools';
const description = `Free credit card tools for India and Singapore: reward calculator, MCC code lookup, best card finder and points transfer calculator, covering ${STATS.cards}+ cards.`;

export const metadata = {
    title: 'Credit Card Tools - Rewards, MCC Lookup & Points Transfers',
    description,
    alternates: { canonical: URL },
    openGraph: { title: 'Credit Card Tools - ccreward', description, url: URL, type: 'website' },
};

export default function Tools() {
    const tools = TOOL_PAGES.map(({ slug, name, description: d }) => ({ slug, name, description: d }));
    return <ToolsIndexPage tools={tools} />;
}
