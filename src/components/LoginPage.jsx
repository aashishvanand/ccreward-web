'use client';
import React, { useState } from "react";
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


  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      showSnackbar("Please enter an email address", "error");
      return;
    }

    try {
      const isSignUp = tab === 1;
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication request failed");
      }

      const options = await response.json();

      if (window.location.hostname === "localhost") {
        options.rpId = "localhost";
      }

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
          },
          mediation: "optional", // This allows the browser to choose the best option
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

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || "Verification failed");
      }

      const result = await verifyResponse.json();
      if (result.success) {
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
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
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

        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.default' }}>
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              © 2024 CardCompare. All rights reserved.
              <Link color="inherit" href="#" sx={{ ml: 2 }}>
                Terms of Service
              </Link>
              <Link color="inherit" href="#" sx={{ ml: 2 }}>
                Privacy
              </Link>
            </Typography>
          </Container>
        </Box>

      <Snackbar
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
      </Snackbar>
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