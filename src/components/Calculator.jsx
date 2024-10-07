import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
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
import { useCardSelection } from "./CalculatorHooks";
import ReactConfetti from "react-confetti";
import { AnonymousConversionPrompt } from "./AnonymousConversionPrompt";
import { calculateRewards, setAuthToken } from "../utils/api";
import { getAuth, getIdToken } from "firebase/auth";
import ErrorAlert from "./ErrorAlert";

function Calculator() {
  const { user, isAuthenticated, loading } = useAuth();
  const [userCards, setUserCards] = useState([]);
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [missingFormOpen, setMissingFormOpen] = useState(false);
  const [incorrectRewardReportOpen, setIncorrectRewardReportOpen] =
    useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

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

  const [calculationResult, setCalculationResult] = useState(null);
  const [calculationPerformed, setCalculationPerformed] = useState(false);
  const [lastCalculationInputs, setLastCalculationInputs] = useState(null);

  const handleError = useCallback(
    (errorMessage) => {
      setError(errorMessage);
      resetAllFields();
    },
    [resetAllFields]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    setCalculationResult(null);
    setCalculationPerformed(false);
  }, [selectedBank, selectedCard]);

  useEffect(() => {
    const fetchUserCards = async () => {
      if (user) {
        setIsFetchingUserData(true);
        try {
          const fetchedCards = await getCardsForUser(user.uid);
          setUserCards(fetchedCards);
          setError(null);
        } catch (err) {
          console.error("Error fetching cards:", err);
          setError("Failed to fetch user cards. Please try again later.");
        } finally {
          setIsFetchingUserData(false);
        }
      }
    };

    const setupAuth = async () => {
      if (!loading && isAuthenticated()) {
        try {
          const auth = getAuth();
          const token = await getIdToken(auth.currentUser, true);
          setAuthToken(token);
          await fetchUserCards();
        } catch (error) {
          console.error("Error setting up authentication:", error);
          setError("Failed to authenticate. Please try logging in again.");
        }
      } else {
        setIsFetchingUserData(false);
      }
    };

    setupAuth();
    setHasCalculated(false);
  }, [user, isAuthenticated, loading]);

  const handleAddCard = useCallback(async () => {
    if (user) {
      try {
        const cardData = {
          bank: selectedBank,
          cardName: selectedCard,
        };
        const newCardId = await addCardForUser(user.uid, cardData);
        setUserCards((prevCards) => [
          ...prevCards,
          { ...cardData, id: newCardId },
        ]);
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
  }, [user, selectedBank, selectedCard]);

  const handleClear = useCallback(() => {
    resetAllFields();
    setCalculationResult(null);
    setCalculationPerformed(false);
    setLastCalculationInputs(null);
  }, [resetAllFields]);

  const handleCalculate = useCallback(async () => {
    if (spentAmount && parseFloat(spentAmount) > 0) {
      const currentInputs = {
        bank: selectedBank,
        card: selectedCard,
        mcc: selectedMcc ? selectedMcc.mcc : null,
        amount: parseFloat(spentAmount),
        additionalInputs,
      };

      // Check if inputs haven't changed since last calculation
      if (
        lastCalculationInputs &&
        JSON.stringify(currentInputs) === JSON.stringify(lastCalculationInputs)
      ) {
        return; // Use cached result, no need to recalculate
      }

      setIsCalculating(true);
      try {
        const processedInputs = Object.entries(additionalInputs).reduce(
          (acc, [key, value]) => {
            acc[key] =
              value === "true" ? true : value === "false" ? false : value;
            return acc;
          },
          {}
        );

        const result = await calculateRewards({
          bank: selectedBank,
          card: selectedCard,
          mcc: selectedMcc ? selectedMcc.mcc : null,
          amount: parseFloat(spentAmount),
          answers: processedInputs,
        });
        setCalculationResult(result);
        setCalculationPerformed(true);
        setLastCalculationInputs(currentInputs);
        if (!hasCalculated) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          setHasCalculated(true);
        }
      } catch (error) {
        console.error("Error calculating rewards:", error);
        let errorMessage = "Error calculating rewards. Please try again.";
        let severity = "error";

        if (error.message && error.message.includes("too many requests")) {
          errorMessage =
            "You've made too many requests. Please take a coffee break and try again later.";
          severity = "warning";
        } else if (error.response) {
          errorMessage =
            error.response.data.message || error.response.data || error.message;
        } else if (error.request) {
          errorMessage =
            "No response received from server. Please check your internet connection.";
        } else {
          errorMessage = error.message;
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: severity,
        });
      } finally {
        setIsCalculating(false);
      }
    } else {
      setSnackbar({
        open: true,
        message: isLoadingQuestions
          ? "Please wait for questions to load before calculating."
          : "Please enter a valid spent amount",
        severity: "error",
      });
    }
  }, [
    spentAmount,
    selectedBank,
    selectedCard,
    selectedMcc,
    additionalInputs,
    hasCalculated,
    lastCalculationInputs,
    isLoadingQuestions, // Add this to the dependency array
  ]);

  const memoizedCalculatorForm = useMemo(
    () => (
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
        onError={handleError}
        isLoadingQuestions={isLoadingQuestions}
        setIsLoadingQuestions={setIsLoadingQuestions}
      />
    ),
    [
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
      handleCalculate,
      handleClear,
      handleError,
      isLoadingQuestions,
    ]
  );

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />

        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          <ErrorAlert message={error} onClose={clearError} />
          {showConfetti && <ReactConfetti />}
          <Typography variant="h4" gutterBottom>
            Credit Card Reward Calculator
          </Typography>

          {isFetchingUserData ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {memoizedCalculatorForm}

              <ReportButtons
                calculationPerformed={calculationPerformed}
                onMissingFormOpen={() => setMissingFormOpen(true)}
                onIncorrectRewardOpen={() => setIncorrectRewardReportOpen(true)}
              />

              {calculationPerformed && (
                <CalculationResults
                  result={calculationResult}
                  isLoading={isCalculating}
                />
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
        </Container>

        <AnonymousConversionPrompt />

        <MissingBankCardForm
          open={missingFormOpen}
          onClose={() => setMissingFormOpen(false)}
          onSubmitSuccess={(message) =>
            setSnackbar({ open: true, message, severity: "success" })
          }
        />

        <IncorrectRewardReportForm
          open={incorrectRewardReportOpen}
          onClose={() => setIncorrectRewardReportOpen(false)}
          onSubmitSuccess={(message) =>
            setSnackbar({ open: true, message, severity: "success" })
          }
          formData={{
            bank: selectedBank,
            card: selectedCard,
            mcc: selectedMcc
              ? `${selectedMcc.mcc} - ${selectedMcc.name}`
              : "Not selected",
            spentAmount,
            additionalInputs,
            calculationResult,
          }}
        />

        <Footer />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Calculator;
