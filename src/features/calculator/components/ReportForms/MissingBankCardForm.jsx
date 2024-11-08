import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Backdrop,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

const MissingBankCardForm = ({ open, onClose, onSubmitSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [reportType, setReportType] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardName, setCardName] = useState("");
  const [mcc, setMcc] = useState("");
  const [merchantName, setMerchantName] = useState("");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
          <FormControl component="fieldset" slots={{ root: "fieldset" }}>
            <FormLabel component="legend" slots={{ root: "legend" }}>
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
                control={<Radio slots={{ root: "input" }} />}
                label="Missing Bank or Card"
              />
              <FormControlLabel
                value="mcc"
                control={<Radio slots={{ root: "input" }} />}
                label="Missing MCC"
              />
            </RadioGroup>
          </FormControl>
        );
      case 1:
        if (reportType === "bank_or_card") {
          return (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Bank Name"
                name="entry.1393850936"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                slots={{ root: "div", input: "input" }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Card Name"
                name="entry.576605505"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                slots={{ root: "div", input: "input" }}
              />
            </>
          );
        } else if (reportType === "mcc") {
          return (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="MCC"
                name="entry.2005151650"
                value={mcc}
                onChange={(e) => setMcc(e.target.value)}
                required
                type="number"
                slots={{ root: "div", input: "input" }}
                slotProps={{
                  input: {
                    min: "0700",
                    max: "9999",
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Merchant Name"
                name="entry.60356500"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
                slots={{ root: "div", input: "input" }}
              />
            </>
          );
        }
        return null;
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      <Backdrop
        open={open}
        slots={{ root: "div" }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      />
      <Dialog
        open={open}
        onClose={onClose}
        slots={{
          root: "div",
          backdrop: "div",
          paper: "div",
        }}
        slotProps={{
          paper: {
            sx: { width: "100%", maxWidth: 500, m: 2 },
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle slots={{ root: "h2" }}>
            Report Missing Information
          </DialogTitle>
          <DialogContent slots={{ root: "div" }} sx={{ pt: 2 }}>
            <Stepper
              activeStep={activeStep}
              sx={{ mb: 3 }}
              slots={{ root: "div" }}
            >
              {steps.map((label) => (
                <Step key={label} slots={{ root: "div" }}>
                  <StepLabel slots={{ root: "span", label: "span" }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {getStepContent(activeStep)}
          </DialogContent>
          <DialogActions slots={{ root: "div" }} sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} slots={{ root: "button" }}>
              Cancel
            </Button>
            {activeStep > 0 && (
              <Button onClick={handleBack} slots={{ root: "button" }}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!reportType}
                slots={{ root: "button" }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                slots={{ root: "button" }}
              >
                Submit
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default MissingBankCardForm;