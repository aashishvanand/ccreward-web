import {
  ListItem,
  Card,
  CardContent,
  Box,
  Skeleton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import Image from "next/image";
import { CreditCard as CreditCardIcon } from "@mui/icons-material";
import useCardImagesData from "../../../core/hooks/useCardImagesData";

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

const CardListRenderer = ({
  isCardListLoading,
  isCalculated,
  cardRewards,
  userCards,
  failedImages,
  handleImageError,
}) => {
  const {
    cardImagesData,
    isLoading: isLoadingCardImages,
    error: cardImagesError,
  } = useCardImagesData();

  const findCardDetails = (bank, cardName) => {
    return cardImagesData.find(
      (item) =>
        item.bank.toLowerCase() === bank.toLowerCase() &&
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
          <Card sx={{ width: "100%" }} slots={{ root: "div" }}>
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
      <Typography color="error">
        Error loading card images: {cardImagesError.message}
      </Typography>
    );
  }

  return cardRewards.map((card, index) => (
    <ListItem key={card.bank + card.cardName} sx={{ mb: 2, borderRadius: 1 }}>
      <Card
        sx={[
          {
            width: "100%",
          },
          index === 0
            ? {
                bgcolor: "success.light",
              }
            : {
                bgcolor: "background.paper",
              },
        ]}
        slots={{ root: "div" }}
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
              slots={{ root: "div" }}
            >
              {renderCardImage(card)}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="h6"
                component="div"
                sx={[
                  index === 0
                    ? {
                        color: "success.contrastText",
                      }
                    : {
                        color: "text.primary",
                      },
                ]}
              >
                {`${index + 1}. ${card.bank} - ${card.cardName}`}
              </Typography>
            }
            secondary={
              <Typography
                variant="body1"
                sx={[
                  index === 0
                    ? {
                        color: "success.contrastText",
                      }
                    : {
                        color: "text.secondary",
                      },
                ]}
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
