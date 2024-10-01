import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import CreditCardItem from "./CreditCardItem";

function CardList({ cards, onDeleteCard }) {
  const [cardOrientations, setCardOrientations] = useState({});

  const handleImageLoad = (cardId, width, height) => {
    setCardOrientations((prev) => ({
      ...prev,
      [cardId]: width / height > 1 ? "horizontal" : "vertical",
    }));
  };

  if (cards.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        You haven&apos;t added any cards yet. Click &quot;Add New Card&quot; to
        get started!
      </Typography>
    );
  }

  const horizontalCards = cards.filter(
    (card) => cardOrientations[card.id] !== "vertical"
  );
  const verticalCards = cards.filter(
    (card) => cardOrientations[card.id] === "vertical"
  );

  return (
    <>
      <Grid container spacing={2}>
        {horizontalCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
            <CreditCardItem
              card={card}
              onDelete={onDeleteCard}
              onImageLoad={handleImageLoad}
              isHorizontal={true}
            />
          </Grid>
        ))}
      </Grid>
      {verticalCards.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {verticalCards.map((card) => (
            <Grid item xs={6} sm={4} md={2} key={card.id}>
              <CreditCardItem
                card={card}
                onDelete={onDeleteCard}
                onImageLoad={handleImageLoad}
                isHorizontal={false}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default CardList;
