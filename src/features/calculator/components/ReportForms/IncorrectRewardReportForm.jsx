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

const IncorrectRewardReportForm = ({
  open,
  onClose,
  onSubmitSuccess,
  formData,
}) => {
  const [userFeedback, setUserFeedback] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const consoleLog = JSON.stringify(formData);
    const submissionData = new FormData();
    submissionData.append("entry.1871812572", consoleLog);
    submissionData.append("entry.507295039", userFeedback);

    fetch(
      "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeW-n8et15bE8wajTKTVXi39dn_sJ4LFzPy9K2BOjlaeSul5A/formResponse",
      {
        method: "POST",
        body: submissionData,
        mode: "no-cors",
      }
    )
      .then(() => {
        onSubmitSuccess("Report submitted successfully!");
        setUserFeedback("");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        onSubmitSuccess(
          "There was an error submitting the report. Please try again.",
          "error"
        );
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "100%", maxWidth: 500, m: 2 },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Report Incorrect Reward Points</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" paragraph>
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
            inputProps={{
              maxLength: 500,
            }}
            helperText={`${userFeedback.length}/500 characters`}
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
