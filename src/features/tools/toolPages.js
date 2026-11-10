// Content for the public tool explainer pages (/tools/<slug>). The tools themselves need sign-in
// and are blocked in robots.txt; these pages explain them so they can rank, and link through.
// Numbers come from the build-time data in src/data, so they stay current.
import cardsIN from '@/data/cards_in.json';
import cardsSG from '@/data/cards_sg.json';
import airlinesIN from '@/data/transfer_airline_in.json';
import airlinesSG from '@/data/transfer_airline_sg.json';
import hotelsIN from '@/data/transfer_hotel_in.json';
import hotelsSG from '@/data/transfer_hotel_sg.json';
import { TOOL_SLUGS } from './toolSlugs';

const countCards = (data) =>
    Object.values(data.issuers).reduce((sum, bank) => sum + (bank.cards?.length || 0), 0);

// "(SQ) - KrisFlyer" -> "KrisFlyer"
const programName = (key) => key.replace(/^\([A-Z0-9]{2}\)\s*-\s*/, '');

export const STATS = {
    cards: countCards(cardsIN) + countCards(cardsSG),
    cardsIN: countCards(cardsIN),
    cardsSG: countCards(cardsSG),
    banks: new Set([...Object.keys(cardsIN.issuers), ...Object.keys(cardsSG.issuers)]).size,
    airlines: new Set([...Object.keys(airlinesIN), ...Object.keys(airlinesSG)].map(programName)).size,
    hotels: new Set([...Object.keys(hotelsIN), ...Object.keys(hotelsSG)]).size,
    sampleAirlines: ['KrisFlyer', 'Asia Miles', 'Flying Blue', 'Avios', 'Aeroplan']
        .filter((p) => [...Object.keys(airlinesIN), ...Object.keys(airlinesSG)].some((k) => programName(k).includes(p))),
};

