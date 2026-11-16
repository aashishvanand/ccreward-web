"use client";

import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import { getFirebaseAuth } from '@/firebase';

// checking → ready → verifying → verified, or invalid (expired, used, or malformed link)
export default function VerifyEmailClient() {
  const [state, setState] = useState('checking');
  const [email, setEmail] = useState('');
  const [oobCode, setOobCode] = useState(null);

  useEffect(() => {
    // window.location rather than useSearchParams: this page has no server-side data
    const params = new URLSearchParams(window.location.search);
    const code = params.get('oobCode');
    if (!code || (params.get('mode') && params.get('mode') !== 'verifyEmail')) {
      setState('invalid');
      return;
    }
    setOobCode(code);

    // checkActionCode only reads the code; applying it waits for the button, so mail
    // scanners that open links ahead of the user can't use it up
    (async () => {
      try {
        const { auth } = await getFirebaseAuth();
        const { checkActionCode } = await import('firebase/auth');
        const info = await checkActionCode(auth, code);
        setEmail(info.data.email || '');
        setState('ready');
      } catch (error) {
        console.warn('Verify email: invalid code', error?.code);
        setState('invalid');
      }
    })();
  }, []);

  const verify = async () => {
    setState('verifying');
    try {
      const { auth } = await getFirebaseAuth();
      const { applyActionCode } = await import('firebase/auth');
      await applyActionCode(auth, oobCode);
      setState('verified');
    } catch (error) {
      console.warn('Verify email: apply failed', error?.code);
      setState('invalid');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: { xs: 4, md: 8 } }}>
        <Paper
          variant="outlined"
          sx={{ width: '100%', borderRadius: 4, px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 6 }, textAlign: 'center' }}
        >
          <Content state={state} email={email} onVerify={verify} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

function Content({ state, email, onVerify }) {
  if (state === 'checking') {
    return <CircularProgress size={32} sx={{ my: 4 }} aria-label="Checking your link" />;
  }

  if (state === 'verified') {
    return (
      <>
        <CheckCircleRoundedIcon color="success" sx={{ fontSize: 56, mb: 2 }} />
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1.5 }}>
          Email verified
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {email ? <><strong>{email}</strong> is confirmed. </> : 'Your email is confirmed. '}
          Go back to the ccreward app and tap <strong>I&apos;ve Verified</strong> to continue.
        </Typography>
      </>
    );
  }

  if (state === 'invalid') {
    return (
      <>
        <ErrorOutlineRoundedIcon color="warning" sx={{ fontSize: 56, mb: 2 }} />
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1.5 }}>
          This link has expired
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Verification links work once and expire after a while. If you&apos;ve already verified,
          you&apos;re all set. Otherwise, open the ccreward app and tap <strong>Resend Email</strong> to get a new link.
        </Typography>
      </>
    );
  }

  return (
    <>
      <MarkEmailReadRoundedIcon color="primary" sx={{ fontSize: 56, mb: 2 }} />
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1.5 }}>
        Confirm your email
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        {email ? <>Confirm that <strong>{email}</strong> is your email address</> : 'Confirm your email address'} to
        finish setting up your ccreward account.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onVerify}
        disabled={state === 'verifying'}
        sx={{ borderRadius: 2.5, px: 5, py: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
      >
        {state === 'verifying' ? <CircularProgress size={22} color="inherit" /> : 'Verify email'}
      </Button>
    </>
  );
}
