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
import Image from "next/image";
import useCardImagesData from "../hooks/useCardImagesData";

const bankColors = {
  HDFC: "#004C8F",
  ICICI: "#B02A30",
  SBI: "#22409A",
  Axis: "#800000",
  AMEX: "#006FCF",
  YESBank: "#00518F",
  SC: "#0072AA",
  Kotak: "#ED1C24",
  IDFCFirst: "#9C1D26",
  HSBC: "#EE3524",
  OneCard: "#000000",
  RBL: "#21317D",
  IndusInd: "#98272A",
  IDBI: "#00836C",
  Federal: "#F7A800",
  BOB: "#F15A29",
  AU: "#ec691f",
};

const getBankColor = (bankName) => bankColors[bankName] || "#000000";

function CreditCardItem({ card, onDelete }) {
  const { cardImagesData } = useCardImagesData();
  const [cardDetails, setCardDetails] = useState(null);
  const [hasFailedImage, setHasFailedImage] = useState(false);

  useEffect(() => {
    if (cardImagesData.length > 0) {
      const details = cardImagesData.find(
        (item) =>
          item.bank.toLowerCase() === card.bank.toLowerCase() &&
          item.cardName.toLowerCase() === card.cardName.toLowerCase()
      );
      setCardDetails(details);
    }
  }, [card, cardImagesData]);

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
    (<Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover .deleteIcon": { opacity: 1 },
      }}
      slots={{
        root: 'div'
      }}
    >
      <CardMedia
        component="div"
        sx={[{
          position: "relative",
          background: `linear-gradient(45deg, ${startColor}, ${endColor})`
        }, isHorizontal ? {
          paddingTop: "63%"
        } : {
          paddingTop: "158%"
        }]}
      >
        {!hasFailedImage && (
          <Box
            sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          >
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
    </Card>)
  );
}

export default CreditCardItem;
