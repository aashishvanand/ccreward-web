// Cloudflare Images account hash must come from env vars — no hardcoded fallback.
// Set NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH in .env.local / CI secrets.
const CLOUDFLARE_IMAGES_DELIVERY_BASE_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_BASE_URL ||
  `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH || ''}`;

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

const normalizeImageId = (imageId) => String(imageId).replace(/^\/+/, "");

export const buildCloudflareImageUrl = (imageId, variant = "public") => {
  if (!imageId) {
    return "";
  }

  if (isAbsoluteUrl(imageId) || imageId.startsWith("/")) {
    return imageId;
  }

  return `${CLOUDFLARE_IMAGES_DELIVERY_BASE_URL}/${normalizeImageId(imageId)}/${variant || "public"}`;
};
