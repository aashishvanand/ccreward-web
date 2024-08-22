import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Box,
  Link,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  CreditCard,
  VpnKey,
  Security,
  Fingerprint,
  Brightness4,
  Brightness7,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useRouter } from 'next/navigation';
import { useTheme, withTheme } from './ThemeRegistry';

const API_BASE_URL = "https://credit-card-rewards-india-backend.aashishvanand.workers.dev";

function LoginPage() {
  const { mode, toggleTheme } = useTheme();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    // Clear error when tab changes
    setError('');
  }, [tab]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleErrorClose = () => {
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error

    if (!email) {
      showSnackbar("Please enter an email address", "error");
      return;
    }
  
    try {
      const isSignUp = tab === 1;
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      
      const hostname = window.location.hostname;
      let rpID;

      if (hostname.includes('credit-card-rewards-india-calculator.pages.dev')) {
        rpID = 'credit-card-rewards-india-calculator.pages.dev';
      } else if (hostname === 'ccrewards.aashishvanand.me') {
        rpID = 'ccrewards.aashishvanand.me';
      } else {
        // Fallback to the hostname if none of the above conditions are met
        rpID = hostname;
      }

      console.log('Using rpID:', rpID); // Log the rpID for debugging
  
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, rpId: rpID }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Authentication request failed");
      }

      const options = responseData;

      const serverRpId = options.rpId || rpID;
      console.log('Using server rpId:', serverRpId);

      let credential;
    if (isSignUp) {
      credential = await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: base64UrlDecode(options.challenge),
          user: {
            ...options.user,
            id: base64UrlDecode(options.user.id),
          },
          rpId: serverRpId,
        },
      });
    } else {
      credential = await navigator.credentials.get({
        publicKey: {
          ...options,
          challenge: base64UrlDecode(options.challenge),
          allowCredentials: options.allowCredentials.map((cred) => ({
            ...cred,
            id: base64UrlDecode(cred.id),
          })),
          rpId: serverRpId,
        },
        mediation: "optional",
      });
    }

      const preparedCredential = {
        id: credential.id,
        rawId: base64UrlEncode(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: base64UrlEncode(credential.response.clientDataJSON),
          attestationObject: isSignUp ? base64UrlEncode(credential.response.attestationObject) : undefined,
          authenticatorData: !isSignUp ? base64UrlEncode(credential.response.authenticatorData) : undefined,
          signature: !isSignUp ? base64UrlEncode(credential.response.signature) : undefined,
          userHandle: !isSignUp && credential.response.userHandle ? base64UrlEncode(credential.response.userHandle) : undefined,
        },
      };

      const verifyEndpoint = isSignUp ? "/api/auth/signup/verify" : "/api/auth/login/verify";
      const verifyResponse = await fetch(`${API_BASE_URL}${verifyEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          credential: preparedCredential,
        }),
      });

      let verifyResponseData;
      try {
        verifyResponseData = await verifyResponse.json();
      } catch (jsonError) {
        throw new Error('Invalid response from server during verification. Please try again.');
      }

      if (!verifyResponse.ok) {
        throw new Error(verifyResponseData.message || "Verification failed");
      }

      if (verifyResponseData.success) {
        showSnackbar(`${isSignUp ? "Sign up" : "Login"} successful!`, "success");
        router.push('/my-cards');
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message);
      showSnackbar(`${tab === 0 ? "Login" : "Sign up"} failed: ${error.message}`, "error");
    }
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <CreditCard sx={{ mr: 1 }} />
            CardCompare
          </Typography>
          <Button color="inherit" component={Link} href="/">Home</Button>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 2 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
              {tab === 0 ? 'Sign in to your account' : 'Create an account'}
            </Typography>
            <Tabs 
              value={tab} 
              onChange={(e, newValue) => setTab(newValue)} 
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  color: 'text.secondary',
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
            <Typography variant="body2" sx={{ mt: 1, mb: 3, color: 'text.secondary' }}>
              Use your email to {tab === 0 ? 'sign in' : 'sign up'} with a secure passkey
            </Typography>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mt: 2, width: '100%' }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleErrorClose}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<VpnKey />}
              >
                {tab === 0 ? 'Sign in' : 'Sign up'} with Passkey
              </Button>
            </Box>
          </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Why use Passkeys?
              </Typography>
            </Divider>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Security color={mode === 'dark' ? 'secondary' : 'primary'} />
                </ListItemIcon>
                <ListItemText 
                  primary="More secure than passwords" 
                  secondary="Resistant to phishing and data breaches"
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Fingerprint color={mode === 'dark' ? 'secondary' : 'primary'} />
                </ListItemIcon>
                <ListItemText 
                  primary="Easy to use" 
                  secondary="Sign in with your biometrics or device PIN"
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CreditCard color={mode === 'dark' ? 'secondary' : 'primary'} />
                </ListItemIcon>
                <ListItemText 
                  primary="No passwords to remember" 
                  secondary="Your device securely manages authentication"
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>
            </Paper>
      </Container>

      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar> */}
    </Box>
  );
}

function base64UrlDecode(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) {
    input += new Array(5 - pad).join('=');
  }
  return Uint8Array.from(atob(input), c => c.charCodeAt(0));
}

function base64UrlEncode(arrayBuffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default withTheme(LoginPage);