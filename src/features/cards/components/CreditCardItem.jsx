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

function CreditCardItem({ card, onDelete }) {
  if (!card) return null;

  const bankColor = bankColors[card.bank] || "#000000";
  const isHorizontal = card.orientation === "horizontal";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <CardMedia
        sx={{
          position: "relative",
          background: `linear-gradient(45deg, ${bankColor}, ${bankColor})`,
          paddingTop: isHorizontal ? "63%" : "158%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Image
            src={card.imageId}
            alt={`${card.bank} ${card.cardName}`}
            layout="fill"
            objectFit="contain"
            sizes={
              isHorizontal
                ? "(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                : "(max-width: 600px) 33vw, (max-width: 960px) 25vw, 16vw"
            }
          />
        </Box>
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
        <Typography variant="subtitle2" noWrap>
          {card.bank}
        </Typography>
        <Typography variant="caption" noWrap>
          {card.cardName}
        </Typography>
      </CardContent>
      <IconButton
        aria-label="delete card"
        onClick={() => onDelete(card.id)}
        sx={{
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
        }}
      >
        <DeleteIcon sx={{ color: "white", fontSize: "1rem" }} />
      </IconButton>
    </Card>
  );
}

export default CreditCardItem;
