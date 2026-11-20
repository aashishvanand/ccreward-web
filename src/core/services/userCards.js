// Shared fetch of the signed-in user's card portfolio.
//
// Header (badge count) and LandingPage (redirect check) both need
// /v4/user/cards on the same page load; without this cache they each make
// the request. The cached result is dropped whenever cards change anywhere
// (notifyCardUpdate, dispatched by MyCardsPage after add/update/delete).
import { getUserCards } from './api';
import { onCardUpdate } from '@/core/utils/events';

// Cache keyed by uid so switching accounts never reuses a result.
let cache = null; // { uid, cards, promise }

const fetchAndCache = (uid) => {
    const promise = getUserCards()
        .then((cards) => {
            if (cache?.uid === uid) cache.cards = cards;
            return cards;
        })
        .catch((error) => {
            // Drop the failed attempt so a retry can hit the network again.
            if (cache?.uid === uid) cache.promise = null;
            throw error;
        });
    cache = { uid, cards: null, promise };
    return promise;
};

/**
 * The user's cards, shared per uid: concurrent callers get one in-flight
 * request, later callers the cached result until it's invalidated.
 * @param {string} uid the signed-in user's Firebase uid
 */
export const getUserCardsShared = (uid) => {
    if (!uid) return Promise.resolve([]);
    if (cache?.uid !== uid) {
        return fetchAndCache(uid);
    }
    if (cache.cards) return Promise.resolve(cache.cards);
    if (!cache.promise) return fetchAndCache(uid);
    return cache.promise;
};

/** Drop the cached result; the next getUserCardsShared fetches again. */
export const invalidateUserCards = () => {
    cache = null;
};

// Card mutations dispatch this event, so the cache never serves stale cards.
if (typeof window !== 'undefined') {
    onCardUpdate(invalidateUserCards);
}
