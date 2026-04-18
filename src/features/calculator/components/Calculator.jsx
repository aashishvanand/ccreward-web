import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Stack,
  useTheme,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useAuth } from "@/core/providers/AuthContext";
import {
  getCardsForUser,
  addCardForUser,
} from "@/core/services/firebaseUtils";
import { addUserCard } from "@/core/services/api";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import PageHeader from "@/shared/components/layout/PageHeader";
import CalculatorForm from "./CalculatorForm";
import AddToMyCardsButton from "../../cards/components/AddToMyCardsButton";
import QuickCardSelector from "@/shared/components/ui/QuickCardSelector";
import ReportButtons from "@/shared/components/ui/ReportButtons";
import FeedbackButtons from "@/shared/components/ui/FeedbackButtons";
import MissingBankCardForm from "./ReportForms/MissingBankCardForm";
import IncorrectRewardReportForm from "./ReportForms/IncorrectRewardReportForm";
import ErrorAlert from "@/shared/components/ui/ErrorAlert";
import { calculateRewards } from "@/core/services/api";
import { logCalculation } from "@/core/services/analytics";
import { useCardSelection } from "./CalculatorHooks";
import CalculationResults from "./CalculationResults";
import useUsageLimit from "@/core/hooks/useUsageLimit";
import { RateLimitedFeature } from "@/core/services/usageLimitService";
import UsageRemainingBadge from "@/shared/components/ui/UsageRemainingBadge";
import dynamic from "next/dynamic";
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });
import ReferralButton from "./ReferralButton";
import { useRegion } from "@/core/providers/RegionContext";
import { motion } from "framer-motion";
import {
  useAnalytics,
  usePagePerformance,
  useFormTracking,
} from "@/core/hooks";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

