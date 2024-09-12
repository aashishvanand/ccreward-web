import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Dialog,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  Google as GoogleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";
import { useAuth } from "../app/providers/AuthContext";
import { linkWithPopup, GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const CALCULATION_THRESHOLDS = [2, 4, 8, 16, 32, 64, 128];

const AnonymousConversionPrompt = forwardRef((props, ref) => {
  const { user } = useAuth();
  const [calculationCount, setCalculationCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [pendingCred, setPendingCred] = useState(null);

  useEffect(() => {
    if (user && user.isAnonymous) {
      const storedCount = localStorage.getItem("calculationCount");
      if (storedCount) {
        setCalculationCount(parseInt(storedCount, 10));
      }
    }
  }, [user]);

  useImperativeHandle(ref, () => ({
    incrementCalculationCount: () => {
      if (user && user.isAnonymous) {
        const newCount = calculationCount + 1;
        setCalculationCount(newCount);
        localStorage.setItem("calculationCount", newCount.toString());

        if (CALCULATION_THRESHOLDS.includes(newCount)) {
          setShowPrompt(true);
        }
      }
    },
  }));

  const handleConvertAccount = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      const provider = new GoogleAuthProvider();
      await linkWithPopup(currentUser, provider);
      setSnackbar({
        open: true,
        message: 'Account successfully converted to Google account!',
        severity: 'success',
      });
      setShowPrompt(false);
    } catch (error) {
      console.error('Error converting account:', error);
      if (error.code === 'auth/credential-already-in-use') {
        // Store the pending credential
        setPendingCred(error.credential);
        setErrorDialogOpen(true);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to convert account. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleSignInExistingAccount = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Now link the pending credential to the new sign-in
      if (pendingCred) {
        await result.user.linkWithCredential(pendingCred);
        setPendingCred(null);
      }
      
      setSnackbar({
        open: true,
        message: 'Successfully signed in and linked accounts!',
        severity: 'success',
      });
      setErrorDialogOpen(false);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error signing in:', error);
      setSnackbar({
        open: true,
        message: 'Failed to sign in. Please try again.',
        severity: 'error',
      });
    }
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={showPrompt}
        onClose={() => setShowPrompt(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 400,
            m: 2,
          },
        }}
      >
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <CalculateIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="div">
                Enjoying the Calculator?
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              mb={2}
            >
              Link your Google account to save your cards and preferences.
              Access your calculator data on any device!
            </Typography>
            <List dense>
              {[
                "Save cards and preferences",
                "Access from any device",
                "Seamless synchronization",
              ].map((text, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions sx={{ 
            flexDirection: 'column', 
            alignItems: 'stretch', 
            px: 2, 
            pb: 2,
            '& .MuiButton-root': {
              width: '100%',
              justifyContent: 'center',
              height: 36,
              margin: '4px 0', // Add vertical margin
              marginLeft: '0 !important', // Override the default left margin
            }
          }}>
            <Button
              variant="contained"
              sx={{ 
                '& .MuiButton-startIcon': {
                  position: 'absolute',
                  left: 16,
                },
              }}
              onClick={handleConvertAccount}
            >
              <GoogleIcon sx={{ mr: 1 }} />
              Link with Google Account
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setShowPrompt(false)}
            >
              Maybe Later
            </Button>
          </CardActions>
        </Card>
      </Dialog>

      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Account Already Exists
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The Google account youre trying to link is already associated with another account. 
              Would you like to sign in to that account instead?
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button onClick={() => setErrorDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSignInExistingAccount}>
              Sign In
            </Button>
          </CardActions>
        </Card>
      </Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
});

AnonymousConversionPrompt.displayName = "AnonymousConversionPrompt";

export { AnonymousConversionPrompt, CALCULATION_THRESHOLDS };
