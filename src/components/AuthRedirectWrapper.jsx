import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/providers/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthRedirectWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      (<Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
        bgcolor: 'background.default'
      }}
      slots={{
        root: 'div'
      }}
    >
        <CircularProgress size={40} thickness={4} />
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mt: 2,
            animation: 'fadeIn 0.5s ease-in',

            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
              },
              '100%': {
                opacity: 1,
              },
            }
          }}>
          Just a moment...
        </Typography>
      </Box>)
    );
  }

  return isAuthenticated() ? children : null;
};

export default AuthRedirectWrapper;