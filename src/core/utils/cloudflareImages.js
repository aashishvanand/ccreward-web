const DEFAULT_CLOUDFLARE_IMAGES_ACCOUNT_HASH = "o7c7-WjKE1zaslpSuiAT5w";

const CLOUDFLARE_IMAGES_DELIVERY_BASE_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_BASE_URL ||
  `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH || DEFAULT_CLOUDFLARE_IMAGES_ACCOUNT_HASH}`;

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
