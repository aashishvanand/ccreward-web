import { redirect } from 'next/navigation';

export const metadata = { robots: 'noindex' };

export default async function TransfersRedirectPage({ searchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams(params).toString();
  redirect(`/transfer-calculator${query ? `?${query}` : ''}`);
}
