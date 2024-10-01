import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Image from 'next/image';
import cardImagesData from '../data/cardImages.json';
import { getBankColor } from "./colorPalette";

function CreditCardItem({ card, onDelete }) {
  const [cardDetails, setCardDetails] = useState(null);
  const [hasFailedImage, setHasFailedImage] = useState(false);

  useEffect(() => {
    const details = cardImagesData.find(
      (item) => item.bank.toLowerCase() === card.bank.toLowerCase() && 
                item.cardName.toLowerCase() === card.cardName.toLowerCase()
    );
    setCardDetails(details);
  }, [card]);

  const handleImageError = () => {
    setHasFailedImage(true);
  };

  if (!cardDetails) {
    return null; // or a loading state
  }

  const startColor = getBankColor(cardDetails.bank);
  const endColor = getBankColor(cardDetails.bank);
  const isHorizontal = cardDetails.orientation === "horizontal";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover .deleteIcon": { opacity: 1 },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          paddingTop: isHorizontal ? "63%" : "158%",
          position: "relative",
          background: `linear-gradient(45deg, ${startColor}, ${endColor})`,
        }}
      >
        {!hasFailedImage && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Image
              src={cardDetails.id}
              alt={`${cardDetails.bank} ${cardDetails.cardName}`}
              layout="fill"
              objectFit="contain"
              sizes={
                isHorizontal
                  ? "(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                  : "(max-width: 600px) 33vw, (max-width: 960px) 25vw, 16vw"
              }
              onError={handleImageError}
            />
          </Box>
        )}
      </CardMedia>
      <CardContent
        sx={{
          flexGrow: 1,
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="subtitle2" component="h2" noWrap>
          {cardDetails.bank}
        </Typography>
        <Typography variant="caption" noWrap>
          {cardDetails.cardName}
        </Typography>
      </CardContent>
      <IconButton
        className="deleteIcon"
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          opacity: 0,
          transition: "opacity 0.3s",
          backgroundColor: "rgba(0,0,0,0.5)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          padding: "4px",
        }}
        onClick={() => onDelete(cardDetails.id)}
      >
        <DeleteIcon sx={{ color: "white", fontSize: "1rem" }} />
      </IconButton>
    </Card>
  );
}

export default CreditCardItem;