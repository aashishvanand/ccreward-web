"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
  IconButton,
  Fade,
  Collapse,
  useTheme,
  alpha,
} from "@mui/material";

// Icons
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import TrainIcon from "@mui/icons-material/Train";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";

import { useAuth } from "@/core/providers/AuthContext";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import { fetchCardDetails, fetchCardGoals } from "@/core/services/api";
import { getFirebaseAuth } from "@/firebase";
import TiltCard from "@/shared/components/ui/TiltCard";
import Footer from "@/shared/components/layout/Footer";
import Header from "@/shared/components/layout/Header";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatCurrency = (amount, country) => {
  if (amount === "NA" || amount === undefined || amount === null) return "N/A";
  if (amount === 0) return "FREE";
  return new Intl.NumberFormat(country === "in" ? "en-IN" : "en-SG", {
    style: "currency",
    currency: country === "in" ? "INR" : "SGD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const isAccessAvailable = (access) => {
  return (
    access &&
    access !== "NA" &&
    access !== 0 &&
    access !== "0" &&
    access !== "Not Available"
  );
};

const renderAccessValue = (access) => {
  if (!access || access === "NA") return { value: "N/A", isAvailable: false };

  const UNLIMITED = "Unlimited";

  if (access === 999 || access === "999") {
    return { value: UNLIMITED, isAvailable: true };
  }

  if (typeof access === "string") {
    return { value: access, isAvailable: true };
  }

  const periods = [
    { key: "daily", label: "/day" },
    { key: "weekly", label: "/week" },
    { key: "monthly", label: "/month" },
    { key: "quarterly", label: "/quarter" },
    { key: "halfYearly", label: "/6 months" },
    { key: "annual", label: "/year" },
    { key: "transaction", label: "/transaction" },
  ];

  const found = periods.find(
    (p) => access[p.key] !== undefined && access[p.key] !== "NA"
  );
  if (found) {
    let val = access[found.key];
    if (val === 999 || val === "999") val = UNLIMITED;
    return { value: `${val}${found.label}`, isAvailable: true };
  }

  return { value: "Check details", isAvailable: true };
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

// Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle, color = "primary" }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette[color].main, 0.1),
          color: `${color}.main`,
        }}
      >
        <Icon sx={{ fontSize: 26 }} />
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Stat Card Component
const StatCard = ({
  label,
  value,
  icon: Icon,
  color = "primary",
  tooltip,
  variant = "filled",
}) => {
  const theme = useTheme();
  const isFilled = variant === "filled";

  const content = (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: isFilled
          ? alpha(theme.palette[color].main, 0.08)
          : "background.paper",
        border: isFilled ? "none" : "1px solid",
        borderColor: "divider",
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.15)}`,
        },
      }}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: 28,
            color: `${color}.main`,
            mb: 1,
            mx: "auto",
            opacity: 0.8,
          }}
        />
      )}
      <Typography
        variant="caption"
        sx={{
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: "0.5px",
          color: "text.secondary",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: `${color}.main`,
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        {content}
      </Tooltip>
    );
  }

  return content;
};

// Access Badge Component
const AccessBadge = ({ value, isAvailable, size = "medium" }) => {
  const theme = useTheme();

  if (!isAvailable) {
    return (
      <Chip
        icon={<CancelIcon />}
        label="Not Available"
        size={size}
        sx={{
          bgcolor: alpha(theme.palette.grey[500], 0.1),
          color: "text.secondary",
          fontWeight: 500,
          "& .MuiChip-icon": {
            color: "text.disabled",
          },
        }}
      />
    );
  }

  const isUnlimited = value === "Unlimited";

  return (
    <Chip
      icon={isUnlimited ? <StarIcon /> : <CheckCircleIcon />}
      label={value}
      size={size}
      sx={{
        bgcolor: isUnlimited
          ? alpha(theme.palette.warning.main, 0.15)
          : alpha(theme.palette.success.main, 0.1),
        color: isUnlimited ? "warning.dark" : "success.dark",
        fontWeight: 600,
        fontSize: size === "large" ? "1rem" : "0.875rem",
        py: size === "large" ? 2.5 : 1,
        "& .MuiChip-icon": {
          color: isUnlimited ? "warning.main" : "success.main",
        },
      }}
    />
  );
};

// Perk Item Component
const PerkItem = ({ icon: Icon, label, access, color = "primary" }) => {
  const theme = useTheme();
  const { value, isAvailable } = renderAccessValue(access);

  if (!isAccessAvailable(access)) return null;

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: `${color}.main`,
          bgcolor: alpha(theme.palette[color].main, 0.02),
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette[color].main, 0.1),
          color: `${color}.main`,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

// Milestone Card Component
const MilestoneCard = ({ goal, index, country }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const progressColors = [
    "primary",
    "secondary",
    "success",
    "warning",
    "info",
  ];
  const color = progressColors[index % progressColors.length];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: `${color}.main`,
          boxShadow: `0 4px 20px ${alpha(theme.palette[color].main, 0.12)}`,
        },
      }}
    >
      {/* Milestone Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: `${color}.main`,
            fontWeight: 700,
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, lineHeight: 1.3 }}
          >
            {goal.name || `Milestone ${index + 1}`}
          </Typography>
          {goal.spendsNeeded && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Spend{" "}
              <Box component="span" sx={{ fontWeight: 600, color: `${color}.main` }}>
                {formatCurrency(goal.spendsNeeded, country)}
              </Box>{" "}
              {goal.period && `in ${goal.period}`}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Reward Info */}
      {goal.reward && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette[color].main, 0.06),
            mb: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: "text.secondary",
            }}
          >
            Reward
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: `${color}.main` }}
          >
            {goal.reward}
          </Typography>
        </Box>
      )}

      {/* Excluded Categories (if any) */}
      {goal.excludedCategories && goal.excludedCategories.length > 0 && (
        <>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              p: 0,
              minWidth: 0,
              "&:hover": { bgcolor: "transparent", color: "text.primary" },
            }}
          >
            {expanded ? "Hide" : "Show"} excluded categories
          </Button>
          <Collapse in={expanded}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1.5 }}>
              {goal.excludedCategories.map((cat, i) => (
                <Chip
                  key={i}
                  label={cat}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.75rem",
                    height: 24,
                    borderColor: "divider",
                    color: "text.secondary",
                  }}
                />
              ))}
            </Box>
          </Collapse>
        </>
      )}
    </Paper>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CardPage = ({ bankName, cardName, country }) => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch card images
  const { cardImagesData } = useCardImagesData();

  // Card image handling - Using hook logic
  const cardDetails = useMemo(() => {
    return cardImagesData?.find(
      (item) =>
        item.bank.toLowerCase() === bankName.toLowerCase() &&
        item.cardName.toLowerCase() === cardName.toLowerCase()
    );
  }, [cardImagesData, bankName, cardName]);

  const cardImage = cardDetails?.id;
  const orientation = cardDetails?.orientation || "horizontal";

  const ambientColor = useMemo(() => {
    return data?.ambientColor || theme.palette.primary.main;
  }, [data, theme]);

  // Data fetching
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      setOpenDialog(true);
      return;
    }

    const fetchData = async () => {
      try {
        const detailsData = await fetchCardDetails(bankName, cardName, country);

        if (!detailsData) {
          // If null returned, it might be 404 or error. 
          // fetchCardDetails returns null on error in some cases or throws. 
          // Our implementation in api.js throws on 404/500 usually via handleApiError 
          // but returns null if region not init.
          // However, fetchWithCache might handle some errors.
          // Let's assume if it returns data it's good.
          // If api.js throws, it will go to catch.
          // If it returns null/undefined without throwing (e.g. region not init), we might want to handle it.
          // But here since we have a region (country is passed), it should work.
           
           // If we modify api.js to throw on 404, we catch it here.
           // api.js uses handleApiError which throws.
        }
        
        // fetchCardDetails returns the data directly.
        setData(detailsData);

        // Fetch Goals
        const goalsData = await fetchCardGoals(bankName, cardName, country);
        if (goalsData) {
           setGoals(goalsData);
        }

      } catch (err) {
        console.error(err);
        // Check for 404 equivalent. api.js throws error with response.
        if (err.response && err.response.status === 404) {
             router.replace("/404");
             return;
        }
        setError(err.message || "Failed to fetch card details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, bankName, cardName, country, router]);

  const handleSignIn = async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await getFirebaseAuth();
      await signInWithPopup(auth, googleProvider);
      setOpenDialog(false);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  // Computed values for lounge access
  const domesticLounge = useMemo(
    () => renderAccessValue(data?.airportLoungeAccess?.domestic),
    [data]
  );
  const internationalLounge = useMemo(
    () => renderAccessValue(data?.airportLoungeAccess?.international),
    [data]
  );

  // Check if there are any travel perks
  const hasOtherPerks = useMemo(() => {
    return (
      isAccessAvailable(data?.railwayLoungeAccess) ||
      isAccessAvailable(data?.golfAccess) ||
      isAccessAvailable(data?.limoAccess)
    );
  }, [data]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 12,
              gap: 2,
            }}
          >
            <CircularProgress size={48} thickness={4} />
            <Typography color="text.secondary">
              Loading card details...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{ borderRadius: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => router.back()}>
                Go Back
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Sign In Required */}
        {!loading && !user && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CreditCardIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Sign In Required
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
              Please sign in to view detailed card benefits and features.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenDialog(true)}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Sign In to Continue
            </Button>
          </Paper>
        )}

        {/* Main Content */}
        {data && (
          <Fade in={!loading} timeout={400}>
            <Box>
              {/* ============================================================ */}
              {/* HERO SECTION */}
              {/* ============================================================ */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  mb: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha(ambientColor, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                  border: "1px solid",
                  borderColor: "divider",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background Glow */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    background: `radial-gradient(circle, ${alpha(ambientColor, 0.15)} 0%, transparent 70%)`,
                    filter: "blur(60px)",
                    pointerEvents: "none",
                  }}
                />

                <Grid container spacing={4} alignItems="center">
                  {/* Card Image */}
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {cardImage ? (
                        <TiltCard
                          src={cardImage}
                          alt={`${bankName} ${cardName}`}
                          height={orientation === "vertical" ? 320 : 220}
                          orientation={orientation}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 220,
                            width: 350,
                            bgcolor: alpha(theme.palette.divider, 0.3),
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CreditCardIcon
                            sx={{ fontSize: 64, color: "text.disabled" }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Card Info */}
                  <Grid item xs={12} md={7}>
                    <Box>
                      <Chip
                        label={bankName}
                        size="small"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          bgcolor: alpha(ambientColor, 0.1),
                          color: ambientColor,
                        }}
                      />
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: 800,
                          mb: 3,
                          fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
                          lineHeight: 1.2,
                        }}
                      >
                        {cardName}
                      </Typography>

                      {/* Fee Cards */}
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                          <StatCard
                            label="Joining Fee"
                            value={formatCurrency(data.joiningFees, country)}
                            color="primary"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <StatCard
                            label="Annual Fee"
                            value={formatCurrency(data.annualFees, country)}
                            color="secondary"
                          />
                        </Grid>
                        {data.incomeRequirement && data.incomeRequirement !== "NA" && (
                          <Grid item xs={12} sm={4}>
                            <StatCard
                              label="Min. Income"
                              value={formatCurrency(data.incomeRequirement, country)}
                              icon={WorkOutlineIcon}
                              color="info"
                              variant="outlined"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* ============================================================ */}
              {/* LOUNGE ACCESS SECTION */}
              {/* ============================================================ */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  mb: 4,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <SectionHeader
                  icon={FlightTakeoffIcon}
                  title="Airport Lounge Access"
                  subtitle="Complimentary lounge visits included with this card"
                  color="primary"
                />

                <Grid container spacing={3}>
                  {/* Domestic */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        border: "1px solid",
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                        textAlign: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                          color: "text.secondary",
                        }}
                      >
                        <HomeIcon sx={{ fontSize: 20 }} />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}
                        >
                          Domestic
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <AccessBadge
                          value={domesticLounge.value}
                          isAvailable={domesticLounge.isAvailable}
                          size="large"
                        />
                      </Box>
                    </Box>
                  </Grid>

                  {/* International */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.secondary.main, 0.04),
                        border: "1px solid",
                        borderColor: alpha(theme.palette.secondary.main, 0.1),
                        textAlign: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                          color: "text.secondary",
                        }}
                      >
                        <PublicIcon sx={{ fontSize: 20 }} />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}
                        >
                          International
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <AccessBadge
                          value={internationalLounge.value}
                          isAvailable={internationalLounge.isAvailable}
                          size="large"
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* ============================================================ */}
              {/* OTHER TRAVEL PERKS */}
              {/* ============================================================ */}
              {hasOtherPerks && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <SectionHeader
                    icon={TrendingUpIcon}
                    title="Additional Perks"
                    subtitle="Extra benefits included with your card"
                    color="success"
                  />

                  <Grid container spacing={2}>
                    {isAccessAvailable(data.railwayLoungeAccess) && (
                      <Grid item xs={12} sm={6} md={4}>
                        <PerkItem
                          icon={TrainIcon}
                          label="Railway Lounge"
                          access={data.railwayLoungeAccess}
                          color="info"
                        />
                      </Grid>
                    )}
                    {isAccessAvailable(data.golfAccess) && (
                      <Grid item xs={12} sm={6} md={4}>
                        <PerkItem
                          icon={GolfCourseIcon}
                          label="Golf Access"
                          access={data.golfAccess}
                          color="success"
                        />
                      </Grid>
                    )}
                    {isAccessAvailable(data.limoAccess) && (
                      <Grid item xs={12} sm={6} md={4}>
                        <PerkItem
                          icon={LocalTaxiIcon}
                          label="Limo/Chauffeur Service"
                          access={data.limoAccess}
                          color="warning"
                        />
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              )}

              {/* ============================================================ */}
              {/* MILESTONES / GOALS */}
              {/* ============================================================ */}
              {goals && goals.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <SectionHeader
                    icon={EmojiEventsIcon}
                    title="Milestone Rewards"
                    subtitle={`${goals.length} milestone${goals.length > 1 ? "s" : ""} to unlock rewards`}
                    color="warning"
                  />

                  <Grid container spacing={3}>
                    {goals.map((goal, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <MilestoneCard
                          goal={goal}
                          index={index}
                          country={country}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* ============================================================ */}
              {/* EXCLUDED CATEGORIES */}
              {/* ============================================================ */}
              {data.excludedCategories && data.excludedCategories.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: alpha(theme.palette.error.main, 0.02),
                  }}
                >
                  <SectionHeader
                    icon={BlockIcon}
                    title="Excluded Categories"
                    subtitle="These categories may not earn rewards or have reduced benefits"
                    color="error"
                  />

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {data.excludedCategories.map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                          color: "error.dark",
                          fontWeight: 500,
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.error.main, 0.12),
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>
          </Fade>
        )}
      </Container>

      {/* Sign In Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          if (user) setOpenDialog(false);
        }}
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 400 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center", pt: 4 }}>
          Sign In Required
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <CreditCardIcon
            sx={{ fontSize: 64, color: "primary.main", mb: 2, opacity: 0.8 }}
          />
          <Typography color="text.secondary">
            Sign in to view detailed card benefits, fees, and exclusive features.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, flexDirection: "column", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSignIn}
            sx={{ borderRadius: 2 }}
          >
            Sign In with Google
          </Button>
          <Button
            fullWidth
            onClick={() => router.push("/")}
            sx={{ color: "text.secondary" }}
          >
            Go Back Home
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default CardPage;
