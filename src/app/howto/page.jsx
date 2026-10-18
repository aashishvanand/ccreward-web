import { permanentRedirect } from 'next/navigation';

export const metadata = {
  robots: 'noindex',
};

export default function HowToRedirect() {
  permanentRedirect('/in/howto');
}
