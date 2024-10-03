import React, { useState, useEffect } from "react";
import { Grid, Typography, CircularProgress } from "@mui/material";
import CreditCardItem from "./CreditCardItem";
import useCardImagesData from "../hooks/useCardImagesData";

function CardList({ cards, onDeleteCard }) {
  const { cardImagesData, isLoading, error } = useCardImagesData();
  const [horizontalCards, setHorizontalCards] = useState([]);
  const [verticalCards, setVerticalCards] = useState([]);

  useEffect(() => {
    if (cardImagesData.length > 0) {
      const horizontal = [];
      const vertical = [];

      cards.forEach((card) => {
        const cardDetails = cardImagesData.find(
          (item) =>
            item.bank.toLowerCase() === card.bank.toLowerCase() &&
            item.cardName.toLowerCase() === card.cardName.toLowerCase()
        );

        if (cardDetails) {
          if (cardDetails.orientation === "horizontal") {
            horizontal.push(card);
          } else {
            vertical.push(card);
          }
        }
      });

      setHorizontalCards(horizontal);
      setVerticalCards(vertical);
    }
  }, [cards, cardImagesData]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading card data: {error.message}
      </Typography>
    );
  }

  if (cards.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        You haven&apos;t added any cards yet. Click &quot;Add New Card&quot; to
        get started!
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {horizontalCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
            <CreditCardItem card={card} onDelete={onDeleteCard} />
          </Grid>
        ))}
      </Grid>
      {verticalCards.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {verticalCards.map((card) => (
            <Grid item xs={6} sm={4} md={2} key={card.id}>
              <CreditCardItem card={card} onDelete={onDeleteCard} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default CardList;