export const TOOL_PAGES = [
    {
        slug: 'credit-card-reward-calculator',
        toolPath: '/calculator',
        cta: 'Open the reward calculator',
        name: 'Credit Card Reward Calculator',
        title: 'Credit Card Reward Calculator for India & Singapore',
        description: `Work out exactly how many points, miles or cashback a purchase earns on any of ${STATS.cards}+ credit cards in India and Singapore, including MCC exclusions, caps and accelerated categories.`,
        intro: [
            `Card reward rates are rarely a single number. A card might earn 5X on travel, 1X on everything else, nothing on fuel or rent, and stop accelerating after a monthly cap. The ccreward reward calculator applies those rules for you: pick a card, enter the amount and the merchant, and it shows what that purchase actually earns.`,
            `It covers ${STATS.cardsIN} cards from Indian banks and ${STATS.cardsSG} from Singapore banks, and matches the merchant to its MCC (merchant category code), which is what banks use to decide the reward rate.`,
        ],
        steps: [
            'Choose your bank and card.',
            'Enter the amount you plan to spend.',
            'Search for the merchant or category (for example "Swiggy" or "airline"), or type the 4-digit MCC if you know it.',
            'Answer any card-specific questions, such as whether it was paid through the bank\'s own portal or as EMI.',
            'See the points, miles or cashback earned, and whether the category is excluded or capped.',
        ],
        features: [
            ['Real reward rules', 'Accelerated categories, exclusions and caps for each card, not a single headline rate.'],
            ['MCC matching', 'Search by merchant name; ccreward finds the merchant category code banks use.'],
            ['Report a wrong rate', 'Spotted a mistake? Flag it from the result and we fix the card\'s rules.'],
        ],
        faqs: [
            ['Is the reward calculator free?', 'Yes. You need a free ccreward account (sign in with Google or Apple) so that results and limits are tied to you.'],
            ['Why does the merchant matter?', 'Banks set reward rates by merchant category code (MCC), not by what you bought. The same purchase can earn different rewards depending on how the merchant is classified.'],
            ['Which banks are covered?', `${STATS.banks} banks across India and Singapore, including HDFC, ICICI, Axis, SBI, AMEX, HSBC, DBS, OCBC, UOB and Citi.`],
        ],
    },
    {
        slug: 'mcc-code-lookup',
        toolPath: '/mcc-lookup',
        cta: 'Open MCC lookup',
        name: 'MCC Code Lookup',
        title: 'MCC Code Lookup - Find a Merchant\'s Category Code',
        description: 'Look up the merchant category code (MCC) for any shop, app or website in India and Singapore, and see why it decides the rewards your credit card earns.',
        intro: [
            'Every card payment carries a 4-digit merchant category code (MCC) that says what kind of business the merchant is: 5411 for grocery stores, 5812 for restaurants, 4511 for airlines. Your bank uses this code, not the item you bought, to decide whether a purchase earns accelerated rewards, regular rewards or nothing at all.',
            'The ccreward MCC lookup lets you search by merchant name to find its code and category, so you can check before you pay whether a purchase counts as dining, travel, utilities or something your card excludes.',
        ],
        steps: [
            'Type a merchant name such as "Amazon", "Zomato" or "Grab".',
            'Pick the match to see its MCC, category and industry details.',
            'Use the code in the reward calculator or best card finder to see what each card earns there.',
            'If a merchant is missing or shows the wrong code, report it and we update it.',
        ],
        features: [
            ['Search by name', 'No need to know the code; search the merchant you\'re paying.'],
            ['India and Singapore', 'Merchant data for both countries, updated from user reports.'],
            ['Works with the calculators', 'The same MCC data powers the reward calculator and best card finder.'],
        ],
        faqs: [
            ['What is an MCC?', 'A merchant category code is a 4-digit number assigned to a merchant by its payment processor. It groups merchants by type (for example 5411 for supermarkets) and banks use it to apply reward rates and exclusions.'],
            ['Can a merchant have more than one MCC?', 'Yes. A merchant can use different codes for different outlets or payment gateways, which is why the same shop can earn differently online and in store.'],
            ['Why don\'t I get rewards on some purchases?', 'Many cards exclude categories such as fuel, rent, wallet loads, insurance or government payments by MCC. Look up the merchant, then check your card in the reward calculator.'],
        ],
    },
    {
        slug: 'best-credit-card-finder',
        toolPath: '/best-card',
        cta: 'Find your best card',
        name: 'Best Credit Card Finder',
        title: 'Best Card for Every Purchase - Compare Your Credit Cards',
        description: 'Compare the credit cards you already have and find which one earns the most for a specific purchase, merchant or category, in India and Singapore.',
        intro: [
            'If you carry more than one credit card, the best one to use changes from purchase to purchase. One card wins on dining, another on online shopping, and a third is the only one that earns anything on utilities.',
            'The best card finder takes the cards in your ccreward wallet, the amount and the merchant, and ranks them by what each would earn for that purchase.',
        ],
        steps: [
            'Add the cards you own to My Cards (once).',
            'Enter the amount and, optionally, the merchant or MCC.',
            'See your cards ranked by what each would earn for that purchase.',
            'Use Advanced Mode to answer card-specific questions for a more precise ranking.',
        ],
        features: [
            ['Uses your own cards', 'Ranks only the cards you hold, so the answer is one you can act on.'],
            ['Per-purchase answer', 'The ranking reflects the merchant\'s category, exclusions and caps.'],
            ['Points or miles', 'Rank by reward points, or by the airline miles those points convert to.'],
        ],
        faqs: [
            ['Do I need to enter my card numbers?', 'No. You only choose the bank and card name. ccreward never asks for card numbers or bank logins.'],
            ['Can I compare cards I don\'t have yet?', `Yes, add any of the ${STATS.cards}+ supported cards to My Cards to see how they would compare. The top cards pages also rank cards by category.`],
        ],
    },
    {
        slug: 'points-transfer-calculator',
        toolPath: '/transfer-calculator',
        cta: 'Open the transfer calculator',
        name: 'Points Transfer Calculator',
        title: 'Credit Card Points Transfer Calculator - Airline Miles & Hotel Points',
        description: `See how many airline miles or hotel points your credit card points convert to across ${STATS.airlines} airline and ${STATS.hotels} hotel programs, including indirect routes, for cards in India and Singapore.`,
        intro: [
            'Many premium cards let you move reward points to airline and hotel loyalty programs, often at better value than redeeming for vouchers. But ratios differ by card and program, some partners are only reachable through another program, and transfers can take days.',
            `The transfer calculator shows every partner your card can transfer to, the ratio, and how many miles or points you would end up with. It covers ${STATS.airlines} airline programs${STATS.sampleAirlines.length ? ` such as ${STATS.sampleAirlines.join(', ')}` : ''} and ${STATS.hotels} hotel programs.`,
        ],
        steps: [
            'Choose your bank and card.',
            'Enter the number of points you have.',
            'Pick an airline or hotel program to see the miles or points you would receive.',
            'Or enter the miles you need for an award, and see which of your cards and balances can get you there.',
        ],
        features: [
            ['Direct and indirect routes', 'Includes routes through another program, for example card points to a hotel program and on to an airline.'],
            ['Work backwards from a goal', 'Enter the miles you need and see the points required.'],
            ['India and Singapore programs', 'Partners and ratios for cards in both countries.'],
        ],
        faqs: [
            ['Are transfer ratios the same for every card?', 'No. The same bank can offer different ratios on different cards, and some partners are only available on premium cards.'],
            ['How long do transfers take?', 'It depends on the partner: some are instant, others take several days. Check before you book an award seat.'],
            ['Can transfers be reversed?', 'Almost never. Once points reach the airline or hotel program they stay there, so transfer only when you are ready to redeem.'],
        ],
    },
];

if (TOOL_PAGES.map((t) => t.slug).join() !== TOOL_SLUGS.join()) {
    throw new Error('TOOL_PAGES and TOOL_SLUGS (src/features/tools/toolSlugs.js) are out of sync');
}

export function getToolPage(slug) {
    return TOOL_PAGES.find((t) => t.slug === slug);
}
