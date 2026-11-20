"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, ReportProblem as ReportIcon } from "@mui/icons-material";
import { submitFeedback } from "@/core/services/api";

const ReportMccForm = ({ open, onClose, onSubmitSuccess }) => {
  const theme = useTheme();
  const [mcc, setMcc] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Reports go through the API's /v4/feedback endpoint (Turnstile + App Check
    // protected, rate limited) instead of a Google Form.
    try {
      await submitFeedback({
        type: "merchant",
        merchantName,
        mccCode: mcc || undefined,
      });
      if (onSubmitSuccess) onSubmitSuccess("Report submitted successfully!");
      clearForm();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      if (onSubmitSuccess) {
        onSubmitSuccess(
          error.message || "Error submitting report. Please try again.",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setMcc("");
    setMerchantName("");
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
            overflow: "hidden",
            backgroundImage: 'none',
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
            }}>Report MCC Issue</Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close dialog" sx={{ color: "white", opacity: 0.8, '&:hover': { opacity: 1 } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 1
              }}>
                found a missing merchant or incorrect MCC? Help us improve the database by reporting it below.
            </Typography>
            <TextField
                fullWidth
                label="Merchant Name"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
                variant="outlined"
                placeholder="e.g. Amazon, Netflix"
            />
            <TextField
                fullWidth
                label="MCC (if known)"
                value={mcc}
                onChange={(e) => setMcc(e.target.value)}
                type="number"
                slotProps={{
                    htmlInput: {
                        min: "0000",
                        max: "9999",
                    },
                }}
                variant="outlined"
                placeholder="e.g. 5411"
                helperText="Leave blank if you don't know the MCC"
            />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={onClose}
            sx={{ color: 'text.secondary', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting || !merchantName}
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReportMccForm;
