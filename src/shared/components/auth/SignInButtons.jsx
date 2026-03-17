'use client';
import { Button, Stack, CircularProgress } from '@mui/material';

// Inline SVG icons to avoid external dependencies

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = ({ color = 'currentColor' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.94 9.63c-.023-2.174 1.774-3.22 1.855-3.27-1.01-1.477-2.583-1.68-3.143-1.703-1.338-.136-2.613.789-3.293.789-.68 0-1.731-.77-2.845-.749-1.464.022-2.814.851-3.568 2.162-1.521 2.639-.389 6.55 1.093 8.69.725 1.048 1.59 2.225 2.725 2.183 1.093-.044 1.505-.707 2.826-.707 1.32 0 1.69.707 2.844.685 1.176-.022 1.926-1.069 2.646-2.12.834-1.217 1.177-2.395 1.198-2.456-.026-.012-2.299-.883-2.323-3.503h-.015ZM12.78 3.18c.603-.73 1.01-1.744.899-2.755-.868.035-1.92.578-2.543 1.308-.558.646-1.047 1.678-.915 2.669.968.075 1.957-.493 2.559-1.222Z" fill={color}/>
  </svg>
);

/**
 * Reusable sign-in buttons for Google and Apple.
 * Used in HeroSection, Header sign-in menu, and sign-in dialogs.
 */
const SignInButtons = ({
  onGoogleSignIn,
  onAppleSignIn,
  isLoading = false,
  fullWidth = true,
  size = 'large',
  direction = 'column',
  googleLabel = 'Sign in with Google',
  appleLabel = 'Sign in with Apple',
}) => {
  return (
    <Stack direction={direction} spacing={1.5} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Button
        variant="contained"
        fullWidth={fullWidth}
        size={size}
        onClick={onGoogleSignIn}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          bgcolor: '#fff',
          color: '#3c4043',
          border: '1px solid #dadce0',
          '&:hover': {
            bgcolor: '#f7f8f8',
            borderColor: '#d2e3fc',
            boxShadow: '0 1px 3px rgba(60,64,67,.15)',
          },
          '&.Mui-disabled': {
            bgcolor: '#f5f5f5',
          },
        }}
      >
        {googleLabel}
      </Button>
      <Button
        variant="contained"
        fullWidth={fullWidth}
        size={size}
        onClick={onAppleSignIn}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : <AppleIcon color="#fff" />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          bgcolor: '#000',
          color: '#fff',
          '&:hover': {
            bgcolor: '#333',
          },
          '&.Mui-disabled': {
            bgcolor: '#666',
          },
        }}
      >
        {appleLabel}
      </Button>
    </Stack>
  );
};

export { GoogleIcon, AppleIcon };
export default SignInButtons;
