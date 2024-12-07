import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Image from "next/image";
import useCardImagesData from "../../../core/hooks/useCardImagesData";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const CardList = ({ cards = [], onDeleteCard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { cardImagesData, isLoading, error } = useCardImagesData();
  const [processedCards, setProcessedCards] = useState([]);
  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  useEffect(() => {
    if (cards && Array.isArray(cards) && cardImagesData) {
      const processed = cards.map((card) => {
        const cardDetails = cardImagesData?.find(
          (item) =>
            item.bank.toLowerCase() === card.bank.toLowerCase() &&
            item.cardName.toLowerCase() === card.cardName.toLowerCase()
        );
        return {
          ...card,
          image: cardDetails?.id,
          orientation: cardDetails?.orientation || "horizontal",
        };
      });
      setProcessedCards(processed);
    }
  }, [cards, cardImagesData]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading card data. Please try again later.
      </Alert>
    );
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          px: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", fontWeight: "medium" }}
        >
          You haven&apos;t added any cards yet. Click &quot;Add New Card&quot;
          to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <ImageList
      variant="masonry"
      cols={cols}
      gap={16}
      sx={{
        width: "100%",
        margin: 0,
        "& .MuiImageListItem-root": {
          display: "block",
          overflow: "hidden",
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: 1,
          mb: 2,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
            "& .delete-button": {
              opacity: 1,
            },
          },
        },
      }}
    >
      {processedCards.map((card) => (
        <ImageListItem
          key={`${card.bank}-${card.cardName}`}
          sx={{ width: "100%" }}
        >
          <Paper
            elevation={0}
            sx={{
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio:
                  card.orientation === "vertical" ? "0.63/1" : "1.59/1",
                marginBottom: 0,
              }}
            >
              {card.image && (
                <Image
                  src={card.image}
                  alt={`${card.bank} ${card.cardName}`}
                  layout="fill"
                  objectFit="contain"
                  priority={true}
                />
              )}
              <Tooltip title="Remove Card">
                <IconButton
                  className="delete-button"
                  onClick={() => onDeleteCard(card.bank, card.cardName)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                  size="small"
                >
                  <DeleteIcon sx={{ color: "white", fontSize: "1.25rem" }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize:
                      card.orientation === "vertical" ? "0.75rem" : "0.875rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                  noWrap
                >
                  {card.cardName}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize:
                      card.orientation === "vertical" ? "0.7rem" : "0.75rem",
                    lineHeight: 1.2,
                    display: "block",
                  }}
                  noWrap
                >
                  {card.bank}
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default CardList;
