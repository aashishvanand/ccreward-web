import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  useTheme,
  Alert,
} from "@mui/material";
import CreditCardItem from "./CreditCardItem";
import useCardImagesData from "../../../core/hooks/useCardImagesData";

const FALLBACK_IMAGE = "d0d46719-2688-4084-4573-d0a65e6de900";

const CardList = ({ cards = [], onDeleteCard }) => {
  const theme = useTheme();
  const { cardImagesData, isLoading, error } = useCardImagesData();
  const [sortedCards, setSortedCards] = useState({
    horizontal: [],
    vertical: [],
  });

  useEffect(() => {
    if (cards && Array.isArray(cards)) {
      const horizontal = [];
      const vertical = [];

      cards.forEach((card) => {
        const cardDetails = cardImagesData?.find(
          (item) =>
            item.bank.toLowerCase() === card.bank.toLowerCase() &&
            item.cardName.toLowerCase() === card.cardName.toLowerCase()
        );

        const processedCard = {
          ...card,
          imageId: cardDetails?.id || FALLBACK_IMAGE,
          orientation: cardDetails?.orientation || "horizontal",
        };

        if (processedCard.orientation === "vertical") {
          vertical.push(processedCard);
        } else {
          horizontal.push(processedCard);
        }
      });

      setSortedCards({
        horizontal,
        vertical,
      });
    }
  }, [cards, cardImagesData]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading card data. Please try again later.
      </Alert>
    );
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    return (
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
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Horizontal Cards */}
      {sortedCards.horizontal.length > 0 && (
        <Grid container spacing={2}>
          {sortedCards.horizontal.map((card) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={`${card.bank}_${card.cardName}`}
            >
              <CreditCardItem
                card={card}
                onDelete={() => onDeleteCard(card.bank, card.cardName)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Vertical Cards */}
      {sortedCards.vertical.length > 0 && (
        <Grid
          container
          spacing={2}
          sx={{
            mt: sortedCards.horizontal.length > 0 ? 4 : 0,
          }}
        >
          {sortedCards.vertical.map((card) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              key={`${card.bank}_${card.cardName}`}
            >
              <CreditCardItem
                card={card}
                onDelete={() => onDeleteCard(card.bank, card.cardName)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CardList;
