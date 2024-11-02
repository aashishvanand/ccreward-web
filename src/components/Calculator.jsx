import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Stack,
  useTheme,
  CircularProgress
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
import { calculateRewards } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import { logCalculation } from '../firebase/analytics';

function Calculator() {
  const theme = useTheme();
  const { user, isAuthenticated, loading } = useAuth();
  const [userCards, setUserCards] = useState([]);
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [missingFormOpen, setMissingFormOpen] = useState(false);
  const [incorrectRewardReportOpen, setIncorrectRewardReportOpen] = useState(false);
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
      } else {
        setIsFetchingUserData(false);
      }
    };

    if (isAuthenticated()) {
      fetchUserCards();
    }
  }, [user, isAuthenticated]);

  const handleAddCard = useCallback(async () => {
    if (user) {
      try {
        const cardData = {
          bank: selectedBank,
          cardName: selectedCard,
        };
        const newCardId = await addCardForUser(user.uid, cardData);
        setUserCards((prevCards) => [...prevCards, { ...cardData, id: newCardId }]);
        setAlert({
          open: true,
          message: "Card added to your collection successfully!",
          severity: "success",
        });
      } catch (error) {
        console.error("Error adding card:", error);
        setAlert({
          open: true,
          message: error.message || "Failed to add card. Please try again.",
          severity: "error",
        });
      }
    }
  }, [user, selectedBank, selectedCard]);

  const handleCalculate = useCallback(async () => {
    if (!spentAmount || parseFloat(spentAmount) <= 0) {
      setAlert({
        open: true,
        message: isLoadingQuestions
          ? "Please wait for questions to load before calculating."
          : "Please enter a valid spent amount",
        severity: "error",
      });
      return;
    }

    const currentInputs = {
      bank: selectedBank,
      card: selectedCard,
      mcc: selectedMcc ? selectedMcc.mcc : null,
      amount: parseFloat(spentAmount),
      additionalInputs,
    };

    if (
      lastCalculationInputs &&
      JSON.stringify(currentInputs) === JSON.stringify(lastCalculationInputs)
    ) {
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateRewards({
        bank: selectedBank,
        card: selectedCard,
        mcc: selectedMcc ? selectedMcc.mcc : null,
        amount: parseFloat(spentAmount),
        answers: additionalInputs,
      });

      logCalculation({
        bank: selectedBank,
        card: selectedCard,
        mcc: selectedMcc?.mcc,
        amount: parseFloat(spentAmount),
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
      handleCalculationError(error);
    } finally {
      setIsCalculating(false);
    }
  }, [
    spentAmount,
    selectedBank,
    selectedCard,
    selectedMcc,
    additionalInputs,
    hasCalculated,
    lastCalculationInputs,
    isLoadingQuestions,
  ]);

  const handleCalculationError = (error) => {
    let errorMessage = "Error calculating rewards. Please try again.";
    let severity = "error";

    if (error.message?.includes("too many requests")) {
      errorMessage = "You've made too many requests. Please take a break and try again later.";
      severity = "warning";
    } else if (error.response?.data) {
      errorMessage = error.response.data.error || error.response.data.message || error.response.data;
    } else if (!error.response) {
      errorMessage = "Network error. Please check your connection.";
    }

    setAlert({
      open: true,
      message: errorMessage,
      severity,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Header />

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        {showConfetti && <ReactConfetti />}
        
        <Stack spacing={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Credit Card Reward Calculator
          </Typography>

          <ErrorAlert message={error} onClose={() => setError(null)} />

          {isFetchingUserData ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
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
                isLoadingQuestions={isLoadingQuestions}
                setIsLoadingQuestions={setIsLoadingQuestions}
                isCalculating={isCalculating}
              />

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
            </Stack>
          )}
        </Stack>
      </Container>

      <AnonymousConversionPrompt />

      <MissingBankCardForm
        open={missingFormOpen}
        onClose={() => setMissingFormOpen(false)}
        onSubmitSuccess={(message) =>
          setAlert({ open: true, message, severity: "success" })
        }
      />

      <IncorrectRewardReportForm
        open={incorrectRewardReportOpen}
        onClose={() => setIncorrectRewardReportOpen(false)}
        onSubmitSuccess={(message) =>
          setAlert({ open: true, message, severity: "success" })
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

      {alert.open && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: theme.zIndex.snackbar,
            maxWidth: "90%",
            width: "auto",
            boxShadow: theme.shadows[8],
          }}
        >
          {alert.message}
        </Alert>
      )}
    </Box>
  );
}

export default Calculator;