// src/features/landing/components/LandingPage.jsx - Enhanced with Analytics (FIXED)
// This component manages the main landing page including all sections, 
// analytics tracking, user authentication state, and responsive behavior
import { useState, useEffect, useMemo } from "react";
import { Box, Alert, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/providers/AuthContext";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getCardsForUser } from "@/core/services/firebaseUtils";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import { useRegion } from "@/core/providers/RegionContext";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import HeroSection from "./HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import BankSection from "./sections/BankSection";
import CallToActionSection from "./sections/CallToActionSection";
import AppStoreSection from "./sections/AppStoreSection";
import CustomGPTSection from "./sections/CustomGPTSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import MobileAppPromotion from "./MobileAppPromotion";
import TopCardsSection from "./sections/TopCardsSection";
import { tweets } from "@/shared/constants/testimonials";
import { detectDevice } from "@/core/utils/deviceUtils";
import TopSearchs from "./sections/TopSearchs";
import StatsSection from "./sections/StatsSection";
import GoogleOneTap from "@/shared/components/auth/GoogleOneTap";
// FIXED: Use specific imports instead of export *
import { motion } from "framer-motion";

// Add analytics imports - FIXED
// These hooks provide various tracking capabilities:
// - useAnalytics: Core event tracking functionality
// - usePagePerformance: Performance metrics collection
// - useEngagementTracking: User engagement measurements
// - useJourneyTracking: User journey mapping and completion tracking
import {
  useAnalytics,
  usePagePerformance,
  useEngagementTracking,
  useJourneyTracking,
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

// Main LandingPage component that orchestrates all sections and tracking
const LandingPage = () => {
  const router = useRouter();
  const {
    signInWithGoogle,
    user,
    isAuthenticated,
    loading,
  } = useAuth();
  const theme = useTheme();
  const { region } = useRegion();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  // Analytics hooks
  const {
    trackButtonClick,
    trackFeatureUsage,
    trackConversion,
    trackNavigation,
    trackEvent,
  } = useAnalytics();
  const { recordCustomMetric } = usePagePerformance("landing");
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackJourneyStep, trackJourneyCompletion } = useJourneyTracking();

  const [cardImages, setCardImages] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [hasCheckedCards, setHasCheckedCards] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isAndroid: false,
    isIOS: false,
    isTablet: false,
  });

  // Fetch card images data for the application
  const { cardImagesData } = useCardImagesData();

  const [allTweets, setAllTweets] = useState([]);
  
  // Shuffle tweets on initial load to provide varied testimonials
  useEffect(() => {
    setAllTweets([...tweets].sort(() => Math.random() - 0.5));
  }, []);

  // Calculate number of tweets per page based on screen size
  const tweetsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  // Use allTweets for total pages calculation to avoid mismatch during initial render/shuffle
  const totalPages = Math.ceil((allTweets.length > 0 ? allTweets : tweets).length / tweetsPerPage);

  // Memoize visible tweets to prevent unnecessary re-renders
  const visibleTweets = useMemo(
    () => {
      // Use shuffled tweets if available, otherwise fallback to default order
      const sourceTweets = allTweets.length > 0 ? allTweets : tweets;
      return sourceTweets.slice(
        currentPage * tweetsPerPage,
        (currentPage + 1) * tweetsPerPage
      );
    },
    [currentPage, tweetsPerPage, allTweets]
  );

  // Auto-scroll testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // Scroll every 5 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  // Track landing page visit with analytics
  useEffect(() => {
    trackFeatureUsage("landing_page_visit", {
      region,
      device_type: deviceInfo.isMobile
        ? "mobile"
        : deviceInfo.isTablet
        ? "tablet"
        : "desktop",
      is_authenticated: isAuthenticated(),
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    });

    trackJourneyStep("landing_page_loaded", {
      region,
      device_info: deviceInfo,
    });

    // Track page load performance
    recordCustomMetric("page_load_start", performance.now());
  }, [
    trackFeatureUsage,
    trackJourneyStep,
    recordCustomMetric,
    region,
    deviceInfo,
    isAuthenticated,
  ]);

  // Track device detection and viewport changes for responsive design analytics
  useEffect(() => {
    const initialDeviceInfo = detectDevice();
    setDeviceInfo(initialDeviceInfo);

    trackEvent("device_detected", {
      is_mobile: initialDeviceInfo.isMobile,
      is_android: initialDeviceInfo.isAndroid,
      is_ios: initialDeviceInfo.isIOS,
      is_tablet: initialDeviceInfo.isTablet,
      screen_width: typeof window !== "undefined" ? window.innerWidth : 0,
      screen_height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    const handleResize = () => {
      const updatedDeviceInfo = detectDevice();
      setDeviceInfo(updatedDeviceInfo);

      trackEvent("viewport_changed", {
        new_width: typeof window !== "undefined" ? window.innerWidth : 0,
        new_height: typeof window !== "undefined" ? window.innerHeight : 0,
        device_type: updatedDeviceInfo.isMobile ? "mobile" : "desktop",
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [trackEvent]);

  // Track region and card images loading for performance monitoring
  useEffect(() => {
    if (cardImagesData?.length > 0) {
      trackEvent("card_images_loaded", {
        region,
        total_images: cardImagesData.length,
        loading_time: performance.now(),
      });

      // Filter cards based on region to show relevant ones
      const regionCards = cardImagesData.filter((card) => {
        if (region === "IN") {
          return [
            "HDFC",
            "ICICI",
            "SBI",
            "Axis",
            "AMEX",
            "YESBank",
            "SC",
            "Kotak",
            "IDFCFirst",
            "HSBC",
            "OneCard",
            "RBL",
            "IndusInd",
            "IDBI",
            "Federal",
            "BOB",
            "AU",
          ].includes(card.bank);
        } else if (region === "SG") {
          return [
            "DBS",
            "POSB",
            "UOB",
            "OCBC",
            "Maybank",
            "CIMB",
            "AMEX",
            "Citi",
            "HSBC",
            "SC",
            "BOC",
            "Trust",
          ].includes(card.bank);
        }
        return true;
      });

      const horizontalCards = regionCards.filter(
        (card) => card.orientation === "horizontal"
      );

      // Shuffle the cards and take first 3 for display
      const shuffled = [...horizontalCards].sort(() => Math.random() - 0.5);
      setCardImages(shuffled.slice(0, 3));

      recordCustomMetric("hero_cards_prepared", shuffled.length);
    }
  }, [cardImagesData, region, trackEvent, recordCustomMetric]);

  // Track user card checking flow
  useEffect(() => {
    const authenticated = isAuthenticated();
    if (!loading && authenticated && user?.uid && !hasCheckedCards) {
      trackJourneyStep("checking_user_cards", {
        user_id: user.uid,
        is_new_user:
          user.metadata?.creationTime === user.metadata?.lastSignInTime,
      });

      const checkUserCards = async () => {
        try {
          const fetchedCards = await getCardsForUser(user.uid);

          trackEvent("user_cards_checked", {
            user_id: user.uid,
            cards_count: fetchedCards.length,
            has_cards: fetchedCards.length > 0,
          });

          if (fetchedCards.length === 0) {
            trackJourneyStep("redirecting_to_cards", {
              reason: "no_cards_found",
            });
            trackNavigation("/my-cards", "automatic_redirect");
            router.push("/my-cards");
          } else {
            trackJourneyCompletion("landing_with_cards", {
              cards_count: fetchedCards.length,
            });
          }
        } catch (error) {
          trackEvent("user_cards_check_error", {
            error_message: error.message,
            user_id: user.uid,
          });

          setAlert({
            open: true,
            message: "Error checking your cards. Please try again later.",
            severity: "error",
          });
        } finally {
          setHasCheckedCards(true);
        }
      };
      checkUserCards();
    }
  }, [
    loading,
    isAuthenticated,
    user?.uid,
    router,
    hasCheckedCards,
    trackEvent,
    trackJourneyStep,
    trackJourneyCompletion,
    trackNavigation,
  ]);


  
  // Enhanced sign-in handler with analytics tracking for user actions
  const handleSignIn = async (signInMethod) => {
    const signInMethodName = "google";

    trackButtonClick("sign_in_attempt", {
      method: signInMethodName,
      location: "hero_section",
      device_type: deviceInfo.isMobile ? "mobile" : "desktop",
    });

    trackJourneyStep("sign_in_initiated", {
      method: signInMethodName,
      source: "landing_page",
    });

    setIsLoading(true);
    const startTime = performance.now();

    try {
      await signInMethod();

      const signInDuration = performance.now() - startTime;

      trackConversion("user_sign_in", 1);
      trackJourneyCompletion("sign_in_success", {
        method: signInMethodName,
        duration: Math.round(signInDuration),
      });

      trackEvent("sign_in_success", {
        method: signInMethodName,
        duration: Math.round(signInDuration),
        source: "landing_page",
      });

      recordCustomMetric("sign_in_duration", Math.round(signInDuration));

      setAlert({
        open: true,
        message: "Sign-in successful!",
        severity: "success",
      });
      setHasCheckedCards(false);
    } catch (error) {
      const signInDuration = performance.now() - startTime;

      trackEvent("sign_in_error", {
        method: signInMethodName,
        error_code: error.code,
        error_message: error.message,
        duration: Math.round(signInDuration),
      });

      trackJourneyCompletion("sign_in_failed", {
        method: signInMethodName,
        error: error.code,
        duration: Math.round(signInDuration),
      });

      console.error("Error signing in:", error);

      if (error.code === "auth/popup-closed-by-user") {
        trackEvent("sign_in_cancelled", { method: signInMethodName });
        setAlert({ open: false, message: "", severity: "info" });
      } else if (error.code === "auth/cancelled-popup-request") {
        setAlert({
          open: true,
          message:
            "Another sign-in window is already open. Please close it and try again.",
          severity: "warning",
        });
      } else if (error.code === "auth/popup-blocked") {
        setAlert({
          open: true,
          message:
            "Pop-up was blocked by your browser. Please enable pop-ups and try again.",
          severity: "warning",
        });
      } else {
        setAlert({
          open: true,
          message: "Failed to sign in. Please try again.",
          severity: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };



  // Enhanced testimonial navigation with tracking
  const handleNextPage = () => {
    const newPage = (currentPage + 1) % totalPages;
    setCurrentPage(newPage);

    trackButtonClick("testimonials_next", {
      current_page: currentPage,
      new_page: newPage,
      total_pages: totalPages,
    });

    trackCustomEngagement("testimonials_navigation", {
      direction: "next",
      page: newPage,
    });
  };

  const handlePrevPage = () => {
    const newPage = (currentPage - 1 + totalPages) % totalPages;
    setCurrentPage(newPage);

    trackButtonClick("testimonials_prev", {
      current_page: currentPage,
      new_page: newPage,
      total_pages: totalPages,
    });

    trackCustomEngagement("testimonials_navigation", {
      direction: "prev",
      page: newPage,
    });
  };

  // Track section visibility for user engagement analytics
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute("data-section");
            if (sectionName) {
              trackEvent("section_viewed", {
                section_name: sectionName,
                visibility_ratio: entry.intersectionRatio,
                device_type: deviceInfo.isMobile ? "mobile" : "desktop",
              });

              trackCustomEngagement("section_engagement", {
                section: sectionName,
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all sections for engagement tracking
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [trackEvent, trackCustomEngagement, deviceInfo]);

  const isMobileDevice = Boolean(
    deviceInfo?.isMobile || deviceInfo?.isAndroid || deviceInfo?.isIOS
  );

  const commonProps = {
    visibleTweets,
    handlePrevPage,
    handleNextPage,
    isMobile,
    theme,
    alert,
    setAlert,
    deviceInfo,
    region,
    // Add analytics tracking functions
    trackButtonClick,
    trackFeatureUsage,
    trackEvent,
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <title>Maximize Your Rewards with the Right Credit Card</title>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {!isMobileDevice && <GoogleOneTap />}
        {isMobileDevice ? (
          <MobileView {...commonProps} />
        ) : (
          <DesktopView
            {...commonProps}
            cardImages={cardImages}
            isTablet={isTablet}
            isLargeScreen={isLargeScreen}
            handleSignIn={handleSignIn}
            isLoading={isLoading}
            isAuthenticated={isAuthenticated()}
            loading={loading}
            signInWithGoogle={signInWithGoogle}
          />
        )}
      </Box>
    </motion.div>
  );
};

// Enhanced Mobile View with analytics
const MobileView = ({
  deviceInfo,
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  isMobile,
  theme,
  alert,
  setAlert,
  region,
  trackButtonClick,
  trackFeatureUsage,
  trackEvent,
}) => {
  // Track mobile app promotion interaction
  const handleAppStoreClick = (store) => {
    trackButtonClick(`app_store_${store}`, {
      source: "mobile_promotion",
      device_type: "mobile",
      region,
    });

    trackEvent("app_store_click", { store, source: "mobile_promotion" });
  };

  useEffect(() => {
    trackFeatureUsage("mobile_view_loaded", {
      device_info: deviceInfo,
      region,
    });
  }, [deviceInfo, region, trackFeatureUsage]);

  if (!deviceInfo) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Header hideNavigation={true} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            background: (theme) =>
              theme.palette.mode === "light"
                ? `radial-gradient(circle at 50% 0%, ${theme.palette.primary.light}15 0%, transparent 50%), ${theme.palette.background.default}`
                : `radial-gradient(circle at 50% 0%, ${theme.palette.primary.dark}20 0%, transparent 50%), ${theme.palette.background.default}`,
            backdropFilter: "blur(2px)",
          }}
        >
          <Container maxWidth="lg" sx={{ pt: { xs: 6, sm: 8 }, pb: 4 }}>
            <Typography
              variant="h1"
              align="center"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem" },
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.1,
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                    : `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Get the ccreward App
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
                mb: 4,
                lineHeight: 1.5,
              }}
            >
              Download our app for the best credit card rewards experience.
              Maximize your benefits on the go.
            </Typography>
          </Container>

          <Box component="section" data-section="mobile-promotion">
            <MobileAppPromotion
              isAndroid={Boolean(deviceInfo.isAndroid)}
              onAppStoreClick={handleAppStoreClick}
            />
          </Box>

          <Box component="section" data-section="custom-gpt">
            <CustomGPTSection theme={theme} />
          </Box>

          <Box component="section" data-section="features">
            <FeaturesSection />
          </Box>

          <Box
            component="section"
            data-section="stats"
            sx={{ bgcolor: "background.paper" }}
          >
            <StatsSection />
          </Box>

          <>
            <Box
              component="section"
              data-section="top-cards"
              sx={{ bgcolor: "background.default" }}
            >
              <TopCardsSection />
            </Box>

            <Box
              component="section"
              data-section="trending"
              sx={{ bgcolor: "background.paper" }}
            >
              <TopSearchs />
            </Box>
          </>

          <Box
            component="section"
            data-section="banks"
            sx={{ bgcolor: "background.default" }}
          >
            <BankSection />
          </Box>

          <Box
            component="section"
            data-section="testimonials"
            sx={{ bgcolor: "background.paper" }}
          >
            <TestimonialsSection
              visibleTweets={visibleTweets}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              isMobile={isMobile}
            />
          </Box>
        </Box>
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
    </Box>
  );
};

// Enhanced Desktop View with analytics
const DesktopView = ({
  cardImages,
  isMobile,
  isTablet,
  isLargeScreen,
  handleSignIn,
  isLoading,
  isAuthenticated,
  loading,
  signInWithGoogle,
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  theme,
  alert,
  setAlert,
  region,
  trackButtonClick,
  trackFeatureUsage,
}) => {
  // Enhanced CTA click tracking
  const handleCTAClick = () => {
    trackButtonClick("cta_get_started", {
      location: "call_to_action_section",
      is_authenticated: isAuthenticated,
      device_type: "desktop",
    });

    handleSignIn(signInWithGoogle);
  };

  useEffect(() => {
    trackFeatureUsage("desktop_view_loaded", {
      screen_width: typeof window !== "undefined" ? window.innerWidth : 0,
      screen_height: typeof window !== "undefined" ? window.innerHeight : 0,
      region,
    });
  }, [region, trackFeatureUsage]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Box className="relative z-10">
        <Header />

        <Box component="section" data-section="hero">
          <HeroSection
            cardImages={cardImages}
            isMobile={isMobile}
            isTablet={isTablet}
            isLargeScreen={isLargeScreen}
            handleSignIn={handleSignIn}
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            loading={loading}
            signInWithGoogle={signInWithGoogle}
          />
        </Box>

        <Box
          component="section"
          data-section="features"
          sx={{ bgcolor: "background.default" }}
        >
          <FeaturesSection />
        </Box>

        <Box
          component="section"
          data-section="stats"
          sx={{ bgcolor: "background.paper" }}
        >
          <StatsSection />
        </Box>

        <>
          <Box
            component="section"
            data-section="top-cards"
            sx={{ bgcolor: "background.default" }}
          >
            <TopCardsSection />
          </Box>

          <Box
            component="section"
            data-section="trending"
            sx={{ bgcolor: "background.paper" }}
          >
            <TopSearchs />
          </Box>
        </>

        <Box
          component="section"
          data-section="banks"
          sx={{ bgcolor: "background.default" }}
        >
          <BankSection />
        </Box>

        <Box component="section" data-section="cta">
          <CallToActionSection
            isAuthenticated={isAuthenticated}
            handleSignIn={handleCTAClick}
            signInWithGoogle={signInWithGoogle}
          />
        </Box>

        <Box
          component="section"
          data-section="app-store"
          sx={{ bgcolor: "background.default" }}
        >
          <AppStoreSection isMobile={isMobile} theme={theme} />
        </Box>

        <Box
          component="section"
          data-section="custom-gpt"
          sx={{ bgcolor: "background.default" }}
        >
          <CustomGPTSection theme={theme} />
        </Box>

        <Box
          component="section"
          data-section="testimonials"
          sx={{ bgcolor: "background.paper" }}
        >
          <TestimonialsSection
            visibleTweets={visibleTweets}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            isMobile={isMobile}
          />
        </Box>

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
    </Box>
  );
};

export default LandingPage;
