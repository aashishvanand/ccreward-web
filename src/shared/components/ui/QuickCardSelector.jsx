"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { Box, Typography, Paper, Tooltip, IconButton } from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

// Credit card aspect ratio: 85.6mm × 53.98mm ≈ 1.586 : 1
const ASPECT_H = 1.586;   // horizontal
const ASPECT_V = 1 / ASPECT_H; // vertical ≈ 0.630

const SCROLL_AMOUNT = 300;

const QuickCardSelector = ({ userCards = [], selectedBank, selectedCard, onSelectCard }) => {
  const { cardImagesData } = useCardImagesData();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const processedCards = useMemo(() => {
    if (!cardImagesData || !userCards.length) return [];
    return userCards.map((card) => {
      const imageData = cardImagesData.find(
        (item) =>
          item.bank.toLowerCase() === card.bank.toLowerCase() &&
          item.cardName.toLowerCase() === card.cardName.toLowerCase()
      );
      const isVertical = imageData?.orientation === "vertical";
      return {
        ...card,
        imageId: imageData?.id || null,
        isVertical,
      };
    });
  }, [userCards, cardImagesData]);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: "smooth" });
  }, []);

  if (!processedCards.length) return null;

  return (
    <Box>
      <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
        Tap a card to auto-fill bank and card selection
      </Typography>

      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Left arrow */}
        <IconButton
          size="small"
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
          sx={{
            flexShrink: 0,
            mr: 0.5,
            opacity: canScrollLeft ? 1 : 0.25,
            transition: "opacity 0.2s",
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        {/* Scrollable row */}
        <Box
          ref={scrollRef}
          onScroll={updateScrollButtons}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            overflowX: "auto",
            flexGrow: 1,
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            pb: 0.5,
          }}
        >
          {processedCards.map((card) => {
            const isSelected = selectedBank === card.bank && selectedCard === card.cardName;
            const aspect = card.isVertical ? ASPECT_V : ASPECT_H;

            return (
              <Tooltip
                key={`${card.bank}-${card.cardName}`}
                title={`${card.cardName} · ${card.bank}`}
                placement="top"
              >
                <Paper
                  onClick={() => onSelectCard(card.bank, card.cardName)}
                  elevation={isSelected ? 4 : 1}
                  sx={{
                    // clamp(min, fluid, max) — scales smoothly at every viewport width, no breakpoint steps
                    flexShrink: 0,
                    width: card.isVertical ? "clamp(50px, 5vw, 80px)" : "clamp(80px, 8vw, 128px)",
                    cursor: "pointer",
                    borderRadius: 1.5,
                    overflow: "hidden",
                    border: 2,
                    borderColor: isSelected ? "primary.main" : "transparent",
                    scrollSnapAlign: "start",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    "&:hover": {
                      borderColor: isSelected ? "primary.main" : "primary.light",
                      boxShadow: 3,
                    },
                  }}
                >
                  {/* Image container: width from parent, height derived via aspectRatio */}
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: `${aspect}`,
                      bgcolor: "background.default",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.imageId ? (
                      <img
                        src={buildCloudflareImageUrl(card.imageId, "public")}
                        alt={`${card.bank} ${card.cardName}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <CreditCardIcon sx={{ color: "text.disabled", fontSize: 24 }} />
                    )}
                  </Box>

                  {/* Name + bank */}
                  <Box sx={{ px: 0.75, py: 0.5 }}>
                    <Typography
                      noWrap
                      sx={{ display: "block", fontWeight: 600, fontSize: "0.6rem", lineHeight: 1.3 }}
                    >
                      {card.cardName}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{ display: "block", color: "text.secondary", fontSize: "0.55rem", lineHeight: 1.3 }}
                    >
                      {card.bank}
                    </Typography>
                  </Box>
                </Paper>
              </Tooltip>
            );
          })}
        </Box>

        {/* Right arrow */}
        <IconButton
          size="small"
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
          sx={{
            flexShrink: 0,
            ml: 0.5,
            opacity: canScrollRight ? 1 : 0.25,
            transition: "opacity 0.2s",
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default QuickCardSelector;
