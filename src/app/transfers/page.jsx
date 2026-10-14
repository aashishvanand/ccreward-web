import { permanentRedirect } from 'next/navigation';

export const metadata = { robots: 'noindex' };

export default async function TransfersRedirectPage({ searchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams(params).toString();
  permanentRedirect(`/transfer-calculator${query ? `?${query}` : ''}`);
}
