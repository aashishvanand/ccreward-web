// URL slug helpers shared by pages, links, the sitemap generator and the
// worker's legacy-URL redirects. Keep this file dependency-free: it is also
// imported by worker/index.ts and scripts/generate-sitemap.js.

// "Platinum Reserve" -> "platinum-reserve", "Food & Dining" -> "food-and-dining",
// "Zenith+" -> "zenith-plus", "H.O.G Diners" -> "hog-diners", "Woman's" -> "womans"
export const slugify = (value) =>
    String(value)
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/&/g, ' and ')
        .replace(/\+/g, ' plus ')
        .replace(/['’.]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

// Route params may arrive percent-encoded; malformed sequences must not throw.
export const safeDecode = (value) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

// Returns the item from `names` whose slug matches `slug`, or undefined.
// Accepts legacy params ("platinum%20reserve", "Platinum Reserve") too.
export const findBySlug = (names, slug) => {
    const target = slugify(safeDecode(slug));
    return names.find((name) => slugify(name) === target);
};

export const bankPath = (region, bank) =>
    `/${region.toLowerCase()}/bank/${slugify(bank)}`;

export const cardPath = (region, bank, card) =>
    `${bankPath(region, bank)}/${slugify(card)}`;

export const categoryPath = (region, category) =>
    `/${region.toLowerCase()}/top-cards/${slugify(category)}`;
