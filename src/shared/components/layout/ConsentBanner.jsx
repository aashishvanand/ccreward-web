'use client';

import { useState, useEffect } from 'react';
import { Paper, Button, Box, Typography, Link as MuiLink } from '@mui/material';
import { getAnalyticsConsent, setAnalyticsConsent } from '@/core/services/consent';
import NextLink from '@/shared/components/NextLink';

/**
 * The analytics choice notice (opt-out model). Shown only while the choice is
 * undecided; Accept stores 'granted', Decline stores 'denied' (which stops
 * Google Analytics and Microsoft Clarity — see core/services/consent.js).
 * The footer's "Analytics choices" link clears the stored value so this
 * notice reappears.
 */
function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Client-only reveal: the choice lives in localStorage, so nothing to
    // show during SSR or once a choice (either way) is stored.
    setVisible(getAnalyticsConsent() === null);
  }, []);

  if (!visible) return null;

  const decide = (value) => {
    setAnalyticsConsent(value);
    setVisible(false);
  };

  return (
    <Paper
      elevation={6}
      role="region"
      aria-label="Analytics choice"
      sx={{
        position: 'fixed',
        bottom: { xs: 12, sm: 16 },
        left: { xs: 12, sm: 16 },
        right: { xs: 12, sm: 16 },
        mx: 'auto',
        maxWidth: 620,
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
        zIndex: (theme) => theme.zIndex.snackbar,
        borderRadius: 3,
      }}
    >
      <Typography variant="body2" sx={{ flex: '1 1 300px', minWidth: 0 }}>
        We use privacy-friendly analytics (Google Analytics and Microsoft Clarity) to
        understand how the site is used. You can decline — and change your choice
        later from the footer.{' '}
        <MuiLink component={NextLink} href="/privacy">Privacy&nbsp;policy</MuiLink>
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        <Button size="small" color="inherit" onClick={() => decide('denied')}>
          Decline
        </Button>
        <Button size="small" variant="contained" onClick={() => decide('granted')}>
          Accept
        </Button>
      </Box>
    </Paper>
  );
}

export default ConsentBanner;
