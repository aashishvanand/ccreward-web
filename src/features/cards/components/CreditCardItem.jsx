import { useState, useEffect } from "react";
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
import useCardImagesData from "../.././../core/hooks/useCardImagesData";

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

function CreditCardItem(props) {
  const { card, onDelete } = props;
  const { cardImagesData } = useCardImagesData();
  const [cardDetails, setCardDetails] = useState(null);
  const [hasFailedImage, setHasFailedImage] = useState(false);

  useEffect(() => {
    if (cardImagesData && cardImagesData.length > 0 && card) {
      const details = cardImagesData.find(
        (item) =>
          item.bank.toLowerCase() === card.bank.toLowerCase() &&
          item.cardName.toLowerCase() === card.cardName.toLowerCase()
      );
      setCardDetails(details);
    }
  }, [card, cardImagesData]);

  if (!cardDetails) {
    return null;
  }

  const bankColor = bankColors[cardDetails.bank] || "#000000";
  const isHorizontal = cardDetails.orientation === "horizontal";

  const cardStyles = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };

  const mediaStyles = {
    position: "relative",
    background: `linear-gradient(45deg, ${bankColor}, ${bankColor})`,
    paddingTop: isHorizontal ? "63%" : "158%",
  };

  const imageContainerStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const contentStyles = {
    flexGrow: 1,
    p: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const deleteButtonStyles = {
    position: "absolute",
    top: 4,
    right: 4,
    opacity: 0,
    transition: "opacity 0.3s",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "4px",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.7)",
      opacity: 1,
    },
  };

  return (
    <Card component="div" sx={cardStyles}>
      <CardMedia component="div" sx={mediaStyles}>
        {!hasFailedImage && (
          <Box component="div" sx={imageContainerStyles}>
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
              onError={() => setHasFailedImage(true)}
            />
          </Box>
        )}
      </CardMedia>
      <CardContent component="div" sx={contentStyles}>
        <Typography component="h2" variant="subtitle2" noWrap>
          {cardDetails.bank}
        </Typography>
        <Typography component="p" variant="caption" noWrap>
          {cardDetails.cardName}
        </Typography>
      </CardContent>
      <IconButton
        aria-label="delete card"
        onClick={() => onDelete(cardDetails.id)}
        sx={deleteButtonStyles}
      >
        <DeleteIcon sx={{ color: "white", fontSize: "1rem" }} />
      </IconButton>
    </Card>
  );
}

export default CreditCardItem;
