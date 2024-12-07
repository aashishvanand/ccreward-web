import { useState, useEffect } from "react";
import {
  ImageList,
  ImageListItem,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import Image from "next/image";

const CACHE_KEY = "referralData";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const TopCardsGrid = ({
  cards,
  isMobile,
  isTablet,
  handleCardClick,
  theme,
}) => {
  const [referralData, setReferralData] = useState({});
  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            const mappedData = data.reduce((acc, item) => {
              if (item.link) {
                acc[`${item.bank}-${item.cardName}`] = item.link;
              }
              return acc;
            }, {});
            setReferralData(mappedData);
            return;
          }
        }

        const response = await fetch(
          "https://files.ccreward.app/referral.json"
        );
        const data = await response.json();

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        const mappedData = data.reduce((acc, item) => {
          if (item.link) {
            acc[`${item.bank}-${item.cardName}`] = item.link;
          }
          return acc;
        }, {});
        setReferralData(mappedData);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferralData();
  }, []);

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
          cursor: isMobile ? "default" : "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
        },
      }}
    >
      {cards.map((card) => {
        const cardKey = `${card.bank}-${card.cardName}`;
        const referralLink = referralData[cardKey];

        return (
          <ImageListItem
            key={cardKey}
            onClick={() =>
              !isMobile && handleCardClick(card.bank, card.cardName)
            }
            sx={{ width: "100%" }}
          >
            <Paper elevation={0} sx={{ overflow: "hidden" }}>
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
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderTop: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize:
                            card.orientation === "vertical"
                              ? "0.75rem"
                              : "0.875rem",
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
                            card.orientation === "vertical"
                              ? "0.7rem"
                              : "0.75rem",
                          lineHeight: 1.2,
                          display: "block",
                        }}
                        noWrap
                      >
                        {card.bank}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {!isMobile && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(card.bank, card.cardName);
                        }}
                        sx={{
                          flex: 1,
                          fontSize:
                            card.orientation === "vertical"
                              ? "0.7rem"
                              : "0.75rem",
                        }}
                      >
                        Calculate Rewards
                      </Button>
                    )}
                    {referralLink && (
                      <Button
                        variant="outlined"
                        size="small"
                        href={referralLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          flex: 1,
                          fontSize:
                            card.orientation === "vertical"
                              ? "0.7rem"
                              : "0.75rem",
                        }}
                      >
                        Apply Now
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

export default TopCardsGrid;
