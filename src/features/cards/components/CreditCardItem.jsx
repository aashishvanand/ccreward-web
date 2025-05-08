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
import { motion } from 'framer-motion';

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

// Card animations
const cardVariants = {
  initial: { scale: 0.96, y: 10, opacity: 0 },
  animate: { 
    scale: 1, 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.1
    }
  },
  hover: { 
    y: -8, 
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { scale: 0.98 }
};

// Delete button animation
const deleteButtonVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1 }
};

function CreditCardItem({ card, onDelete }) {
  if (!card) return null;

  const bankColor = bankColors[card.bank] || "#000000";
  const isHorizontal = card.orientation === "horizontal";

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
    >
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
        <motion.div variants={deleteButtonVariants}>
          <IconButton
            aria-label="delete card"
            onClick={() => onDelete(card.id)}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "4px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <DeleteIcon sx={{ color: "white", fontSize: "1rem" }} />
          </IconButton>
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default CreditCardItem;