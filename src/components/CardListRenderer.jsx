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
} from "@mui/material";
import { formatRewardText } from "./CalculatorHelpers";
import ExportedImage from "next-image-export-optimizer";
import { CreditCard as CreditCardIcon } from "@mui/icons-material";
import { getBankColor } from "./colorPalette";

const getCardImagePath = (bank, cardName) => {
  const formattedCardName = cardName.replace(/\s+/g, "_").toLowerCase();
  return `/card-images/${bank}/${bank.toLowerCase()}_${formattedCardName}.webp`;
};

const renderCardImage = (card, failedImages, handleImageError) => {
  const bankColor = getBankColor(card.bank);

  if (failedImages[card.id]) {
    return <CreditCardIcon sx={{ fontSize: 40, color: bankColor }} />;
  }

  return (
    <ExportedImage
      src={getCardImagePath(card.bank, card.cardName)}
      alt={`${card.bank} ${card.cardName}`}
      fill
      style={{ objectFit: "contain" }}
      onError={() => handleImageError(card.id)}
    />
  );
};

export const renderCardList = (
  isCardListLoading,
  isCalculated,
  cardRewards,
  userCards,
  failedImages,
  handleImageError
) => {
  if (isCardListLoading) {
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

  return (isCalculated ? cardRewards : userCards).map((card, index) => (
    <ListItem
      key={card.id}
      sx={{
        mb: 2,
        borderRadius: 1,
      }}
    >
      <Card
        sx={{
          width: "100%",
          bgcolor:
            isCalculated && index === 0 ? "success.light" : "background.paper",
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
              {renderCardImage(card, failedImages, handleImageError)}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color:
                    isCalculated && index === 0
                      ? "success.contrastText"
                      : "text.primary",
                }}
              >
                {isCalculated
                  ? `${index + 1}. ${card.bank} - ${card.cardName}`
                  : `${card.bank} - ${card.cardName}`}
              </Typography>
            }
            secondary={
              isCalculated ? (
                <Typography
                  variant="body1"
                  sx={{
                    color:
                      index === 0 ? "success.contrastText" : "text.secondary",
                  }}
                >
                  {formatRewardText(card)}
                </Typography>
              ) : null
            }
          />
        </CardContent>
      </Card>
    </ListItem>
  ));
};
