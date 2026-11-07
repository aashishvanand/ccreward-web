import AccessibilityClient from './AccessibilityClient';

export const metadata = {
  title: 'Accessibility',
  description: 'Accessibility support in the ccreward iOS app: Dark Mode, contrast, Reduce Motion, VoiceOver, text size and how to send feedback.',
  alternates: {
    canonical: 'https://ccreward.app/accessibility',
  },
  openGraph: {
    title: 'Accessibility - ccreward',
    description: 'Accessibility support in the ccreward app.',
    url: 'https://ccreward.app/accessibility',
    type: 'website',
  },
};

export default function Accessibility() {
  return <AccessibilityClient />;
}
