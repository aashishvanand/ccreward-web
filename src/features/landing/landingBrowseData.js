// Server-side data for the landing page's browse links (bank and category pages), passed down as
// props so the server HTML for /in and /sg links to the right region's pages without bundling
// the full card lists into the client.
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';
import categoriesIN from '@/data/cardCategories_in.json';
import categoriesSG from '@/data/cardCategories_sg.json';
import bankImagesIN from '@/data/bankImages_in.json';
import bankImagesSG from '@/data/bankImages_sg.json';

function forRegion(cards, categories, bankImages) {
    const withLogo = new Set(bankImages.map((b) => b.bank.toLowerCase()));
    return {
        categories: Object.keys(categories),
        // BankSection shows logos; banks without one are listed as text so every bank page is linked
        banksWithoutLogo: Object.entries(cards.issuers)
            .filter(([bank]) => !withLogo.has(bank.toLowerCase()))
            .map(([bank, { cards: list = [] }]) => ({ bank, count: list.length })),
    };
}

export function getLandingBrowseData() {
    return {
        IN: forRegion(cardsIN, categoriesIN, bankImagesIN),
        SG: forRegion(cardsSG, categoriesSG, bankImagesSG),
    };
}
