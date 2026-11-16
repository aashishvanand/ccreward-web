"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { submitAppFeedback, APP_FEEDBACK_MAX_LENGTH } from "@/core/services/api";

/**
 * General feedback about the website, stored with the iOS/Android app feedback
 * (POST /v4/feedback, type "app_feedback"). Only offered to signed-in users.
 */
function AppFeedbackDialog({ open, onClose }) {
  const [text, setText] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const trimmed = text.trim();
  const tooLong = text.length > APP_FEEDBACK_MAX_LENGTH;

  const handleClose = () => {
    if (state === "sending") return;
    onClose();
    // Reset after the close animation so the content doesn't jump
    setTimeout(() => {
      if (state === "sent") setText("");
      setState("idle");
      setError(null);
    }, 200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!trimmed || tooLong) return;
    setState("sending");
    setError(null);
    try {
      await submitAppFeedback(trimmed);
      setState("sent");
    } catch (err) {
      setError(err.message || "Couldn't send your feedback. Please try again.");
      setState("error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Send feedback</DialogTitle>
        <DialogContent>
          {state === "sent" ? (
            <Alert severity="success">Thanks! Your feedback was sent to the ccreward team.</Alert>
          ) : (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Found a wrong reward rate, a missing card, or something that could work
                better? Tell us.
              </DialogContentText>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                autoFocus
                multiline
                minRows={4}
                fullWidth
                label="Your feedback"
                value={text}
                onChange={(e) => setText(e.target.value)}
                error={tooLong}
                helperText={`${text.length.toLocaleString()} / ${APP_FEEDBACK_MAX_LENGTH.toLocaleString()}`}
                disabled={state === "sending"}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {state === "sent" ? (
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          ) : (
            <>
              <Button onClick={handleClose} disabled={state === "sending"}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!trimmed || tooLong || state === "sending"}
                startIcon={state === "sending" ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Send
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AppFeedbackDialog;
