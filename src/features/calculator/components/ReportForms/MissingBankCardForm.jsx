"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, ReportProblem as ReportIcon } from "@mui/icons-material";

const MissingBankCardForm = ({ open, onClose, onSubmitSuccess }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [reportType, setReportType] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardName, setCardName] = useState("");
  const [mcc, setMcc] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.target;
    const formData = new FormData(form);

    let submitUrl = "";
    if (reportType === "bank_or_card") {
      submitUrl =
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLScN5YIru311tyglwI3vLjAbeOEHnW8BRWE2ce1qwgch-1mDbQ/formResponse";
    } else if (reportType === "mcc") {
      submitUrl =
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc7xUzKZe9EGWt6p35mTl8Cf0ZlUDFe2ZGWPIKr5PysZSfqIQ/formResponse";
    }

    fetch(submitUrl, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        onSubmitSuccess("Submitted successfully!");
        clearForm();
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        onSubmitSuccess(
          "There was an error submitting. Please try again.",
          "error"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const clearForm = () => {
    setActiveStep(0);
    setReportType("");
    setBankName("");
    setCardName("");
    setMcc("");
    setMerchantName("");
  };

  const steps = ["Select Report Type", "Enter Details"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
              What would you like to report?
            </FormLabel>
            <RadioGroup
              aria-label="report-type"
              name="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <FormControlLabel
                value="bank_or_card"
                control={<Radio />}
                label="Missing Bank or Card"
                sx={{ 
                  mb: 1, 
                  border: `1px solid ${theme.palette.divider}`, 
                  borderRadius: 2, 
                  p: 1, 
                  mx: 0,
                  '&:hover': { bgcolor: theme.palette.action.hover }
                }}
              />
              <FormControlLabel
                value="mcc"
                control={<Radio />}
                label="Missing MCC"
                sx={{ 
                  mb: 1, 
                  border: `1px solid ${theme.palette.divider}`, 
                  borderRadius: 2, 
                  p: 1, 
                  mx: 0,
                  '&:hover': { bgcolor: theme.palette.action.hover }
                }}
              />
            </RadioGroup>
          </FormControl>
        );
      case 1:
        if (reportType === "bank_or_card") {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Bank Name"
                name="entry.1393850936"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Card Name"
                name="entry.576605505"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
          );
        } else if (reportType === "mcc") {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="MCC"
                name="entry.2005151650"
                value={mcc}
                onChange={(e) => setMcc(e.target.value)}
                required
                type="number"
                slotProps={{
                  htmlInput: {
                    min: "0700",
                    max: "9999",
                  },
                }}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Merchant Name"
                name="entry.60356500"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
          );
        }
        return null;
      default:
        return "Unknown step";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden"
          }
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ReportIcon sx={{ fontSize: 32, opacity: 0.9 }} />
            <Typography variant="h5" sx={{
              fontWeight: "bold"
            }}>Report Missing Info</Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close dialog" sx={{ color: "white", opacity: 0.8, '&:hover': { opacity: 1 } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={onClose}
            sx={{ color: 'text.secondary', px: 3 }}
          >
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ px: 3 }}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              disabled={!reportType}
              variant="contained"
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)', // Adjusted shadow color for secondary theme
              }}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)',
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MissingBankCardForm;
