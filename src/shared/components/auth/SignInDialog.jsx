'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SignInButtons from './SignInButtons';

/**
 * Reusable sign-in dialog used across CardPage, TopCardsPage, and BankPage.
 */
const SignInDialog = ({
  open,
  onClose,
  onGoogleSignIn,
  onAppleSignIn,
  title = 'Sign In Required',
  message = 'Please sign in to continue.',
  showIcon = false,
  showCancelButton = true,
  cancelLabel = 'Cancel',
  onCancel,
  isLoading = false,
  PaperProps,
}) => {
  const handleCancel = onCancel || onClose;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: PaperProps || { sx: { borderRadius: 3, maxWidth: 400 } }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', pt: showIcon ? 4 : 3 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        {showIcon && (
          <CreditCardIcon
            sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.8 }}
          />
        )}
        <Typography sx={{
          color: "text.secondary"
        }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, flexDirection: 'column', gap: 1 }}>
        <SignInButtons
          onGoogleSignIn={onGoogleSignIn}
          onAppleSignIn={onAppleSignIn}
          isLoading={isLoading}
          fullWidth
          size="large"
        />
        {showCancelButton && (
          <Button
            fullWidth
            onClick={handleCancel}
            sx={{ color: 'text.secondary', mt: 0.5 }}
          >
            {cancelLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SignInDialog;
