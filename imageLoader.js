const normalizeSrc = (src) => {
    return src.startsWith('/') ? src.slice(1) : src;
};

export default function smartLoader({ src, width, quality }) {
    const isLocal = src.startsWith('/');

    // If it's a local image (starts with /), let Next.js optimize it via the Binding
    // We construct a standard Next.js image URL which OpenNext will intercept and handle using the IMAGES binding
    if (isLocal) {
        return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
    }

    // If src is already a full URL (e.g. from imagedelivery.net), use it directly
    if (src.startsWith('http')) {
        return src;
    }

    // Existing Cloudflare Images logic for IDs
    const params = [`width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
    }
    const paramsString = params.join(',');
    return `https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${normalizeSrc(src)}/${paramsString}`;
}