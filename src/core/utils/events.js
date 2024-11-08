const cardUpdateEvent = new Event('cardUpdate');

export const notifyCardUpdate = () => {
    window.dispatchEvent(cardUpdateEvent);
};

export const onCardUpdate = (callback) => {
    window.addEventListener('cardUpdate', callback);
    return () => window.removeEventListener('cardUpdate', callback);
};