import React, { useState, useEffect, useCallback } from "react";
import ExportedImage from "next-image-export-optimizer";
import {
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
  Link,
  Paper,
} from "@mui/material";
import CalculatorForm from "./CalculatorForm";
import CalculationResults from "./CalculationResults";
import { useCardSelection } from "./CalculatorHooks";
import { signInAnonymously } from "../utils/firebaseUtils";
import { calculateRewards, setAuthToken, fetchCardQuestions } from "../utils/api";

function EmbeddableCalculator() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  const {
    selectedBank,
    selectedCard,
    selectedMcc,
    spentAmount,
    additionalInputs,
    handleBankChange,
    handleCardChange,
    handleMccChange,
    handleSpentAmountChange,
    handleAdditionalInputChange,
    resetAllFields,
  } = useCardSelection();

  useEffect(() => {
    const initializeAnonymousUser = async () => {
      try {
        const user = await signInAnonymously();
        const token = await user.getIdToken();
        setAuthToken(token);
      } catch (error) {
        console.error("Error signing in anonymously:", error);
        setSnackbar({
          open: true,
          message: "Error initializing calculator. Please try again.",
          severity: "error",
        });
      }
    };

    initializeAnonymousUser();
  }, []);

  const handleClear = () => {
    resetAllFields();
    setCalculationResult(null);
    setCalculationPerformed(false);
  };

  const handleCalculate = useCallback(async () => {
    if (spentAmount && parseFloat(spentAmount) > 0) {
      setIsLoading(true);
      try {
        const result = await calculateRewards({
          bank: selectedBank,
          card: selectedCard,
          mcc: selectedMcc ? selectedMcc.mcc : null,
          amount: parseFloat(spentAmount),
          answers: additionalInputs,
        });
        setCalculationResult(result);
        setCalculationPerformed(true);
      } catch (error) {
        console.error("Error calculating rewards:", error);
        setSnackbar({
          open: true,
          message: "Error calculating rewards. Please try again.",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSnackbar({
        open: true,
        message: "Please enter a valid spent amount",
        severity: "error",
      });
    }
  }, [selectedBank, selectedCard, selectedMcc, spentAmount, additionalInputs]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box sx={{ position: 'relative', width: 50, height: 50, mr: 2 }}>
              <ExportedImage
                src="/ccreward-logo.png"
                alt="CCReward Logo"
                width={50}
                height={50}
                layout="responsive"
                placeholder="empty"
                priority
              />
            </Box>
            <Typography variant="h4" component="h1">
              <Link
                href="https://ccreward.app/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Credit Card Reward Calculator by ccreward.app
              </Link>
            </Typography>
          </Box>

          <CalculatorForm
            selectedBank={selectedBank}
            selectedCard={selectedCard}
            selectedMcc={selectedMcc}
            spentAmount={spentAmount}
            additionalInputs={additionalInputs}
            onBankChange={handleBankChange}
            onCardChange={handleCardChange}
            onMccChange={handleMccChange}
            onSpentAmountChange={handleSpentAmountChange}
            onAdditionalInputChange={handleAdditionalInputChange}
            onCalculate={handleCalculate}
            onClear={handleClear}
            getCardConfig={fetchCardQuestions}
          />

          {calculationPerformed && calculationResult && (
            <CalculationResults result={calculationResult} isLoading={isLoading} />
          )}
        </Container>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmbeddableCalculator;