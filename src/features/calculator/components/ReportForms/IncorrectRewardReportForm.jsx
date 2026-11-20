"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { submitFeedback } from "@/core/services/api";

// /v4/feedback rejects a calculationPayload longer than 20,000 characters
const CALCULATION_PAYLOAD_MAX = 20000;

const IncorrectRewardReportForm = ({
  open,
  onClose,
  onSubmitSuccess,
  formData,
}) => {
  const [userFeedback, setUserFeedback] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await submitFeedback({
        type: "calculator_feedback",
        userFeedback,
        calculationPayload: JSON.stringify(formData).slice(0, CALCULATION_PAYLOAD_MAX),
      });
      onSubmitSuccess("Report submitted successfully!");
      setUserFeedback("");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      onSubmitSuccess(
        error.message ||
          "There was an error submitting the report. Please try again.",
        "error"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: "100%", maxWidth: 500, m: 2 },
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Report Incorrect Reward Points</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              marginBottom: "16px",
            }}
          >
            Please provide feedback about the issue with the reward point
            calculation.
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Your Feedback"
            multiline
            rows={4}
            value={userFeedback}
            onChange={(e) => setUserFeedback(e.target.value)}
            required
            helperText={`${userFeedback.length}/500 characters`}
            slotProps={{
              htmlInput: {
                maxLength: 500,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit Report
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IncorrectRewardReportForm;
