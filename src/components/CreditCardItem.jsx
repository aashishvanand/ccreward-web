import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ExportedImage from "next-image-export-optimizer";

function CreditCardItem({ card, onDelete, onImageLoad, isHorizontal }) {
  const [hasFailedImage, setHasFailedImage] = useState(false);

  const getBankColor = (bankName) => {
    const bankColors = {
      HDFC: "#004C8F",
      ICICI: "#B02A30",
      SBI: "#22409A",
      Axis: "#800000",
      AMEX: "#006FCF",
      YESBank: "#00518F",
      SC: "#0072AA",
      Kotak: "#ED1C24",
      SBI: "#00B5EF",
      IDFCFirst: "#9C1D26",
      AMEX: "#016FD0",
      HSBC: "#EE3524",
      OneCard: "#000000",
      RBL: "#21317D",
      IndusInd: "#98272A",
      IDBI: "#00836C",
      Federal: "#F7A800",
      BOB: "#F15A29",
      AU: "#ec691f",
    };
    return (
      bankColors[bankName] ||
      "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
  };

  const getCardImagePath = (bank, cardName) => {
    const formattedCardName = cardName.replace(/\s+/g, '_').toLowerCase();
    return `/card-images/${bank}/${bank.toLowerCase()}_${formattedCardName}.webp`;
  };

  const handleImageError = () => {
    setHasFailedImage(true);
    onImageLoad(card.id, isHorizontal ? 1.6 : 0.63, 1); // Assume default aspect ratio
  };

  const startColor = getBankColor(card.bank);
  const endColor = getBankColor(card.bank);
  const imagePath = getCardImagePath(card.bank, card.cardName);

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
          paddingTop: isHorizontal ? "63%" : "158%", // Reduced height for vertical cards
          position: "relative",
          background: `linear-gradient(45deg, ${startColor}, ${endColor})`,
        }}
      >
        {!hasFailedImage && (
          <ExportedImage
            src={imagePath}
            alt={`${card.bank} ${card.cardName}`}
            fill
            style={{ objectFit: "contain" }}
            sizes={isHorizontal ? "(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw" : "(max-width: 600px) 33vw, (max-width: 960px) 25vw, 16vw"}
            onLoad={(e) => {
              const img = e.target;
              onImageLoad(card.id, img.naturalWidth, img.naturalHeight);
            }}
            onError={handleImageError}
          />
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
          {card.bank}
        </Typography>
        <Typography variant="caption" noWrap>
          {card.cardName}
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
        onClick={() => onDelete(card.id)}
      >
        <DeleteIcon sx={{ color: "white", fontSize: "1rem" }} />
      </IconButton>
    </Card>
  );
}

export default CreditCardItem;
