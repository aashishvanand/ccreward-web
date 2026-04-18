import { useMemo } from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import { CreditCard as CreditCardIcon } from "@mui/icons-material";
import Image from "next/image";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

const QuickCardSelector = ({ userCards = [], selectedBank, selectedCard, onSelectCard }) => {
  const { cardImagesData } = useCardImagesData();

  const processedCards = useMemo(() => {
    if (!cardImagesData || !userCards.length) return [];
    return userCards.map((card) => {
      const imageData = cardImagesData.find(
        (item) =>
          item.bank.toLowerCase() === card.bank.toLowerCase() &&
          item.cardName.toLowerCase() === card.cardName.toLowerCase()
      );
      return {
        ...card,
        imageId: imageData?.id || null,
        orientation: imageData?.orientation || "horizontal",
      };
    });
  }, [userCards, cardImagesData]);

  if (!processedCards.length) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
        Quick Select from My Cards
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          overflowX: "auto",
          pb: 1,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 2 },
        }}
      >
        {processedCards.map((card) => {
          const isSelected =
            selectedBank === card.bank && selectedCard === card.cardName;
          return (
            <Tooltip key={`${card.bank}-${card.cardName}`} title={`${card.cardName} · ${card.bank}`} placement="top">
              <Paper
                onClick={() => onSelectCard(card.bank, card.cardName)}
                elevation={isSelected ? 3 : 1}
                sx={{
                  flexShrink: 0,
                  width: 90,
                  cursor: "pointer",
                  borderRadius: 1.5,
                  overflow: "hidden",
                  border: 2,
                  borderColor: isSelected ? "primary.main" : "transparent",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  "&:hover": {
                    borderColor: isSelected ? "primary.main" : "primary.light",
                    boxShadow: 3,
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: card.orientation === "vertical" ? "0.63/1" : "1.59/1",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {card.imageId ? (
                    <Image
                      src={buildCloudflareImageUrl(card.imageId, "public")}
                      alt={`${card.bank} ${card.cardName}`}
                      width={90}
                      height={card.orientation === "vertical" ? 143 : 57}
                      unoptimized
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  ) : (
                    <CreditCardIcon sx={{ color: "text.disabled", fontSize: 28 }} />
                  )}
                </Box>
                <Box sx={{ px: 0.75, py: 0.5 }}>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ display: "block", fontWeight: 600, fontSize: "0.65rem", lineHeight: 1.2 }}
                  >
                    {card.cardName}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ display: "block", color: "text.secondary", fontSize: "0.6rem", lineHeight: 1.2 }}
                  >
                    {card.bank}
                  </Typography>
                </Box>
              </Paper>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default QuickCardSelector;
