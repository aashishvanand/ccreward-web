import { redirect } from 'next/navigation';

export const metadata = {
  robots: 'noindex',
};

export default function HowToRedirect() {
  redirect('/in/howto');
}
