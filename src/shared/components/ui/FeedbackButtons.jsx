import { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Collapse,
  Stack,
  CircularProgress,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { submitFeedback } from "@/core/services/api";

const FeedbackButtons = ({ calculationId }) => {
  const [vote, setVote] = useState(null); // "up" | "down" | null
  const [submitted, setSubmitted] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleVote = async (direction) => {
    if (submitted) return;

    setVote(direction);
    setError(null);

    if (direction === "up") {
      setIsSubmitting(true);
      try {
        await submitFeedback({
          vote: "up",
          calculationId,
        });
        setSubmitted(true);
      } catch {
        setError("Failed to submit feedback. Please try again.");
        setVote(null);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setShowFeedbackInput(true);
    }
  };

  const handleSubmitDownvote = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitFeedback({
        vote: "down",
        userFeedback: feedbackText || undefined,
        calculationId,
      });
      setSubmitted(true);
      setShowFeedbackInput(false);
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 1,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 18, color: "text.secondary" }}
        />
        <Typography variant="body2" color="text.secondary">
          Thanks for your feedback!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      <Stack alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Was this helpful?
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleVote("up")}
            disabled={isSubmitting}
            color={vote === "up" ? "primary" : "default"}
            aria-label="Thumbs up"
          >
            {vote === "up" ? (
              <ThumbUpIcon fontSize="small" />
            ) : (
              <ThumbUpOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleVote("down")}
            disabled={isSubmitting}
            color={vote === "down" ? "error" : "default"}
            aria-label="Thumbs down"
          >
            {vote === "down" ? (
              <ThumbDownIcon fontSize="small" />
            ) : (
              <ThumbDownOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          {isSubmitting && vote === "up" && (
            <CircularProgress size={16} />
          )}
        </Stack>

        <Collapse in={showFeedbackInput} sx={{ width: "100%", maxWidth: 400 }}>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              multiline
              minRows={2}
              maxRows={4}
              placeholder="What was incorrect? (optional)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value.slice(0, 500))}
              fullWidth
              size="small"
              inputProps={{ maxLength: 500 }}
              helperText={`${feedbackText.length}/500`}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setShowFeedbackInput(false);
                  setVote(null);
                  setFeedbackText("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSubmitDownvote}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Stack>
          </Stack>
        </Collapse>

        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default FeedbackButtons;
