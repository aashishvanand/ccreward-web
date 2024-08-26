"use client";
import React, { useState, useEffect } from "react";
import { Container, Paper, Box, CircularProgress, Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppTheme } from "./ThemeRegistry";
import { useAuth } from "../app/providers/AuthContext";
import { getCardsForUser, addCardForUser } from "../utils/firebaseUtils";
import Header from "./Header";
import Footer from "./Footer";
import CalculatorForm from "./CalculatorForm";
import CalculationResults from "./CalculationResults";
import AddToMyCardsButton from "./AddToMyCardsButton";
import ReportButtons from "./ReportButtons";
import MissingBankCardForm from "./MissingBankCardForm";
import IncorrectRewardReportForm from "./IncorrectRewardReportForm";
import { useCardSelection, useRewardCalculation } from "./CalculatorHooks";
import { getCardConfig } from "./CalculatorHelpers";

function Calculator() {
  const { mode, toggleTheme, theme } = useAppTheme();
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [userCards, setUserCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

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
  } = useCardSelection();

  const {
    calculationResult,
    calculationPerformed,
    calculateRewards,
    clearForm,
  } = useRewardCalculation(selectedBank, selectedCard, selectedMcc, spentAmount, additionalInputs);

  const [missingFormOpen, setMissingFormOpen] = useState(false);
  const [incorrectRewardReportOpen, setIncorrectRewardReportOpen] = useState(false);

  useEffect(() => {
    const fetchUserCards = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const fetchedCards = await getCardsForUser(user.uid);
          setUserCards(fetchedCards);
          setError(null);
        } catch (err) {
          console.error("Error fetching cards:", err);
          setError("Failed to fetch user cards. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!loading) {
      if (isAuthenticated()) {
        fetchUserCards();
      } else {
        setIsLoading(false);
      }
    }
  }, [user, isAuthenticated, loading]);

  const handleAddCard = async () => {
    if (user) {
      try {
        const cardData = {
          bank: selectedBank,
          cardName: selectedCard,
        };
        const newCardId = await addCardForUser(user.uid, cardData);
        setUserCards((prevCards) => [...prevCards, { ...cardData, id: newCardId }]);
        setSnackbar({
          open: true,
          message: "Card added to your collection successfully!",
          severity: "success",
        });
      } catch (error) {
        console.error("Error adding card:", error);
        setSnackbar({
          open: true,
          message: error.message || "Failed to add card. Please try again.",
          severity: "error",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: "Please sign in to add cards to your collection.",
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Header />

    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading || isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
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
              onCalculate={calculateRewards}
              onClear={clearForm}
              getCardConfig={getCardConfig}
            />

              <ReportButtons
                calculationPerformed={calculationPerformed}
                onMissingFormOpen={() => setMissingFormOpen(true)}
                onIncorrectRewardOpen={() => setIncorrectRewardReportOpen(true)}
              />

              {calculationPerformed && calculationResult && (
                <CalculationResults result={calculationResult} />
              )}

              {calculationPerformed && calculationResult && user && (
                <AddToMyCardsButton
                  user={user}
                  selectedBank={selectedBank}
                  selectedCard={selectedCard}
                  userCards={userCards}
                  onAddCard={handleAddCard}
                />
              )}
            </>
          )}
        </Paper>
      </Container>

      <MissingBankCardForm
        open={missingFormOpen}
        onClose={() => setMissingFormOpen(false)}
        onSubmitSuccess={(message) => setSnackbar({ open: true, message, severity: "success" })}
      />

      <IncorrectRewardReportForm
        open={incorrectRewardReportOpen}
        onClose={() => setIncorrectRewardReportOpen(false)}
        onSubmitSuccess={(message) => setSnackbar({ open: true, message, severity: "success" })}
        formData={{
          bank: selectedBank,
          card: selectedCard,
          mcc: selectedMcc ? `${selectedMcc.mcc} - ${selectedMcc.name}` : "Not selected",
          spentAmount,
          additionalInputs,
          calculationResult,
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}

export default Calculator;