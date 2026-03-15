// src/features/best-card/components/BestCardCalculator.jsx - Enhanced with Analytics
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Autocomplete,
  TextField,
  List,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  useTheme,
  Paper,
} from "@mui/material";
import {
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import PageHeader from "@/shared/components/layout/PageHeader";
import { useAuth } from "@/core/providers/AuthContext";
import { getCardsForUser } from "@/core/services/firebaseUtils";
import dynamic from "next/dynamic";
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });
import { CardListRenderer } from "./CardListRenderer";
import DynamicCardInputs from "@/shared/components/ui/DynamicCardInputs";
import {
  fetchBestCardQuestions,
  calculateBestCard,
  fetchMCC,
} from "@/core/services/api";
import useUsageLimit from "@/core/hooks/useUsageLimit";
import { RateLimitedFeature } from "@/core/services/usageLimitService";
import UsageRemainingBadge from "@/shared/components/ui/UsageRemainingBadge";
import debounce from "lodash/debounce";
import groupBy from "lodash/groupBy";
import { useRegion } from "@/core/providers/RegionContext";
import { motion } from "framer-motion";
import { getCurrencySymbol, getNativeCurrency } from "@/core/utils";
import CurrencyAmountField from "@/shared/components/ui/CurrencyAmountField";
import CurrencyConversionInfo from "@/shared/components/ui/CurrencyConversionInfo";

