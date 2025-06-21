import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useCardImagesData from "../../../core/hooks/useCardImagesData";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CardDetailsModal from "./CardDetailsModal";

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
  hover: {
    y: -8,
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
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
        <motion.div
          variants={loadingSpinnerVariants}
          initial="hidden"
          animate="visible"
        >
          <CircularProgress />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert severity="error" sx={{ my: 2 }}>
          Error loading card data. Please try again later.
        </Alert>
      </motion.div>
    );
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    return (
      <motion.div
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

          <motion.div
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
              src="https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/c68cca10-3860-4546-74e7-06ea7aa8e000/public"
              alt="CCReward Logo"
              sx={{
                mt: 4,
                width: 100,
                height: 100,
                opacity: 0.7,
              }}
            />
          </motion.div>
        </Box>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <ImageList
          variant="masonry"
          cols={cols}
          gap={16}
          sx={{
            width: "100%",
            margin: 0,
            "& .MuiImageListItem-root": {
              display: "block",
              overflow: "hidden",
              borderRadius: 1,
              mb: 2,
            },
          }}
        >
          <AnimatePresence>
            {processedCards.map((card, index) => {
              const cardKey = `${card.bank}-${card.cardName}`;
              const isRemoving = removingCard === cardKey;

              return (
                <motion.div
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
                  <ImageListItem sx={{ width: "100%" }}>
                    <motion.div
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
                            aspectRatio:
                              card.orientation === "vertical"
                                ? "0.63/1"
                                : "1.59/1",
                            marginBottom: 0,
                          }}
                        >
                          {card.image && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { delay: 0.1 + index * 0.05 },
                              }}
                            >
                              <Image
                                src={card.image}
                                alt={`${card.bank} ${card.cardName}`}
                                layout="fill"
                                objectFit="contain"
                                priority={index < 4} // Only prioritize first 4 images
                              />
                            </motion.div>
                          )}
                          <motion.div
                            variants={deleteButtonVariants}
                            initial="hidden"
                            whileHover="hover"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card.bank, card.cardName);
                            }}
                          >
                            <Tooltip title="Remove Card">
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  bgcolor: "rgba(0, 0, 0, 0.5)",
                                  "&:hover": {
                                    bgcolor: "rgba(0, 0, 0, 0.7)",
                                  },
                                }}
                                size="small"
                              >
                                <DeleteIcon
                                  sx={{ color: "white", fontSize: "1.25rem" }}
                                />
                              </IconButton>
                            </Tooltip>
                          </motion.div>
                        </Box>
                        <Box
                          sx={{
                            p: 1.5,
                            borderTop: 1,
                            borderColor: "divider",
                          }}
                        >
                          <Stack spacing={0.5}>
                            <motion.div
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
                            </motion.div>
                            <motion.div
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
                                color="text.secondary"
                                sx={{
                                  fontSize:
                                    card.orientation === "vertical"
                                      ? "0.7rem"
                                      : "0.75rem",
                                  lineHeight: 1.2,
                                  display: "block",
                                }}
                                noWrap
                              >
                                {card.bank}
                              </Typography>
                            </motion.div>
                          </Stack>
                        </Box>
                      </Paper>
                    </motion.div>
                  </ImageListItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ImageList>
      </motion.div>

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