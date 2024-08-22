import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../app/providers/AuthProvider";

const API_BASE_URL =
  "https://credit-card-rewards-india-backend.aashishvanand.workers.dev";

const Topbar = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsSignUp(false);
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAuthAction = async () => {
    if (!email) {
      showSnackbar("Please enter an email address", "error");
      return;
    }

    try {
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
        throw new Error("Authentication request failed");
      }

      const options = await response.json();

      // Adjust rpID for local development
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
    });
  }

  if (!credential || !credential.response) {
    console.error('Invalid credential object:', credential);
    throw new Error('Failed to create credential');
  }

  console.log('Raw credential object:', credential);
  console.log('Credential response:', credential.response);

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
  
  console.log('Prepared credential:', preparedCredential);
  
  const verifyEndpoint = isSignUp
    ? "/api/auth/signup/verify"
    : "/api/auth/login/verify";
  const verifyResponse = await fetch(`${API_BASE_URL}${verifyEndpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      credential: preparedCredential,
    }),
  });
  
  if (!verifyResponse.ok) {
    const errorText = await verifyResponse.text();
    console.error('Server response:', errorText);
    throw new Error(`Verification failed: ${errorText}`);
  }
      if (!verifyResponse.ok) {
        throw new Error("Verification failed");
      }

      const result = await verifyResponse.json();
      if (result.success) {
        if (!isSignUp) {
          login(result.user, result.token);
        }
        showSnackbar(
          `${isSignUp ? "Sign up" : "Login"} successful!`,
          "success"
        );
        handleClose();
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showSnackbar(
        `${isSignUp ? "Sign up" : "Login"} failed: ${error.message}`,
        "error"
      );
    }
  };

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

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Credit Card Rewards Calculator
          </Typography>
          {isAuthenticated ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleOpen}>
              Login / Signup
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isSignUp ? "Sign Up" : "Login"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAuthAction}>
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <Button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Topbar;
