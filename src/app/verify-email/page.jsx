import VerifyEmailClient from './VerifyEmailClient';

// Landing page for the verification link in ccreward-api's branded email
// (src/utils/authEmail.ts), replacing Firebase's default action page.
// ccreward.app/verify-email isn't an app link, so it opens in the browser on every device.
export const metadata = {
  title: 'Verify your email',
  robots: { index: false, follow: false },
};

export default function VerifyEmail() {
  return <VerifyEmailClient />;
}
