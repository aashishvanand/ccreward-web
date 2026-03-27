// src/features/transfer-calculator/components/TransferCalculator.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Stack,
  useTheme,
  CircularProgress,
  Autocomplete,
  TextField,
  Button,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  AccessTime as AccessTimeIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAuth } from "@/core/providers/AuthContext";
import { useRegion } from "@/core/providers/RegionContext";
import {
  fetchBanks,
  fetchCards,
  calculateTransferPartners,
} from "@/core/services/api";
import useUsageLimit from "@/core/hooks/useUsageLimit";
import { RateLimitedFeature } from "@/core/services/usageLimitService";
import UsageRemainingBadge from "@/shared/components/ui/UsageRemainingBadge";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import PageHeader from "@/shared/components/layout/PageHeader";
import { getCurrencySymbol } from "@/core/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAnalytics,
  usePagePerformance,
  useFormTracking,
  usePartnerLogos,
} from "@/core/hooks";
import TransferPartnerGrid from "./TransferPartnerGrid";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const TransferCalculator = () => {
  const theme = useTheme();
  const { region, isInitialized } = useRegion();
  const { user, isAuthenticated, loading } = useAuth();
  const { remaining, limit, canUse, onSuccess: recordUsage, limitMessage } =
    useUsageLimit(RateLimitedFeature.TRANSFERS);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Analytics
  const { trackButtonClick, trackFeatureUsage, trackConversion } =
    useAnalytics();
  const { recordCustomMetric } = usePagePerformance("transfer-calculator");
  const { trackFormStart, trackFormSubmission } = useFormTracking(
    "transfer-calculator"
  );

  // Form State
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [points, setPoints] = useState("");
  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);

  // Loading State
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Result State
  const [calculationResult, setCalculationResult] = useState(null);

  // Logo State
  const { logos, isLoadingLogos, logosError } = usePartnerLogos();

  useEffect(() => {
    trackFeatureUsage("transfer_calculator_loaded", { region });
    trackFormStart();
  }, [trackFeatureUsage, trackFormStart, region]);

  // Handle URL parameters for deep linking
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams(window.location.search);
    const bankParam = params.get("bank");
    const cardParam = params.get("card");
    const pointsParam = params.get("points");

    if (pointsParam && !points) {
      const parsed = parseInt(pointsParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setPoints(parsed.toString());
      }
    }

    if (bankParam && !selectedBank) {
      const applyDeepLinkParams = async () => {
        try {
          const fetchedBanks = await fetchBanks();
          if (fetchedBanks.includes(bankParam)) {
            setSelectedBank(bankParam);

            if (cardParam) {
              const fetchedCards = await fetchCards(bankParam);
              if (fetchedCards.includes(cardParam)) {
                setCards(fetchedCards);
                setSelectedCard(cardParam);
              }
            }
          }
        } catch (error) {
          console.error("Error applying deep link params:", error);
        }
      };
      applyDeepLinkParams();
    }
  }, [isInitialized]);

  // Load banks when region is initialized
  useEffect(() => {
    const loadBanks = async () => {
      if (isInitialized) {
        setIsLoadingBanks(true);
        try {
          const fetchedBanks = await fetchBanks();
          setBanks(fetchedBanks);
        } catch (error) {
          showAlert("Failed to load banks. Please try again.", "error");
        } finally {
          setIsLoadingBanks(false);
        }
      }
    };
    loadBanks();
  }, [isInitialized, region]);

  // Load cards when bank changes
  useEffect(() => {
    const loadCards = async () => {
      if (selectedBank && isInitialized) {
        setIsLoadingCards(true);
        setCards([]);
        try {
          const fetchedCards = await fetchCards(selectedBank);
          setCards(fetchedCards);
        } catch (error) {
          showAlert("Failed to load cards. Please try again.", "error");
        } finally {
          setIsLoadingCards(false);
        }
      }
    };
    loadCards();
  }, [selectedBank, isInitialized, region]);

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleBankChange = (event, newValue) => {
    setSelectedBank(newValue || "");
    setSelectedCard("");
    setCards([]);
    setCalculationResult(null);
  };

  const handleCardChange = (event, newValue) => {
    setSelectedCard(newValue || "");
    setCalculationResult(null);
  };

  const handlePointsChange = (event) => {
    const value = Math.max(1, Number(event.target.value));
    setPoints(value.toString());
  };

  const handleCalculate = async () => {
    if (!selectedBank || !selectedCard || !points || !region) {
      showAlert(
        "Please select a bank, card, and enter points amount.",
        "error"
      );
      return;
    }

    if (!isAuthenticated()) {
      showAlert("Please sign in to use the transfer calculator.", "warning");
      return;
    }

    // Usage limit guard
    if (!canUse) {
      showAlert(limitMessage, "warning");
      return;
    }

    setIsCalculating(true);
    setCalculationResult(null);
    trackButtonClick("calculate_transfers", {
      bank: selectedBank,
      card: selectedCard,
      points: Number(points),
      region,
    });

    try {
      const result = await calculateTransferPartners({
        bank: selectedBank,
        card: selectedCard,
        points: Number(points),
      });
      // Optimistic local decrement; backend is the source of truth
      recordUsage();

      setCalculationResult(result);
      trackFormSubmission(true);
      trackConversion("transfer_calculation", Number(points));
      recordCustomMetric("transfer_partners_found", result.total_partners);
    } catch (error) {
      console.error("Error calculating transfers:", error);
      if (error.response?.data?.code === "NO_TRANSFER_CURRENCY") {
        showAlert(
          error.response.data.error ||
            "The selected card does not have a transferable points currency.",
          "info"
        );
      } else {
        // Handle other errors
        showAlert(
          error.message || "Error calculating transfers. Please try again.",
          "error"
        );
      }
      trackFormSubmission(false, error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const renderPartnerList = (partners, type) => {
    // Get currency from the API response, fallback to region
    const currency = calculationResult?.value_currency || region;
    return (
      <List
        subheader={
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              my: 2,
            }}
          >
            {type === "airline" ? <FlightIcon /> : <HotelIcon />}
            {type === "airline" ? "Airlines" : "Hotels"} ({partners.length})
          </Typography>
        }
      >
        {partners.map((partner) => {
          // --- LOGO LOGIC ---
          let logoId = null;
          if (type === "airline" && partner.iata) {
            logoId = logos.airline[partner.iata];
          } else if (type === "hotel" && partner.brand_name) {
            // Try to find a match by checking if the brand_name includes a key
            const hotelKey = Object.keys(logos.hotel).find((key) =>
              partner.brand_name.toLowerCase().includes(key)
            );
            if (hotelKey) {
              logoId = logos.hotel[hotelKey];
            }
          }
          // --- END LOGO LOGIC ---

          return (
            <Paper
              key={partner.partner_name}
              elevation={2}
              sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}
            >
              <ListItem
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  p: 2,
                  alignItems: "center",
                }}
              >
                <ListItemIcon sx={{ minWidth: 50, mr: { xs: 0, sm: 1 } }}>
                  {isLoadingLogos ? (
                    <CircularProgress size={24} />
                  ) : logoId ? (
                    <Image
                      src={buildCloudflareImageUrl(logoId, "public")}
                      alt={`${partner.brand_name} logo`}
                      width={40}
                      height={40}
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {type === "airline" ? (
                        <FlightIcon color="action" />
                      ) : (
                        <HotelIcon color="action" />
                      )}
                    </Box>
                  )}
                </ListItemIcon>

                <Box sx={{ flex: "1 1 200px" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {partner.brand_name} ({partner.partner_name})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {partner.partner_points_received.toLocaleString()} points
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 150px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Est. Value:{" "}
                    <Typography component="span" fontWeight="bold">
                      {getCurrencySymbol(currency)}
                      {partner.estimated_value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Value/Point:{" "}
                    <Typography component="span" fontWeight="bold">
                      {getCurrencySymbol(currency)}
                      {partner.value_per_point.toFixed(2)}
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: "1 1 150px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {partner.transfer_time_display}
                  </Typography>
                </Box>
              </ListItem>
            </Paper>
          );
        })}
      </List>
    );
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <title>Points Transfer Calculator - CCReward</title>
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
        {/* --- MODIFICATION START --- */}
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
            maxWidth="md"
            sx={{ mt: 4, mb: 4, flexGrow: 1 }}
          >
          {/* --- MODIFICATION END --- */}
            <Stack spacing={4}>
            <PageHeader
                title="Transfer Partner Calculator"
                subtitle="Calculate point transfers to airline and hotel partners."
            />

            <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
              {user && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <UsageRemainingBadge remaining={remaining} limit={limit} />
                </Box>
              )}
              <Stack spacing={3}>
                <Autocomplete
                  fullWidth
                  options={banks}
                  getOptionLabel={(option) => option}
                  value={selectedBank || null}
                  onChange={handleBankChange}
                  loading={isLoadingBanks}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select a bank"
                      required
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingBanks && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Autocomplete
                  fullWidth
                  options={cards}
                  getOptionLabel={(option) => option}
                  value={selectedCard || null}
                  onChange={handleCardChange}
                  disabled={!selectedBank || isLoadingCards}
                  loading={isLoadingCards}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select a card"
                      required
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingCards && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <TextField
                  fullWidth
                  label="Points to Transfer"
                  type="number"
                  value={points}
                  onChange={handlePointsChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Pts</InputAdornment>
                    ),
                    endAdornment: points && (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="clear points"
                          onClick={() => setPoints("")}
                          edge="end"
                          size="small"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: 1,
                      step: 1,
                    },
                  }}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleCalculate}
                    disabled={
                      isCalculating || !isAuthenticated() || !isInitialized
                    }
                    sx={{ flex: 1, height: 48 }}
                  >
                    {isCalculating ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Calculate Transfers"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedBank("");
                      setSelectedCard("");
                      setPoints("");
                      setCards([]);
                      setCalculationResult(null);
                    }}
                    sx={{ flex: 1, height: 48 }}
                  >
                    Clear
                  </Button>
                </Stack>
                {!isAuthenticated() && (
                  <Alert severity="warning">
                    Please sign in to calculate transfer partners.
                  </Alert>
                )}
              </Stack>
            </Paper>

            {logosError && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Could not load all partner logos.
              </Alert>
            )}

            {calculationResult && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Transfer Partners for{" "}
                  {calculationResult.points_available.toLocaleString()}{" "}
                  {calculationResult.card_currency}
                </Typography>

                <AnimatePresence>
                  {calculationResult.airlines?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {renderPartnerList(calculationResult.airlines, "airline")}
                    </motion.div>
                  )}
                  {calculationResult.hotels?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {renderPartnerList(calculationResult.hotels, "hotel")}
                    </motion.div>
                  )}
                </AnimatePresence>

                {calculationResult.total_partners === 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No transfer partners found for this card.
                  </Alert>
                )}
              </Box>
            )}
          </Stack>
           {/* Add the TransferPartnerGrid here */}
          <Box sx={{ mt: 8 }}>
            <TransferPartnerGrid />
          </Box>
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
};

export default TransferCalculator;
