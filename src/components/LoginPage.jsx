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
  IconButton,
} from "@mui/material";
import {
  CreditCard,
  VpnKey,
  Security,
  Fingerprint,
  Brightness4,
  Brightness7,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTheme, withTheme } from "./ThemeRegistry";
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const API_BASE_URL =
  "https://credit-card-rewards-india-backend.aashishvanand.workers.dev";

function LoginPage() {
  const { mode, toggleTheme } = useTheme();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setError("");
  }, [tab]);

  const handleErrorClose = () => {
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setError("Please enter an email address");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const disposableDomains = [
      "yopmail.com",
      "tempmail.com",
      "guerrillamail.com",
      "10minutemail.com",
    ];
    const emailDomain = email.split("@")[1];
    if (disposableDomains.includes(emailDomain)) {
      setError("Please use a valid, non-disposable email address");
      return;
    }

    try {
      const isSignUp = tab === 1;
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication request failed");
      }

      const options = await response.json();
      console.log("Received options:", options);

      let credential;
      if (isSignUp) {
        credential = await startRegistration(options);
      } else {
        credential = await startAuthentication(options);
      }

      const verifyEndpoint = isSignUp
        ? "/api/auth/signup/verify"
        : "/api/auth/login/verify";
      const verifyResponse = await fetch(`${API_BASE_URL}${verifyEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          credential,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || "Verification failed");
      }

      const verifyResult = await verifyResponse.json();
      if (verifyResult.success) {
        router.push("/my-cards");
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <CreditCard sx={{ mr: 1 }} />
            CardCompare
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 2 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: "background.paper" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              {tab === 0 ? "Sign in to your account" : "Create an account"}
            </Typography>
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              sx={{
                mb: 3,
                "& .MuiTab-root": {
                  color: "text.secondary",
                },
                "& .Mui-selected": {
                  color: "primary.main",
                },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
            <Typography
              variant="body2"
              sx={{ mt: 1, mb: 3, color: "text.secondary" }}
            >
              Use your email to {tab === 0 ? "sign in" : "sign up"} with a
              secure passkey
            </Typography>
            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2, width: "100%" }}
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
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
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
                {tab === 0 ? "Sign in" : "Sign up"} with Passkey
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
                <Security color={mode === "dark" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText
                primary="More secure than passwords"
                secondary="Resistant to phishing and data breaches"
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Fingerprint
                  color={mode === "dark" ? "secondary" : "primary"}
                />
              </ListItemIcon>
              <ListItemText
                primary="Easy to use"
                secondary="Sign in with your biometrics or device PIN"
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CreditCard color={mode === "dark" ? "secondary" : "primary"} />
              </ListItemIcon>
              <ListItemText
                primary="No passwords to remember"
                secondary="Your device securely manages authentication"
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Box>
  );
}

function base64UrlDecode(input) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;
  if (pad) {
    input += new Array(5 - pad).join("=");
  }
  return Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
}

function base64UrlEncode(arrayBuffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export default withTheme(LoginPage);
