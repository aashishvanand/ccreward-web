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

    // Existing Cloudflare Images logic
    const params = [`width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
    }
    const paramsString = params.join(',');
    return `https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${normalizeSrc(src)}/${paramsString}`;
}