function Calculator() {
  const theme = useTheme();
  const { region, isInitialized, isLoading } = useRegion();
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
  const [incorrectRewardReportOpen, setIncorrectRewardReportOpen] =
    useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const { remaining, limit, canUse, onSuccess: recordUsage, limitMessage } =
    useUsageLimit(RateLimitedFeature.CALCULATOR);

  const {
    selectedBank,
    selectedCard,
    selectedMcc,
    spentAmount,
    selectedCurrency,
    additionalInputs,
    handleBankChange,
    handleCardChange,
    handleMccChange,
    handleSpentAmountChange,
    handleCurrencyChange,
    handleAdditionalInputChange,
    resetAllFields,
  } = useCardSelection();

  const [calculationResult, setCalculationResult] = useState(null);
  const [calculationId, setCalculationId] = useState(null);
  const [calculationPerformed, setCalculationPerformed] = useState(false);
  const [lastCalculationInputs, setLastCalculationInputs] = useState(null);
  const { trackButtonClick, trackFeatureUsage, trackConversion } =
    useAnalytics();
  const { recordCustomMetric } = usePagePerformance("calculator");
  const { trackFormStart, trackFormSubmission } =
    useFormTracking("reward-calculator");

  useEffect(() => {
    trackFeatureUsage("calculator_loaded", { region });
    trackFormStart();
  }, []);

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

    if (!loading) {
      if (isAuthenticated()) {
        fetchUserCards();
      } else {
        setIsFetchingUserData(false);
      }
    }
  }, [user, isAuthenticated, loading]);

  const handleAddCard = useCallback(async () => {
    if (user) {
      try {
        const cardData = {
          bank: selectedBank,
          cardName: selectedCard,
        };
        const country = localStorage.getItem('app-region')?.toLowerCase() || 'in';
        const apiPayload = {
          bank: selectedBank,
          cardName: selectedCard,
          country,
          addedAt: new Date().toISOString(),
        };
        // Write to Firestore and CF API in parallel; Firestore is source of truth
        const [firestoreResult] = await Promise.allSettled([
          addCardForUser(user.uid, cardData),
          addUserCard(apiPayload).catch((err) => {
            console.warn('CF API addUserCard failed (non-critical):', err);
          }),
        ]);
        if (firestoreResult.status === 'rejected') {
          throw firestoreResult.reason;
        }
        const newCardId = firestoreResult.value;
        setUserCards((prevCards) => [
          ...prevCards,
          { ...cardData, id: newCardId },
        ]);
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

  const handleQuickCardSelect = useCallback((bank, cardName) => {
    handleBankChange(bank);
    handleCardChange(cardName);
  }, [handleBankChange, handleCardChange]);

  const handleClearAll = useCallback(() => {
    resetAllFields();
    setCalculationResult(null);
    setCalculationId(null);
    setCalculationPerformed(false);
    setLastCalculationInputs(null);
  }, [resetAllFields]);

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

    // Usage limit guard
    if (!canUse) {
      setAlert({
        open: true,
        message: limitMessage,
        severity: "warning",
      });
      return;
    }

    trackButtonClick("calculate_rewards", {
      bank: selectedBank,
      card: selectedCard,
      amount: spentAmount,
      has_mcc: !!selectedMcc,
    });

    const currentInputs = {
      bank: selectedBank,
      card: selectedCard,
      mcc: selectedMcc ? selectedMcc.mcc : null,
      amount: parseFloat(spentAmount),
      currency: selectedCurrency,
      additionalInputs,
      country: region.toLowerCase(),
    };

    if (
      lastCalculationInputs &&
      currentInputs.bank === lastCalculationInputs.bank &&
      currentInputs.card === lastCalculationInputs.card &&
      currentInputs.mcc === lastCalculationInputs.mcc &&
      currentInputs.amount === lastCalculationInputs.amount &&
      currentInputs.currency === lastCalculationInputs.currency &&
      currentInputs.country === lastCalculationInputs.country &&
      JSON.stringify(currentInputs.additionalInputs) === JSON.stringify(lastCalculationInputs.additionalInputs)
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
        currency: selectedCurrency,
        answers: additionalInputs,
        country: region.toLowerCase(),
      });

      trackFormSubmission(true);
      trackConversion("reward_calculation", parseFloat(spentAmount));

      recordCustomMetric("calculation_success", 1);

      logCalculation({
        bank: selectedBank,
        card: selectedCard,
        mcc: selectedMcc?.mcc,
        amount: parseFloat(spentAmount),
        country: region.toLowerCase(),
      });

      // Optimistic local decrement; backend is the source of truth
      recordUsage();

      setCalculationResult(result);
      setCalculationId(result.calculationId || null);
      setCalculationPerformed(true);
      setLastCalculationInputs(currentInputs);

      if (!hasCalculated) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setHasCalculated(true);
      }
    } catch (error) {
      console.error("Error calculating rewards:", error);
      trackFormSubmission(false, error.message);
      recordCustomMetric("calculation_error", 1);
      handleCalculationError(error);
    } finally {
      setIsCalculating(false);
    }
  }, [
    spentAmount,
    selectedBank,
    selectedCard,
    selectedMcc,
    selectedCurrency,
    additionalInputs,
    hasCalculated,
    lastCalculationInputs,
    isLoadingQuestions,
    region,
    canUse,
    limitMessage,
    recordUsage,
  ]);

  const handleCalculationError = (error) => {
    let errorMessage = "Error calculating rewards. Please try again.";
    let severity = "error";

    if (error.message?.includes("too many requests")) {
      errorMessage =
        "You've made too many requests. Please take a break and try again later.";
      severity = "warning";
    } else if (error.response?.data) {
      errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.response.data;
    } else if (!error.response) {
      errorMessage = "Network error. Please check your connection.";
    }

    setAlert({
      open: true,
      message: errorMessage,
      severity,
    });
  };

  const incorrectReportFormData = useMemo(() => ({
    bank: selectedBank,
    card: selectedCard,
    mcc: selectedMcc ? `${selectedMcc.mcc} - ${selectedMcc.name}` : "Not selected",
    spentAmount,
    additionalInputs,
    calculationResult,
  }), [selectedBank, selectedCard, selectedMcc, spentAmount, additionalInputs, calculationResult]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <title>Reward Calculator - CCReward</title>
      <meta name="description" content="Calculate your credit card rewards for specific spends and MCC codes." />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "transparent",
          position: "relative",
          overflow: "hidden"
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
            flexGrow: 1,
          }}
        >
          {showConfetti && <Confetti />}

          <Stack spacing={4}>
            <PageHeader
                title="Reward Calculator"
                subtitle="Calculate your credit card rewards for specific spends and MCC codes."
            />

            <ErrorAlert message={error} onClose={() => setError(null)} />

            <Paper
              elevation={2}
              sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}
            >
              {user && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <UsageRemainingBadge remaining={remaining} limit={limit} />
                </Box>
              )}

              {loading || isFetchingUserData ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Stack spacing={3}>
                  {userCards.length > 0 && (
                    <QuickCardSelector
                      userCards={userCards}
                      selectedBank={selectedBank}
                      selectedCard={selectedCard}
                      onSelectCard={handleQuickCardSelect}
                    />
                  )}
                  <CalculatorForm
                    selectedBank={selectedBank}
                    selectedCard={selectedCard}
                    selectedMcc={selectedMcc}
                    spentAmount={spentAmount}
                    selectedCurrency={selectedCurrency}
                    additionalInputs={additionalInputs}
                    onBankChange={handleBankChange}
                    onCardChange={handleCardChange}
                    onMccChange={handleMccChange}
                    onSpentAmountChange={handleSpentAmountChange}
                    onCurrencyChange={handleCurrencyChange}
                    onAdditionalInputChange={handleAdditionalInputChange}
                    onCalculate={handleCalculate}
                    onClear={handleClearAll}
                    isLoadingQuestions={isLoadingQuestions}
                    setIsLoadingQuestions={setIsLoadingQuestions}
                    isCalculating={isCalculating}
                  />

                  {!calculationPerformed && (
                    <ReportButtons
                      calculationPerformed={false}
                      onMissingFormOpen={() => setMissingFormOpen(true)}
                      onIncorrectRewardOpen={() =>
                        setIncorrectRewardReportOpen(true)
                      }
                    />
                  )}

                  {calculationPerformed && calculationResult && (
                    <Box aria-live="polite" aria-atomic="true">
                      <CalculationResults
                        result={calculationResult}
                        isLoading={isCalculating}
                      />
                      <FeedbackButtons
                        key={calculationId}
                        calculationId={calculationId}
                      />
                      <ReportButtons
                        calculationPerformed={true}
                        onMissingFormOpen={() => setMissingFormOpen(true)}
                        onIncorrectRewardOpen={() =>
                          setIncorrectRewardReportOpen(true)
                        }
                      />
                      <ReferralButton
                        bank={selectedBank}
                        cardName={selectedCard}
                        userCards={userCards}
                        calculationPerformed={calculationPerformed}
                      />
                      {user && (
                        <AddToMyCardsButton
                          user={user}
                          selectedBank={selectedBank}
                          selectedCard={selectedCard}
                          userCards={userCards}
                          onAddCard={handleAddCard}
                        />
                      )}
                    </Box>
                  )}
                </Stack>
              )}
            </Paper>
          </Stack>
        </Container>
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
          formData={incorrectReportFormData}
        />

        {alert.open && (
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, open: false })}
            sx={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: (theme) => theme.zIndex.snackbar,
              maxWidth: "90%",
              width: "auto",
              boxShadow: (theme) => theme.shadows[8],
            }}
          >
            {alert.message}
          </Alert>
        )}
        <Footer />
      </Box>
    </motion.div>
  );
}

export default Calculator;