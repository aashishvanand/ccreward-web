import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Backdrop,
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

    // Prepare the form data
    const consoleLog = JSON.stringify(formData);

    const submissionData = new FormData();
    submissionData.append("entry.1871812572", consoleLog); // Console log field
    submissionData.append("entry.507295039", userFeedback); // User feedback field

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
    <>
      <Backdrop
        open={open}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      />
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDialog-paper": {
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Report Incorrect Reward Points</DialogTitle>
          <DialogContent>
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
              inputProps={{ maxLength: 500 }}
              helperText={`${userFeedback.length}/500 characters`}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Submit Report
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default IncorrectRewardReportForm;