// Add analytics imports
import {
  useAnalytics,
  usePagePerformance,
  useEngagementTracking,
  useJourneyTracking,
  useFormTracking,
  useAPITracking,
  useComponentAnalytics,
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

const BestCardCalculator = () => {
  const theme = useTheme();
  const { region } = useRegion();

  // Analytics hooks
  const {
    trackButtonClick,
    trackFeatureUsage,
    trackConversion,
    trackEvent,
    trackError,
  } = useAnalytics();
  const { recordCustomMetric } = usePagePerformance("best-card-calculator");
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackJourneyStep, trackJourneyCompletion } = useJourneyTracking();
  const {
    trackFormStart,
    trackFormSubmission,
    trackFieldInteraction,
    trackFormAbandonment,
  } = useFormTracking("best-card-calculator");
  const { trackAPICall } = useAPITracking();
  const { trackComponentError, trackComponentInteraction } =
    useComponentAnalytics("BestCardCalculator");

  const { remaining, limit, canUse, onSuccess: recordUsage, limitMessage } =
    useUsageLimit(RateLimitedFeature.BEST_CARD);

  const [userCards, setUserCards] = useState([]);
  const [selectedMcc, setSelectedMcc] = useState(null);
  const [spentAmount, setSpentAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(getNativeCurrency(region));
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCardListLoading, setIsCardListLoading] = useState(true);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [mccOptions, setMccOptions] = useState([]);
  const { user, loading } = useAuth();
  const [advancedMode, setAdvancedMode] = useState(false);
  const [cardQuestions, setCardQuestions] = useState([]);
  const [additionalInputs, setAdditionalInputs] = useState({});
  const [sortMethod, setSortMethod] = useState("points");
  const [lastCalculationParams, setLastCalculationParams] = useState(null);
  const [mccInputValue, setMccInputValue] = useState("");
  const [pointsRanking, setPointsRanking] = useState([]);
  const [rankingByValue, setRankingByValue] = useState([]);
  const [rankingByMiles, setRankingByMiles] = useState([]);
  const [isLoadingMcc, setIsLoadingMcc] = useState(false);
  const [currencyConversion, setCurrencyConversion] = useState(null);

  const currentRanking =
    sortMethod === "points"
      ? pointsRanking
      : sortMethod === "miles"
      ? rankingByMiles
      : rankingByValue;

  // Track page load and initialization
  useEffect(() => {
    trackFeatureUsage("best_card_calculator_loaded", {
      region,
      user_authenticated: !!user,
      device_type: window.innerWidth < 768 ? "mobile" : "desktop",
    });

    trackJourneyStep("best_card_calculator_accessed", {
      user_id: user?.uid || "anonymous",
      region,
    });

    trackFormStart();

    recordCustomMetric("page_load_time", performance.now());
  }, [
    trackFeatureUsage,
    trackJourneyStep,
    trackFormStart,
    recordCustomMetric,
    region,
    user,
  ]);

  // Enhanced user cards fetching with analytics
  useEffect(() => {
    const fetchUserCards = async () => {
      if (user) {
        try {
          setIsCardListLoading(true);

          const startTime = performance.now();
          const fetchedCards = await trackAPICall(
            () => getCardsForUser(user.uid),
            "get_user_cards",
            { user_id: user.uid }
          );

          const fetchDuration = performance.now() - startTime;

          setUserCards(fetchedCards);

          // Track user cards analytics
          trackEvent("user_cards_loaded_best_card", {
            user_id: user.uid,
            cards_count: fetchedCards.length,
            fetch_duration: Math.round(fetchDuration),
            region,
          });

          recordCustomMetric("user_cards_count", fetchedCards.length);
          recordCustomMetric("cards_fetch_duration", Math.round(fetchDuration));

          // Check if user has enough cards for comparison
          if (fetchedCards.length < 2) {
            trackEvent("insufficient_cards_for_comparison", {
              user_id: user.uid,
              cards_count: fetchedCards.length,
            });

            setAlert({
              open: true,
              message:
                "Add at least 2 cards to your collection to use the Best Card feature.",
              severity: "info",
            });
          } else {
            await fetchCardQuestions(fetchedCards);
          }
        } catch (error) {
          trackComponentError("user_cards_fetch_failed", {
            error_message: error.message,
            user_id: user.uid,
          });

          setAlert({
            open: true,
            message: "Error fetching user cards. Please try again.",
            severity: "error",
          });
        } finally {
          setIsCardListLoading(false);
        }
      }
    };

    fetchUserCards();
    setHasCalculated(false);
  }, [user, trackAPICall, trackEvent, trackComponentError, recordCustomMetric]);

  // Enhanced MCC search with analytics
  const debouncedFetchMCC = useCallback(
    debounce(async (value) => {
      if (value && value.length >= 2) {
        setIsLoadingMcc(true);
        try {
          const mccData = await trackAPICall(
            () => fetchMCC(value),
            "fetch_mcc",
            { search_query: value }
          );

          setMccOptions(mccData || []);

          trackEvent("mcc_search_results", {
            query: value,
            results_count: mccData?.length || 0,
            has_results: (mccData?.length || 0) > 0,
          });
        } catch (error) {
          trackComponentError("mcc_fetch_failed", {
            search_query: value,
            error_message: error.message,
          });

          setMccOptions([]);
          setAlert({
            open: true,
            message: "Error fetching MCC data. Please try again.",
            severity: "error",
          });
        } finally {
          setIsLoadingMcc(false);
        }
      } else {
        setMccOptions([]);
      }
    }, 300),
    [trackAPICall, trackEvent, trackComponentError]
  );

  // Enhanced card questions fetching with analytics
  const fetchCardQuestions = async (cards) => {
    try {
      const startTime = performance.now();
      const cardsData = cards.map((card) => ({
        bank: card.bank,
        cardName: card.cardName,
      }));

      const questions = await trackAPICall(
        () => fetchBestCardQuestions(cardsData),
        "fetch_best_card_questions",
        { cards_count: cardsData.length }
      );

      const fetchDuration = performance.now() - startTime;

      setCardQuestions(questions);

      trackEvent("card_questions_loaded", {
        user_id: user?.uid,
        cards_count: cardsData.length,
        questions_count: questions.length,
        fetch_duration: Math.round(fetchDuration),
      });

      recordCustomMetric("card_questions_loaded", questions.length);
    } catch (error) {
      trackComponentError("card_questions_fetch_failed", {
        error_message: error.message,
        cards_count: cards.length,
      });

      setAlert({
        open: true,
        message: "Error fetching card questions. Please try again.",
        severity: "error",
      });
      setCardQuestions([]);
    }
  };

  const handleMccInputChange = (event, newValue) => {
    setMccInputValue(newValue);

    trackFieldInteraction("mcc_search", "input_change");

    if (newValue && newValue.length >= 2) {
      trackCustomEngagement("mcc_search_interaction", {
        query_length: newValue.length,
      });
    }

    debouncedFetchMCC(newValue);
  };

  // Enhanced calculation with comprehensive analytics
  const handleCalculate = useCallback(async () => {
    if (!spentAmount || parseFloat(spentAmount) <= 0) {
      trackFormSubmission(false, "Invalid spent amount");

      setAlert({
        open: true,
        message: "Please enter a valid spent amount",
        severity: "error",
      });
      return;
    }

    if (userCards.length < 2) {
      trackFormSubmission(false, "Insufficient cards");

      setAlert({
        open: true,
        message: "You need at least 2 cards to compare.",
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

    trackButtonClick("calculate_best_card", {
      cards_count: userCards.length,
      has_mcc: !!selectedMcc,
      spent_amount: parseFloat(spentAmount),
      advanced_mode: advancedMode,
      additional_inputs_count: Object.keys(additionalInputs).length,
    });

    trackJourneyStep("best_card_calculation_initiated", {
      cards_count: userCards.length,
      calculation_amount: parseFloat(spentAmount),
    });

    const answers = {};
    const cards = userCards
      .filter((card) => card.bank && card.cardName)
      .map((card) => {
        const cardKey = `${card.bank} - ${card.cardName}`;
        const cardAnswers = additionalInputs[cardKey] || {};

        if (Object.keys(cardAnswers).length > 0) {
          const nonEmptyAnswers = Object.entries(cardAnswers).reduce(
            (acc, [key, value]) => {
              if (value !== null && value !== undefined && value !== "") {
                acc[key] = value;
              }
              return acc;
            },
            {}
          );

          if (Object.keys(nonEmptyAnswers).length > 0) {
            answers[cardKey] = nonEmptyAnswers;
          }
        }

        return { bank: card.bank, cardName: card.cardName };
      });

    const calculationParams = {
      cards,
      mcc: selectedMcc ? selectedMcc.mcc : null,
      amount: parseFloat(spentAmount),
      currency: selectedCurrency,
      answers,
    };

    if (
      JSON.stringify(calculationParams) ===
      JSON.stringify(lastCalculationParams)
    ) {
      trackEvent("duplicate_calculation_prevented", {
        user_id: user?.uid,
        cards_count: cards.length,
      });

      setAlert({
        open: true,
        message:
          "Calculation parameters haven't changed. No need to recalculate.",
        severity: "info",
      });
      return;
    }

    setIsLoading(true);
    const startTime = performance.now();

    try {
      const response = await trackAPICall(
        () => calculateBestCard(calculationParams),
        "calculate_best_card",
        {
          cards_count: cards.length,
          has_mcc: !!selectedMcc,
          amount: parseFloat(spentAmount),
        }
      );

      const calculationDuration = performance.now() - startTime;

      // Optimistic local decrement; backend is the source of truth
      recordUsage();

      setPointsRanking(response.rankingByPoints);
      setRankingByValue(response.rankingByValue);
      setRankingByMiles(response.rankingByMiles);
      setCurrencyConversion(response.currencyConversion || null);
      setIsCalculated(true);
      setLastCalculationParams(calculationParams);

      // Track successful calculation
      trackFormSubmission(true);
      trackConversion("best_card_calculated", parseFloat(spentAmount));

      trackJourneyCompletion("best_card_calculation_success", {
        cards_compared: cards.length,
        calculation_duration: Math.round(calculationDuration),
        top_card_bank: response.rankingByPoints[0]?.bank,
        top_card_name: response.rankingByPoints[0]?.cardName,
      });

      trackEvent("best_card_calculation_success", {
        user_id: user?.uid,
        cards_count: cards.length,
        calculation_duration: Math.round(calculationDuration),
        mcc_used: selectedMcc?.mcc || "none",
        amount: parseFloat(spentAmount),
        top_card: `${response.rankingByPoints[0]?.bank} ${response.rankingByPoints[0]?.cardName}`,
        advanced_mode_used: advancedMode,
        region,
      });

      recordCustomMetric(
        "calculation_duration",
        Math.round(calculationDuration)
      );
      recordCustomMetric("cards_compared", cards.length);

      if (!hasCalculated) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setHasCalculated(true);

        trackEvent("first_best_card_calculation", {
          user_id: user?.uid,
          cards_count: cards.length,
        });
      }
    } catch (error) {
      const calculationDuration = performance.now() - startTime;

      trackFormSubmission(false, error.message);
      trackComponentError("best_card_calculation_failed", {
        error_message: error.message,
        calculation_duration: Math.round(calculationDuration),
        cards_count: cards.length,
        user_id: user?.uid,
      });

      handleCalculationError(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    spentAmount,
    userCards,
    selectedMcc,
    selectedCurrency,
    additionalInputs,
    lastCalculationParams,
    hasCalculated,
    advancedMode,
    trackButtonClick,
    trackJourneyStep,
    trackJourneyCompletion,
    trackFormSubmission,
    trackConversion,
    trackEvent,
    trackComponentError,
    trackAPICall,
    recordCustomMetric,
    user,
    canUse,
    limitMessage,
    recordUsage,
  ]);

  const handleCalculationError = (error) => {
    if (error.message.includes("too many requests")) {
      setAlert({
        open: true,
        message: error.message,
        severity: "warning",
      });
    } else {
      setAlert({
        open: true,
        message: "Error calculating best card. Please try again.",
        severity: "error",
      });
    }
  };

  // Enhanced sort method change with analytics
  const handleSortMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      trackButtonClick("sort_method_change", {
        old_method: sortMethod,
        new_method: newMethod,
        results_count: currentRanking.length,
      });

      trackCustomEngagement("results_sorting_interaction", {
        sort_method: newMethod,
      });

      setSortMethod(newMethod);
    }
  };

  // Enhanced advanced mode toggle with analytics
  const handleAdvancedModeToggle = (event, isExpanded) => {
    trackButtonClick("advanced_mode_toggle", {
      new_state: isExpanded,
      questions_available: cardQuestions.length,
    });

    trackCustomEngagement("advanced_mode_interaction", {
      expanded: isExpanded,
    });

    setAdvancedMode(isExpanded);
  };

  const handleImageError = (cardId) => {
    setFailedImages((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  const handleAdditionalInputChange = useCallback(
    (cardKey, inputKey, value) => {
      trackFieldInteraction("advanced_input", "change");

      setAdditionalInputs((prevInputs) => ({
        ...prevInputs,
        [cardKey]: {
          ...(prevInputs[cardKey] || {}),
          [inputKey]: value,
        },
      }));
    },
    [trackFieldInteraction]
  );

  // Track form abandonment on component unmount
  useEffect(() => {
    return () => {
      if (spentAmount && !isCalculated) {
        trackFormAbandonment("spent_amount");
      }
    };
  }, [spentAmount, isCalculated, trackFormAbandonment]);

  // Track scroll engagement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackCustomEngagement("page_scroll", {
          scroll_percentage: scrollPercent,
          has_results: isCalculated,
          cards_count: userCards.length,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCalculated, userCards.length, trackCustomEngagement]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", overflow: "hidden" }}
      >
        <Header />
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Container
            component="main"
            sx={{
              mt: 4,
              mb: 4,
              flexGrow: 1,
            }}
          >
          {showConfetti && <Confetti />}
          <PageHeader 
            title="Best Card Calculator" 
            subtitle="Find the best card to use for your next purchase." 
          />

          <Paper
            elevation={2}
            sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}
          >
            {user && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <UsageRemainingBadge remaining={remaining} limit={limit} />
              </Box>
            )}
            <Stack spacing={3}>
              <Autocomplete
                options={mccOptions}
                value={selectedMcc}
                onChange={(event, newValue) => {
                  setSelectedMcc(newValue);
                  trackFieldInteraction("mcc_selection", "select");

                  if (newValue) {
                    trackEvent("mcc_selected", {
                      mcc_code: newValue.mcc,
                      mcc_name: newValue.name,
                    });
                  }
                }}
                inputValue={mccInputValue}
                onInputChange={handleMccInputChange}
                getOptionLabel={(option) => `${option.mcc} - ${option.name}`}
                loading={isLoadingMcc}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Merchant or MCC (Optional)"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingMcc ? (
                            <CircularProgress size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">
                        {option.mcc} - {option.name}
                      </Typography>
                      {option.knownMerchants?.length > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          Known merchants: {option.knownMerchants.join(", ")}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                filterOptions={(options) => options}
                noOptionsText={
                  mccInputValue.length < 2
                    ? "Type at least 2 characters to search"
                    : "No options found"
                }
              />

              <CurrencyAmountField
                currency={selectedCurrency}
                onCurrencyChange={(val) => {
                  setSelectedCurrency(val);
                  trackFieldInteraction("currency", "select");
                }}
                amount={spentAmount}
                onAmountChange={(val) => {
                  setSpentAmount(val);
                  if (val) trackFieldInteraction("spent_amount", "input");
                }}
                disabled={isLoading}
              />

              <Accordion
                expanded={advancedMode}
                onChange={handleAdvancedModeToggle}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Advanced Mode</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {(() => {
                    const filteredQuestions = cardQuestions.filter((q) => {
                      if (!q.applicableMCCs || q.applicableMCCs.length === 0) {
                        return true;
                      }
                      return (
                        selectedMcc && q.applicableMCCs.includes(selectedMcc.mcc)
                      );
                    });

                    return filteredQuestions.length === 0 ? (
                      <Typography>
                        No additional questions available for the selected
                        criteria.
                      </Typography>
                    ) : (
                      Object.entries(
                        groupBy(
                          filteredQuestions,
                          (q) => `${q.bank}-${q.cardName}`
                        )
                      ).map(([cardKey, questions]) => (
                        <Box key={cardKey} sx={{ mb: 4 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            {cardKey.replace("-", " - ")}
                          </Typography>
                          <DynamicCardInputs
                            cardConfig={questions}
                            onChange={(inputKey, value) =>
                              handleAdditionalInputChange(
                                cardKey.replace("-", " - "),
                                inputKey,
                                value
                              )
                            }
                            currentInputs={
                              additionalInputs[cardKey.replace("-", " - ")] || {}
                            }
                            selectedMcc={selectedMcc}
                          />
                          <Divider sx={{ my: 2 }} />
                        </Box>
                      ))
                    );
                  })()}
                </AccordionDetails>
              </Accordion>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleCalculate}
                    disabled={
                      !spentAmount || parseFloat(spentAmount) <= 0 || isLoading
                    }
                    sx={{ flex: 1, height: 48 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Calculate Best Card"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedMcc(null);
                      setSpentAmount("");
                      setSelectedCurrency(getNativeCurrency(region));
                      setAdditionalInputs({});
                      setIsCalculated(false);
                      setPointsRanking([]);
                      setRankingByValue([]);
                      setRankingByMiles([]);
                      setCurrencyConversion(null);
                      setLastCalculationParams(null);
                      setMccInputValue("");
                    }}
                    sx={{ flex: 1, height: 48 }}
                  >
                    Clear
                  </Button>
                </Stack>


              {isCalculated && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                >
                  <ToggleButtonGroup
                    value={sortMethod}
                    exclusive
                    onChange={handleSortMethodChange}
                    aria-label="sort method"
                  >
                    <ToggleButton value="points" aria-label="sort by points">
                      Ranking by Points/Cashback
                    </ToggleButton>
                    <ToggleButton value="value" aria-label="sort by value">
                      Ranking by Value ({getCurrencySymbol(region)})
                    </ToggleButton>
                    <ToggleButton value="miles" aria-label="sort by miles">
                      Ranking by Miles
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}

              {isCalculated && currencyConversion && (
                <CurrencyConversionInfo
                  currencyConversion={currencyConversion}
                />
              )}

              <List sx={{ width: "100%" }}>
                <CardListRenderer
                  isCardListLoading={isCardListLoading}
                  isCalculated={isCalculated}
                  cardRewards={currentRanking}
                  userCards={userCards}
                  failedImages={failedImages}
                  handleImageError={handleImageError}
                />
              </List>
            </Stack>
          </Paper>
        </Container>
      )}
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
        <Footer />
      </Box>
    </motion.div>
  );
};

export default BestCardCalculator;