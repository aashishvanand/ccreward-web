'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/../firebase';
import { useAuth } from '@/core/providers/AuthContext';
import { useRegion } from '@/core/providers/RegionContext';

const GoogleOneTap = () => {
  const { user, loading } = useAuth();
  const { showRegionModal } = useRegion();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (loading || user || !scriptLoaded || !window.google?.accounts?.id || showRegionModal) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Google Client ID not found. One Tap disabled. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file.');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        use_fedcm_for_prompt: true,
        callback: async (response) => {
          try {
            const { credential } = response;
            const googleCredential = GoogleAuthProvider.credential(credential);
            await signInWithCredential(auth, googleCredential);
          } catch (error) {
            console.error('Error signing in with Google One Tap:', error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('One Tap not displayed:', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log('One Tap skipped:', notification.getSkippedReason());
        }
      });
    } catch (e) {
      console.error('One Tap initialization error', e);
    }

    return () => {
      // Cancel the prompt if the component unmounts or dependencies change (e.g. user signs in)
      window.google?.accounts?.id?.cancel();
    };
  }, [user, loading, scriptLoaded, showRegionModal]);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  );
};

export default GoogleOneTap;
