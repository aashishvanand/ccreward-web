'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getFirebaseAuth } from '@/firebase';
import { useAuth } from '@/core/providers/AuthContext';
import { useRegion } from '@/core/providers/RegionContext';
import { recordError } from '@/core/services/errorTracking';
import ErrorAlert from '@/shared/components/ui/ErrorAlert';

const GoogleOneTap = () => {
  const { user, loading } = useAuth();
  const { showRegionModal } = useRegion();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (loading || user || !scriptLoaded || !window.google?.accounts?.id || showRegionModal) return;

    // Rate limiting check before init
    try {
      const failures = JSON.parse(sessionStorage.getItem('onetap_failures') || 'null');
      if (failures && failures.count >= 3 && Date.now() - failures.timestamp < 3600000) {
        recordError('google_onetap_rate_limited', {}, false);
        return; // blocked for 1 hour
      }
    } catch (e) {}

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
            const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
            const { auth } = await getFirebaseAuth();
            const googleCredential = GoogleAuthProvider.credential(credential);
            await signInWithCredential(auth, googleCredential);
            sessionStorage.removeItem('onetap_failures'); // reset on success
          } catch (error) {
            recordError('google_onetap_auth_error', { auth_error: error.message }, false);
            
            try {
              const data = sessionStorage.getItem('onetap_failures');
              let count = 1;
              let timestamp = Date.now();
              if (data) {
                const parsed = JSON.parse(data);
                if (Date.now() - parsed.timestamp < 3600000) {
                  count = parsed.count + 1;
                  timestamp = parsed.timestamp;
                }
              }
              sessionStorage.setItem('onetap_failures', JSON.stringify({ count, timestamp }));
              
              if (count >= 3) {
                setErrorMsg('Too many failed attempts. Please try again later.');
                window.google?.accounts?.id?.cancel();
              } else {
                setErrorMsg('Google sign-in failed. Please try again.');
              }
            } catch(e) {
              setErrorMsg('Google sign-in failed. Please try again.');
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      window.google.accounts.id.prompt((notification) => {
        // Notification handling
      });
    } catch (e) {
      recordError('google_onetap_init_error', { error: e.message }, false);
    }

    return () => {
      // Cancel the prompt if the component unmounts or dependencies change (e.g. user signs in)
      window.google?.accounts?.id?.cancel();
    };
  }, [user, loading, scriptLoaded, showRegionModal]);

  return (
    <>
      {errorMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
          <ErrorAlert message={errorMsg} onClose={() => setErrorMsg('')} />
        </div>
      )}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
    </>
  );
};

export default GoogleOneTap;
