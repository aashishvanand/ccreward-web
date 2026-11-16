// Card and bank counts per region, computed from the build-time data files.
// Import only from server components: it pulls in the full cards JSON.
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';

const count = (cardsData) => {
    const issuers = Object.values(cardsData?.issuers || {});
    return {
        cards: issuers.reduce((total, issuer) => total + (issuer.cards?.length || 0), 0),
        banks: issuers.length,
    };
};

export const getCardStats = () => ({
    IN: count(cardsIN),
    SG: count(cardsSG),
});
