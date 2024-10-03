import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Link,
} from "@mui/material";
import CalculatorForm from "./CalculatorForm";
import CalculationResults from "./CalculationResults";
import { useCardSelection } from "./CalculatorHooks";
import {
  calculateRewards,
  setAuthToken,
  fetchCardQuestions,
  getCustomToken,
  isTokenExpired,
} from "../utils/api";

function EmbeddableCalculator() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [calculationPerformed, setCalculationPerformed] = useState(false);
  const [customToken, setCustomToken] = useState(null);
  const [apiKeyInvalid, setApiKeyInvalid] = useState(false);

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

  const getApiKey = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("apiKey");
    }
    return null;
  };

  const refreshCustomToken = useCallback(async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setApiKeyInvalid(true);
      return;
    }
    try {
      const token = await getCustomToken(apiKey);
      setCustomToken(token);
      setAuthToken(token, true);
    } catch (error) {
      console.error("Error refreshing custom token:", error);
      if (error.response && error.response.status === 401) {
        setApiKeyInvalid(true);
      } else {
        showSnackbar("Failed to authenticate. Please try again.", "error");
      }
    }
  }, []);

  useEffect(() => {
    refreshCustomToken();
  }, [refreshCustomToken]);

  const handleCalculate = useCallback(async () => {
    if (!customToken || isTokenExpired(customToken)) {
      await refreshCustomToken();
    }

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
        showSnackbar("Error calculating rewards. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showSnackbar("Please enter a valid spent amount", "error");
    }
  }, [
    customToken,
    selectedBank,
    selectedCard,
    selectedMcc,
    spentAmount,
    additionalInputs,
    refreshCustomToken,
  ]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (apiKeyInvalid) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, textAlign: "center" }}>
          <Typography variant="h5" component="h1" gutterBottom>
            API Key Invalid
          </Typography>
          <Typography variant="body1" paragraph>
            The API key is invalid. If you feel you are lost here, please visit
            our main website for more information.
          </Typography>
          <Link
            href="https://ccreward.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            ccreward.app
          </Link>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom>
            Credit Card Reward Calculator
          </Typography>
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
            onClear={resetAllFields}
            getCardConfig={fetchCardQuestions}
          />
          {calculationPerformed && calculationResult && (
            <CalculationResults
              result={calculationResult}
              isLoading={isLoading}
            />
          )}
        </Container>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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
