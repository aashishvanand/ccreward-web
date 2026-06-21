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
 * Reusable sign-in dialog.
 *
 * Composition rules:
 * - Pass `icon` to show a decorative icon above the message (e.g. <CreditCardIcon />)
 * - Pass `onCancel` + `cancelLabel` to show a cancel button — omit both to hide it
 */
const SignInDialog = ({
  open,
  onClose,
  onGoogleSignIn,
  onAppleSignIn,
  title = 'Sign In Required',
  message = 'Please sign in to continue.',
  icon = null,
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
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', pt: icon ? 4 : 3 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        {icon && (
          <div style={{ marginBottom: 16 }}>{icon}</div>
        )}
        <Typography sx={{ color: "text.secondary" }}>
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
        {onCancel ? (
          <Button
            fullWidth
            onClick={handleCancel}
            sx={{ color: 'text.secondary', mt: 0.5 }}
          >
            {cancelLabel}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default SignInDialog;
