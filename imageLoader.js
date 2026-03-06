const normalizeSrc = (src) => {
    return src.startsWith('/') ? src.slice(1) : src;
};

const DEFAULT_CLOUDFLARE_IMAGES_ACCOUNT_HASH = "o7c7-WjKE1zaslpSuiAT5w";
const CLOUDFLARE_IMAGES_DELIVERY_BASE_URL =
    process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_BASE_URL ||
    `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH || DEFAULT_CLOUDFLARE_IMAGES_ACCOUNT_HASH}`;

export default function smartLoader({ src, width, quality }) {
    const isLocal = src.startsWith('/');

    if (isLocal) {
        return `/_vinext/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
    }

    if (src.startsWith('http')) {
        return src;
    }

    const params = [`width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
    }
    const paramsString = params.join(',');
    return `${CLOUDFLARE_IMAGES_DELIVERY_BASE_URL}/${normalizeSrc(src)}/${paramsString}`;
}
