import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { GoogleAdSense, AdUnit } from "next-google-adsense";
import CalculatorForm from "./CalculatorForm";
import CalculationResults from "./CalculationResults";
import { useCardSelection, useRewardCalculation } from "./CalculatorHooks";
import { getCardConfig } from "./CalculatorHelpers";

function EmbeddableCalculator() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);

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

  const {
    calculationResult,
    calculationPerformed,
    calculateRewards,
    clearForm,
  } = useRewardCalculation(
    selectedBank,
    selectedCard,
    selectedMcc,
    spentAmount,
    additionalInputs
  );

  const handleClear = () => {
    if (resetAllFields) {
      resetAllFields();
    }
    clearForm();
  };

  const handleCalculate = () => {
    if (spentAmount && parseFloat(spentAmount) > 0) {
      setShowAd(true);
      calculateRewards();
    } else {
      setSnackbar({
        open: true,
        message: "Please enter a valid spent amount",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    let timer;
    if (showAd && adTimer > 0) {
      timer = setTimeout(() => setAdTimer(adTimer - 1), 1000);
    } else if (showAd && adTimer === 0) {
      setShowAd(false);
      setAdTimer(5);
    }
    return () => clearTimeout(timer);
  }, [showAd, adTimer]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <GoogleAdSense publisherId="pub-3745126880980552" />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
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
          getCardConfig={getCardConfig}
        />

        {showAd ? (
          <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '250px', 
            my: 2 
          }}
        >
            <Typography variant="body2" gutterBottom>Ad will close in {adTimer} seconds</Typography>
            <CircularProgress size={24} sx={{ mb: 2 }} />
            <AdUnit
              publisherId="pub-3745126880980552"
              slotId="9483663491"
              layout="display"
              responsive
              style={{ display: 'block', width: '100%' }}
            />
          </Box>
        ) : (
          calculationPerformed && calculationResult && (
            <CalculationResults result={calculationResult} />
          )
        )}
      </Container>

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