// Small local helpers replacing the three lodash functions this app used
// (debounce, groupBy, isEqual). Plain data in, plain data out — no `this`
// binding, no options; add options back only if a caller ever needs them.

/**
 * Debounce: run `fn` with the last arguments once `wait` ms have passed
 * without another call. `debounced.cancel()` drops a pending call (used on
 * unmount / resize-handler teardown).
 */
export function debounce(fn, wait = 0) {
    let timer = null;

    const debounced = (...args) => {
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            fn(...args);
        }, wait);
    };

    debounced.cancel = () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debounced;
}

/**
 * Group items by a key: `getKey` is a function (like lodash's iteratee) or
 * a property name.
 */
export function groupBy(list, getKey) {
    const result = {};
    for (const item of list) {
        const key = typeof getKey === 'function' ? getKey(item) : item?.[getKey];
        (result[key] ??= []).push(item);
    }
    return result;
}

/**
 * Structural equality for plain arrays/objects (the card-question configs
 * compared with it contain only JSON-like data). NaN counts as equal to
 * itself, like lodash's isEqual.
 */
export function deepEqual(a, b) {
    if (a === b) return true;
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }
    if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
            return false;
        }
        return a.every((item, i) => deepEqual(item, b[i]));
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
}
