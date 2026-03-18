import HomeClient from '../HomeClient';
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';

// Only allow valid region values
export const dynamicParams = false;

export async function generateStaticParams() {
    return [
        { region: 'in' },
        { region: 'sg' },
    ];
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { region } = resolvedParams;
    const countryName = region === 'sg' ? 'Singapore' : 'India';

    const title = `ccreward ${countryName} - Compare & Maximize Credit Card Rewards`;
    const description = `ccreward helps you compare and maximize credit card rewards in ${countryName}. Find the best card for your spending, check reward points, airport lounge access, and optimize your benefits.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://ccreward.app/${region}`,
            languages: {
                'en-IN': 'https://ccreward.app/in',
                'en-SG': 'https://ccreward.app/sg',
            },
        },
        openGraph: {
            title,
            description,
            url: `https://ccreward.app/${region}`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function RegionPage({ params }) {
    const resolvedParams = await params;
    const { region } = resolvedParams;
    const countryName = region === 'sg' ? 'Singapore' : 'India';
    const cardsData = region === 'sg' ? cardsSG : cardsIN;
    const banks = Object.keys(cardsData.issuers);
    const totalCards = banks.reduce((sum, bank) => sum + (cardsData.issuers[bank]?.cards?.length || 0), 0);

    return (
        <>
            {/* Server-rendered SEO content */}
            <article data-ssr-content="region">
                <header style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                        ccreward {countryName} - Compare &amp; Maximize Credit Card Rewards
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '700px' }}>
                        Compare {totalCards}+ credit cards from {banks.length} banks in {countryName}.
                        Calculate exact rewards, find the best card for your spending, and maximize your credit card benefits.
                    </p>
                </header>

                <section style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        Supported Banks in {countryName}
                    </h2>
                    <ul style={{ lineHeight: 2, listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem 2rem' }}>
                        {banks.map(bank => (
                            <li key={bank}>
                                <a href={`/${region}/bank/${bank.toLowerCase()}`}>
                                    {bank} Credit Cards ({cardsData.issuers[bank]?.cards?.length || 0})
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Popular Categories</h2>
                    <ul style={{ lineHeight: 2 }}>
                        <li><a href={`/${region}/top-cards/Online%20Shopping`}>Best Cards for Online Shopping</a></li>
                        <li><a href={`/${region}/top-cards/Travel%20%26%20Transportation`}>Best Cards for Travel</a></li>
                        <li><a href={`/${region}/top-cards/Food%20%26%20Dining`}>Best Cards for Dining</a></li>
                        <li><a href={`/${region}/top-cards/Groceries`}>Best Cards for Groceries</a></li>
                        <li><a href={`/${region}/top-cards/Petrol`}>Best Cards for Petrol</a></li>
                        <li><a href={`/${region}/top-cards`}>View all categories</a></li>
                    </ul>
                </section>
            </article>
            <HomeClient region={region} />
        </>
    );
}
