"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardDetailsModal from "./CardDetailsModal";
import TiltCard from "@/shared/components/ui/TiltCard";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

// Animation variants
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.98 },
};

const deleteButtonVariants = {
  hidden: { opacity: 0, scale: 0 },
  hover: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
};

const emptyStateVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.6,
    },
  },
};

const loadingSpinnerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: [0.8, 1.2, 0.8],
    transition: {
      repeat: Infinity,
      duration: 1.5,
    },
  },
};

// ISO/IEC 7810 ID-1 card ratio, matching TiltCard
const CARD_RATIO = 1.586;
// Caption strip under each card, as a fraction of column width (approximate)
const CAPTION_HEIGHT = 0.28;

// Masonry by explicit columns: each card goes to the currently shortest column,
// using its known aspect ratio. Unlike CSS multi-column layout, a tall vertical
// card can never be split across two columns.
function distributeIntoColumns(cards, cols) {
  const columns = Array.from({ length: cols }, () => ({ height: 0, items: [] }));
  cards.forEach((card, index) => {
    const imageHeight =
      card.orientation === "vertical" ? CARD_RATIO : 1 / CARD_RATIO;
    const target = columns.reduce(
      (min, col) => (col.height < min.height - 1e-6 ? col : min),
      columns[0]
    );
    target.items.push({ card, index });
    target.height += imageHeight + CAPTION_HEIGHT;
  });
  return columns.map((col) => col.items);
}

const CardList = ({ cards = [], onDeleteCard, onUpdateCard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { cardImagesData, isLoading, error } = useCardImagesData();
  const [processedCards, setProcessedCards] = useState([]);
  const cols = isMobile ? 2 : isTablet ? 3 : 4;
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [removingCard, setRemovingCard] = useState(null);

  useEffect(() => {
    if (cards && Array.isArray(cards) && cardImagesData) {
      const processed = cards.map((card) => {
        const cardDetails = cardImagesData?.find(
          (item) =>
            item.bank.toLowerCase() === card.bank.toLowerCase() &&
            item.cardName.toLowerCase() === card.cardName.toLowerCase()
        );
        return {
          ...card,
          image: cardDetails?.id,
          orientation: cardDetails?.orientation || "horizontal",
        };
      });
      setProcessedCards(processed);
    }
  }, [cards, cardImagesData]);

  const columns = useMemo(
    () => distributeIntoColumns(processedCards, cols),
    [processedCards, cols]
  );

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setDetailsModalOpen(true);
  };

  const handleUpdateCard = (updatedCard) => {
    if (onUpdateCard) {
      onUpdateCard(updatedCard);
    }
  };

  const handleDeleteCard = (bank, cardName) => {
    setRemovingCard(`${bank}-${cardName}`);

    // Small delay to allow for animation to complete
    setTimeout(() => {
      onDeleteCard(bank, cardName);
      setRemovingCard(null);
    }, 300);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <m.div
          variants={loadingSpinnerVariants}
          initial="hidden"
          animate="visible"
        >
          <CircularProgress />
        </m.div>
      </Box>
    );
  }

  if (error) {
    return (
      <m.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading card data. Please try again later.
        </Alert>
      </m.div>
    );
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    return (
      <m.div
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
      >
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", fontWeight: "medium" }}
          >
            You haven&apos;t added any cards yet. Click &quot;Add New Card&quot;
            to get started!
          </Typography>

          <m.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.5,
                type: "spring",
                stiffness: 260,
                damping: 20,
              },
            }}
            whileHover={{
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 },
            }}
          >
            <Box
              component="img"
              src={buildCloudflareImageUrl(
                "c68cca10-3860-4546-74e7-06ea7aa8e000",
                "public"
              )}
              alt="ccreward Logo"
              sx={{
                mt: 4,
                width: 100,
                height: 100,
                opacity: 0.7,
              }}
            />
          </m.div>
        </Box>
      </m.div>
    );
  }

  return (
    <>
      <m.div
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          {columns.map((columnItems, colIndex) => (
            <Box
              key={colIndex}
              sx={{
                flex: "1 1 0",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <AnimatePresence>
                {columnItems.map(({ card, index }) => {
                  const cardKey = `${card.bank}-${card.cardName}`;
                  const isRemoving = removingCard === cardKey;

                  return (
                    <m.div
                      key={cardKey}
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate={isRemoving ? "exit" : "visible"}
                      exit="exit"
                      whileHover="hover"
                      whileTap="tap"
                      custom={index} // Pass index for staggered animations
                      transition={{
                        layoutId: cardKey,
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: index * 0.05, // Stagger delay based on index
                      }}
                    >
                      <Box sx={{ width: "100%", borderRadius: 1, overflow: "hidden" }}>
                        <m.div
                          onClick={() => handleCardClick(card)}
                          style={{ cursor: "pointer" }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              overflow: "hidden",
                              position: "relative",
                              bgcolor: "background.paper",
                              boxShadow: 1,
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                marginBottom: 0,
                              }}
                            >
                              {card.image ? (
                                 <m.div
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                    transition: { delay: 0.1 + index * 0.05 },
                                  }}
                                >
                                <TiltCard 
                                    src={card.image}
                                    alt={`${card.bank} ${card.cardName}`}
                                    orientation={card.orientation}
                                    width="100%"
                                    loading={index >= 4 ? "lazy" : undefined}
                                />
                                </m.div>
                              ) : (
                                    <Box sx={{ 
                                        aspectRatio: card.orientation === "vertical" ? "0.63/1" : "1.59/1",
                                        bgcolor: 'grey.200', 
                                        borderRadius: 4, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}>
                                        <Typography variant="caption" sx={{
                                          color: "text.secondary"
                                        }}>No Image</Typography>
                                    </Box>
                              )}
                            </Box>
                            <Box
                              sx={{
                                p: 1.5,
                                borderTop: 1,
                                borderColor: "divider",
                              }}
                            >
                              <Stack spacing={0.5}>
                                <m.div
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                      delay: 0.2 + index * 0.05,
                                      duration: 0.3,
                                    },
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontSize:
                                        card.orientation === "vertical"
                                          ? "0.75rem"
                                          : "0.875rem",
                                      fontWeight: 600,
                                      lineHeight: 1.2,
                                    }}
                                    noWrap
                                  >
                                    {card.cardName}
                                  </Typography>
                                </m.div>
                                <m.div
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                      delay: 0.3 + index * 0.05,
                                      duration: 0.3,
                                    },
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{
                                      color: "text.secondary",

                                      fontSize:
                                        card.orientation === "vertical"
                                          ? "0.7rem"
                                          : "0.75rem",

                                      lineHeight: 1.2,
                                      display: "block"
                                    }}>
                                    {card.bank}
                                  </Typography>
                                </m.div>
                              </Stack>
                            </Box>
                          </Paper>
                        </m.div>
                      </Box>
                    </m.div>
                  );
                })}
              </AnimatePresence>
            </Box>
          ))}
        </Box>
      </m.div>
      <CardDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        card={selectedCard}
        onSave={handleUpdateCard}
        onDelete={onDeleteCard}
      />
    </>
  );
};

export default CardList;
