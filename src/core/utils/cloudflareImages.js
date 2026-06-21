// Cloudflare Images account hash must come from env vars — no hardcoded fallback.
// Set NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH in .env.local / CI secrets.
const CLOUDFLARE_IMAGES_DELIVERY_BASE_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_BASE_URL ||
  `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH || ''}`;

const ALLOWED_IMAGE_HOSTNAME = "imagedelivery.net";

// Only permit absolute URLs pointing to the trusted Cloudflare Images domain.
const isTrustedAbsoluteUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === ALLOWED_IMAGE_HOSTNAME;
  } catch {
    return false;
  }
};

// Cloudflare image IDs are UUIDs / alphanumeric slugs — reject anything else.
const SAFE_IMAGE_ID_RE = /^[a-zA-Z0-9_\-/]+$/;

const normalizeImageId = (imageId) => String(imageId).replace(/^\/+/, "");

export const buildCloudflareImageUrl = (imageId, variant = "public") => {
  if (!imageId) {
    return "";
  }

  if (/^https?:\/\//i.test(imageId)) {
    return isTrustedAbsoluteUrl(imageId) ? imageId : "";
  }

  if (imageId.startsWith("/")) {
    return imageId;
  }

  const normalized = normalizeImageId(imageId);
  if (!SAFE_IMAGE_ID_RE.test(normalized)) {
    return "";
  }

  return `${CLOUDFLARE_IMAGES_DELIVERY_BASE_URL}/${normalized}/${variant || "public"}`;
};
