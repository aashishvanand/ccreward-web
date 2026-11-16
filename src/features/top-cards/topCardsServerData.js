// Build-time data for the top-cards server pages (src/data is filled by scripts/fetch-static-data.js).
import categoriesIN from '@/data/cardCategories_in.json';
import categoriesSG from '@/data/cardCategories_sg.json';
import cardImagesIN from '@/data/cardImages_in.json';
import cardImagesSG from '@/data/cardImages_sg.json';

const cardKey = (c) => `${c.bank.toLowerCase()}|${c.cardName.toLowerCase()}`;

// Only the images for cards that appear in some category, and only the fields TopCardsPage reads,
// so each page inlines ~5-10 KB instead of every card image in the region. All categories (not just
// the current one) because the hook keeps server data when the category dropdown changes.
function imagesForCategories(categories, images) {
    const wanted = new Set(Object.values(categories).flatMap((c) => c.cards || []).map(cardKey));
    return images
        .filter((img) => wanted.has(cardKey(img)))
        .map(({ id, bank, cardName, orientation }) => ({ id, bank, cardName, orientation }));
}

export const TOP_CARDS_DATA = {
    in: { categories: categoriesIN, images: imagesForCategories(categoriesIN, cardImagesIN) },
    sg: { categories: categoriesSG, images: imagesForCategories(categoriesSG, cardImagesSG) },
};

export function getTopCardsData(region = 'in') {
    return region?.toLowerCase() === 'sg' ? TOP_CARDS_DATA.sg : TOP_CARDS_DATA.in;
}
