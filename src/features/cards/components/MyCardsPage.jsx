"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  useTheme,
  useScrollTrigger,
  Button,
} from "@mui/material";
import { Add as AddIcon, CreditCard as CreditCardIcon } from "@mui/icons-material";
import { useAuth } from "@/core/providers/AuthContext";
import {
  getCardsForUser,
  addCardForUser,
  deleteCardForUser,
  updateCardForUser,
} from "@/core/services/firebaseUtils";
import {
  addUserCard,
  updateUserCard,
  deleteUserCard,
} from "@/core/services/api";
import { notifyCardUpdate } from "@/core/utils/events";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import PageHeader from "@/shared/components/layout/PageHeader";
import CardList from "./CardList";
import AddCardDialog from "./AddCardDialog";
import { Share as ShareIcon } from "@mui/icons-material";
import PortfolioShare from "./PortfolioShare";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import ShareDialog from "./ShareDialog";
import { useRegion } from "@/core/providers/RegionContext";
import { motion } from "framer-motion";
import {
  useAnalytics,
  usePagePerformance,
  useEngagementTracking,
  useJourneyTracking,
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

function MyCardsPage() {
  const { region } = useRegion();
  const theme = useTheme();
  const {
    trackButtonClick,
    trackFeatureUsage,
    trackConversion,
    trackEvent,
    trackError,
  } = useAnalytics();
  const { recordCustomMetric } = usePagePerformance("my-cards");
  const { trackCustomEngagement } = useEngagementTracking();
  const { trackJourneyStep, trackJourneyCompletion } = useJourneyTracking();
  const { trackComponentError, trackComponentInteraction } =
    useComponentAnalytics("MyCardsPage");
  const [cards, setCards] = useState([]);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isLoading, setIsLoading] = useState(true);
  const portfolioRef = useRef(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const regionRef = useRef(region);
  const { user, isAuthenticated, loading, isNewUser, markUserAsNotNew } =
    useAuth();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  useEffect(() => {
    trackFeatureUsage("my_cards_page_loaded", {
      region,
      user_authenticated: isAuthenticated(),
      user_id: user?.uid || "anonymous",
      is_new_user: isNewUser,
    });
    trackJourneyStep("my_cards_accessed", {
      source: "direct_navigation",
      user_type: "authenticated",
    });
    recordCustomMetric("page_load_time", performance.now());
  }, []);

  const fetchUserCards = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const startTime = performance.now();
    trackEvent("cards_fetch_started", {
      user_id: user.uid,
      region,
    });

    try {
      setIsLoading(true);
      const currentRegion = localStorage.getItem("app-region");
      localStorage.removeItem(`userCardsCache_${user.uid}`);
      localStorage.removeItem(`userCardsCacheTimestamp_${user.uid}`);
      const fetchedCards = await getCardsForUser(user.uid);
      const fetchDuration = performance.now() - startTime;
      setCards(fetchedCards);
      regionRef.current = currentRegion;
      trackEvent("cards_fetch_success", {
        user_id: user.uid,
        region: currentRegion,
        cards_count: fetchedCards.length,
        fetch_duration: Math.round(fetchDuration),
        cache_cleared: true,
      });
      recordCustomMetric("cards_fetch_duration", Math.round(fetchDuration));
      recordCustomMetric("user_cards_count", fetchedCards.length);

      if (fetchedCards.length > 0) {
        const bankDiversity = new Set(fetchedCards.map((card) => card.bank))
          .size;
        const hasNetworkInfo = fetchedCards.filter(
          (card) => card.network
        ).length;

        trackEvent("portfolio_insights", {
          total_cards: fetchedCards.length,
          unique_banks: bankDiversity,
          cards_with_network: hasNetworkInfo,
          diversity_score: bankDiversity / fetchedCards.length,
          region: currentRegion,
        });
      }
    } catch (error) {
      const fetchDuration = performance.now() - startTime;
      trackComponentError("cards_fetch_failed", {
        error_message: error.message,
        fetch_duration: Math.round(fetchDuration),
        user_id: user.uid,
        region,
      });
      console.error("❌ Error fetching cards:", error);
      showAlert("Error fetching cards. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [user, region, trackEvent, trackComponentError, recordCustomMetric]);

  useEffect(() => {
    if (region !== regionRef.current && isAuthenticated()) {
      trackEvent("region_changed_cards_page", {
        old_region: regionRef.current,
        new_region: region,
        cards_count: cards.length,
      });
      trackJourneyStep("region_switch_cards_refresh", {
        from_region: regionRef.current,
        to_region: region,
      });
      fetchUserCards();
    }
  }, [
    region,
    isAuthenticated,
    fetchUserCards,
    cards.length,
    trackEvent,
    trackJourneyStep,
  ]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserCards();
    }
  }, [isAuthenticated, fetchUserCards]);

  useEffect(() => {
    const handleRegionChanged = (event) => {
      const newRegion = event.detail?.region;
      trackEvent("region_event_received", {
        new_region: newRegion,
        current_region: regionRef.current,
        cards_count: cards.length,
      });
      if (newRegion && newRegion !== regionRef.current && isAuthenticated()) {
        fetchUserCards();
      }
    };
    window.addEventListener("region-changed", handleRegionChanged);
    return () => {
      window.removeEventListener("region-changed", handleRegionChanged);
    };
  }, [isAuthenticated, fetchUserCards, cards.length, trackEvent]);

  const handleShare = async (platform) => {
    trackButtonClick("portfolio_share_attempt", {
      platform,
      cards_count: cards.length,
      share_method: platform === "generate" ? "preview" : platform,
    });
    trackJourneyStep("portfolio_share_initiated", {
      platform,
      portfolio_size: cards.length,
    });
    setIsGeneratingImage(true);
    const startTime = performance.now();
    try {
      if (platform === "generate") {
        await portfolioRef.current?.generateAndShare("preview");
      } else {
        await portfolioRef.current?.generateAndShare(platform);
        trackConversion("portfolio_shared", 1);
        trackJourneyCompletion("portfolio_share_success", {
          platform,
          cards_count: cards.length,
        });
      }
      const shareTime = performance.now() - startTime;
      recordCustomMetric("portfolio_share_time", Math.round(shareTime));
      trackEvent("portfolio_share_success", {
        platform,
        cards_count: cards.length,
        generation_time: Math.round(shareTime),
      });
    } catch (error) {
      const shareTime = performance.now() - startTime;
      trackComponentError("portfolio_share_failed", {
        platform,
        error_message: error.message,
        generation_time: Math.round(shareTime),
        cards_count: cards.length,
      });
      console.error("Error handling share action:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUpdateCard = async (updatedCard) => {
  trackButtonClick("card_update_attempt", {
    card_bank: updatedCard.bank,
    card_name: updatedCard.cardName,
    has_network: !!updatedCard.network,
    // REMOVE: has_limit: !!updatedCard.limit,
  });
  trackJourneyStep("card_update_initiated", {
    card_bank: updatedCard.bank,
    update_type: "details",
  });
  try {
    // Write to Firestore and CF API in parallel; Firestore is source of truth
    const country = updatedCard.country || localStorage.getItem('app-region')?.toLowerCase() || 'in';
    const apiPayload = {
      bank: updatedCard.bank,
      cardName: updatedCard.cardName,
      country,
      ...(updatedCard.network !== undefined && { network: updatedCard.network }),
      ...(updatedCard.lastFourDigits !== undefined && { lastFourDigits: updatedCard.lastFourDigits }),
      ...(updatedCard.billingDate !== undefined && { billingDate: updatedCard.billingDate }),
      ...(updatedCard.limit !== undefined && { limit: updatedCard.limit }),
      ...(updatedCard.since !== undefined && { since: updatedCard.since }),
    };
    const [firestoreResult] = await Promise.allSettled([
      updateCardForUser(user.uid, updatedCard),
      updateUserCard(apiPayload).catch((err) => {
        console.warn('CF API updateUserCard failed (non-critical):', err);
      }),
    ]);
    if (firestoreResult.status === 'rejected') {
      throw firestoreResult.reason;
    }
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    );
    notifyCardUpdate();
    trackEvent("card_update_success", {
      user_id: user.uid,
      card_bank: updatedCard.bank,
      card_name: updatedCard.cardName,
      updated_fields: Object.keys(updatedCard).filter(
        (key) => !["id", "bank", "cardName"].includes(key)
      ),
    });
    trackJourneyCompletion("card_update_success", {
      card_bank: updatedCard.bank,
    });
    showAlert("Card updated successfully", "success");
  } catch (error) {
    trackComponentError("card_update_failed", {
      card_bank: updatedCard.bank,
      error_message: error.message,
      user_id: user.uid,
    });
    console.error("Error updating card:", error);
    showAlert("Error updating card. Please try again later.", "error");
  }
};

  const handleAddCard = async (newCard) => {
  trackButtonClick("add_card_attempt", {
    card_bank: newCard.bank,
    card_name: newCard.cardName,
    user_cards_count: cards.length,
    // CHANGE: Remove limit and billingDate references, only check for network
    has_additional_details: !!(newCard.network),
  });
  
  trackJourneyStep("add_card_initiated", {
    card_bank: newCard.bank,
    card_name: newCard.cardName,
    current_portfolio_size: cards.length,
  });
  
  try {
    const existingCards = await getCardsForUser(user.uid);
    const isDuplicate = existingCards.some(
      (card) =>
        card.bank === newCard.bank && card.cardName === newCard.cardName
    );
    if (isDuplicate) {
      trackEvent("add_card_duplicate_prevented", {
        card_bank: newCard.bank,
        card_name: newCard.cardName,
        user_id: user.uid,
      });
      showAlert("This card is already in your collection.", "info");
      return;
    }
    // Write to Firestore and CF API in parallel; Firestore is source of truth
    const country = localStorage.getItem('app-region')?.toLowerCase() || 'in';
    const apiPayload = {
      bank: newCard.bank,
      cardName: newCard.cardName,
      country,
      ...(newCard.network && { network: newCard.network }),
      ...(newCard.billingDate && { billingDate: newCard.billingDate }),
      ...(newCard.limit && { limit: newCard.limit }),
      ...(newCard.since && { since: newCard.since }),
      addedAt: new Date().toISOString(),
    };
    const [firestoreResult] = await Promise.allSettled([
      addCardForUser(user.uid, newCard),
      addUserCard(apiPayload).catch((err) => {
        console.warn('CF API addUserCard failed (non-critical):', err);
      }),
    ]);
    // If Firestore write failed, surface the error
    if (firestoreResult.status === 'rejected') {
      throw firestoreResult.reason;
    }
    await fetchUserCards();
    notifyCardUpdate();
    trackConversion("card_added", 1);
    trackJourneyCompletion("add_card_success", {
      card_bank: newCard.bank,
      card_name: newCard.cardName,
      new_portfolio_size: cards.length + 1,
    });
    trackEvent("card_add_success", {
      user_id: user.uid,
      card_bank: newCard.bank,
      card_name: newCard.cardName,
      new_total_cards: cards.length + 1,
      card_network: newCard.network,
      // CHANGE: Remove limit reference, only check for network
      has_custom_details: !!(newCard.network),
      region,
    });
    recordCustomMetric("user_portfolio_growth", cards.length + 1);
    const newCount = cards.length + 1;
    if ([1, 2, 5, 10, 15, 20].includes(newCount)) {
      trackEvent("portfolio_milestone_reached", {
        milestone: newCount,
        user_id: user.uid,
        card_added: `${newCard.bank} ${newCard.cardName}`,
      });
    }
    showAlert("Card added successfully", "success");
    if (isNewUser) {
      trackEvent("first_card_added_new_user", {
        user_id: user.uid,
        card_bank: newCard.bank,
        time_to_first_card:
          Date.now() -
          (user.metadata?.creationTime
            ? new Date(user.metadata.creationTime).getTime()
            : Date.now()),
      });
      markUserAsNotNew();
    }
  } catch (error) {
    trackComponentError("add_card_failed", {
      card_bank: newCard.bank,
      card_name: newCard.cardName,
      error_message: error.message,
      user_id: user.uid,
    });
    console.error("Error adding card:", error);
    showAlert("Failed to add card. Please try again.", "error");
  }
};

  const handleDeleteCard = async (bank, cardName) => {
    trackButtonClick("delete_card_attempt", {
      card_bank: bank,
      card_name: cardName,
      current_cards_count: cards.length,
    });
    trackJourneyStep("card_deletion_initiated", {
      card_bank: bank,
      card_name: cardName,
      portfolio_size_before: cards.length,
    });
    try {
      const cardKey = `${bank}_${cardName}`;
      const country = localStorage.getItem('app-region')?.toLowerCase() || 'in';
      // Write to Firestore and CF API in parallel; Firestore is source of truth
      const [firestoreResult] = await Promise.allSettled([
        deleteCardForUser(user.uid, cardKey),
        deleteUserCard({ bank, cardName, country }).catch((err) => {
          console.warn('CF API deleteUserCard failed (non-critical):', err);
        }),
      ]);
      if (firestoreResult.status === 'rejected') {
        throw firestoreResult.reason;
      }
      setCards((prevCards) =>
        prevCards.filter(
          (card) => card.bank !== bank || card.cardName !== cardName
        )
      );
      notifyCardUpdate();
      trackEvent("card_delete_success", {
        user_id: user.uid,
        card_bank: bank,
        card_name: cardName,
        remaining_cards: cards.length - 1,
        region,
      });
      trackJourneyCompletion("card_deletion_success", {
        card_bank: bank,
        new_portfolio_size: cards.length - 1,
      });
      recordCustomMetric("user_portfolio_size", cards.length - 1);
      if (cards.length === 1) {
        trackEvent("portfolio_emptied", {
          user_id: user.uid,
          last_card_removed: `${bank} ${cardName}`,
        });
      }
      showAlert("Card deleted successfully", "success");
    } catch (error) {
      trackComponentError("card_delete_failed", {
        card_bank: bank,
        card_name: cardName,
        error_message: error.message,
        user_id: user.uid,
      });
      console.error("Error deleting card:", error);
      showAlert("Error deleting card. Please try again later.", "error");
    }
  };

  const handleOpenAddDialog = () => {
    trackButtonClick("add_card_dialog_open", {
      source: "speed_dial",
      current_cards_count: cards.length,
    });
    trackCustomEngagement("add_card_interaction", {
      current_portfolio_size: cards.length,
    });
    setIsAddCardDialogOpen(true);
  };

  const handleOpenShareDialog = () => {
    trackButtonClick("share_dialog_open", {
      source: "speed_dial",
      cards_count: cards.length,
    });
    trackCustomEngagement("share_portfolio_interaction", {
      portfolio_size: cards.length,
    });
    setShareDialogOpen(true);
  };

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
    trackEvent("alert_shown", {
      message_type: severity,
      message_content: message.substring(0, 50),
    });
  };

  const handleCardListInteraction = (interactionType, cardData = {}) => {
    trackComponentInteraction("card_list_interaction", {
      interaction_type: interactionType,
      cards_count: cards.length,
      ...cardData,
    });
  };

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
          cards_count: cards.length,
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cards.length, trackCustomEngagement]);

  useEffect(() => {
  // Only track when cards length is 0 and user is authenticated
  if (cards.length === 0 && user?.uid) {
    trackEvent("empty_portfolio_viewed", {
      user_id: user?.uid,
      is_new_user: isNewUser,
      region,
    });
  }
}, [cards.length, user?.uid, isNewUser, region, trackEvent]);


  const renderContent = () => {
    if (isLoading || loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (cards.length === 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "primary.light",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              opacity: 0.1,
            }}
          >
            <CreditCardIcon sx={{ fontSize: 48, opacity: 1 }} />
          </Box>
          <Typography variant="h5" gutterBottom sx={{
            fontWeight: "bold"
          }}>
            No cards yet
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 400,
              mb: 3
            }}>
            Start building your portfolio by adding your first credit card. 
            We'll help you track rewards and benefits.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Add Your First Card
          </Button>
        </Paper>
      );
    }
    return (
      <>
        {cards.length === 1 && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: theme.palette.info.light,
              color: theme.palette.info.contrastText,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Great start! You've added your first card.
            </Typography>
            <Typography>
              Add one more card to use our &quot;Best Card&quot; feature and
              start comparing rewards!
            </Typography>
          </Paper>
        )}
        {cards.length > 0 && (
          <PortfolioShare ref={portfolioRef} cards={cards} />
        )}
        <CardList
          cards={cards}
          onDeleteCard={handleDeleteCard}
          onUpdateCard={handleUpdateCard}
          onInteraction={handleCardListInteraction}
        />
      </>
    );
  };

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
        <Container
          sx={{
            py: 4,
            flexGrow: 1,
            pb: { xs: 10, sm: 12 },
          }}
          maxWidth="lg"
        >
          <Stack spacing={4}>
            <PageHeader 
                title="My Cards" 
                subtitle="Manage your credit card portfolio and track your benefits." 
            />
            {renderContent()}
          </Stack>
        </Container>
        <SpeedDial
          ariaLabel="Card Actions"
          sx={{
            position: "fixed",
            bottom: { xs: 80, sm: 100 },
            right: { xs: 16, sm: 24 },
          }}
          icon={<SpeedDialIcon openIcon={<AddIcon />} />}
          onOpen={() =>
            trackEvent("speed_dial_opened", { cards_count: cards.length })
          }
          onClose={() =>
            trackEvent("speed_dial_closed", { cards_count: cards.length })
          }
        >
          <SpeedDialAction
            key="add"
            icon={<AddIcon />}
            tooltipTitle="Add New Card"
            onClick={handleOpenAddDialog}
          />
          {cards.length > 0 && (
            <SpeedDialAction
              key="share"
              icon={<ShareIcon />}
              tooltipTitle="Share Collection"
              onClick={handleOpenShareDialog}
            />
          )}
        </SpeedDial>
        <AddCardDialog
          open={isAddCardDialogOpen}
          onClose={() => {
            setIsAddCardDialogOpen(false);
            trackEvent("add_card_dialog_closed", { cards_count: cards.length });
          }}
          onAddCard={handleAddCard}
        />
        <ShareDialog
          open={shareDialogOpen}
          onClose={() => {
            setShareDialogOpen(false);
            trackEvent("share_dialog_closed", { cards_count: cards.length });
          }}
          onShare={handleShare}
          isGenerating={isGeneratingImage}
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
}

export default MyCardsPage;