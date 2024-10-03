import React from "react";
import {
  ListItem,
  Card,
  CardContent,
  Box,
  Skeleton,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { CreditCard as CreditCardIcon } from "@mui/icons-material";
import { getBankColor } from "./colorPalette";
import useCardImagesData from '../hooks/useCardImagesData';

const CardListRenderer = ({
  isCardListLoading,
  isCalculated,
  cardRewards,
  userCards,
  failedImages,
  handleImageError
}) => {
  const { cardImagesData, isLoading: isLoadingCardImages, error: cardImagesError } = useCardImagesData();

  const findCardDetails = (bank, cardName) => {
    return cardImagesData.find(
      (item) => item.bank.toLowerCase() === bank.toLowerCase() && 
                item.cardName.toLowerCase() === cardName.toLowerCase()
    );
  };

  const renderCardImage = (card) => {
    const bankColor = getBankColor(card.bank);
    const cardDetails = findCardDetails(card.bank, card.cardName);

    if (!cardDetails || failedImages[card.id]) {
      return <CreditCardIcon sx={{ fontSize: 40, color: bankColor }} />;
    }

    const isHorizontal = cardDetails.orientation === "horizontal";

    return (
      <Image
        src={cardDetails.id}
        alt={`${card.bank} ${card.cardName}`}
        width={isHorizontal ? 60 : 40}
        height={isHorizontal ? 40 : 60}
        objectFit="contain"
        onError={() => handleImageError(card.id)}
      />
    );
  };

  if (isCardListLoading || isLoadingCardImages) {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <ListItem key={index} sx={{ mb: 2 }}>
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Skeleton
                variant="rectangular"
                width={60}
                height={40}
                sx={{ mr: 2 }}
              />
              <Box sx={{ width: "100%" }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Box>
            </CardContent>
          </Card>
        </ListItem>
      ));
  }

  if (cardImagesError) {
    return (
      <Typography color="error">Error loading card images: {cardImagesError.message}</Typography>
    );
  }

  return cardRewards.map((card, index) => (
    <ListItem key={card.bank + card.cardName} sx={{ mb: 2, borderRadius: 1 }}>
      <Card
        sx={{
          width: "100%",
          bgcolor: index === 0 ? "success.light" : "background.paper",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
          <ListItemIcon>
            <Box
              sx={{
                width: 60,
                height: 40,
                position: "relative",
                mr: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderCardImage(card)}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: index === 0 ? "success.contrastText" : "text.primary",
                }}
              >
                {`${index + 1}. ${card.bank} - ${card.cardName}`}
              </Typography>
            }
            secondary={
              <Typography variant="body1"
                sx={{
                  color:
                    index === 0 ? "success.contrastText" : "text.secondary",
                }}
              >
                {card.rewardText}
              </Typography>
            }
          />
        </CardContent>
      </Card>
    </ListItem>
  ));
};

export { CardListRenderer };