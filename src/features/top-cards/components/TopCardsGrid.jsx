import { useState, useEffect } from "react";
import {
  ImageList,
  ImageListItem,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import {
  RestaurantMenu as RestaurantMenuIcon,
  LocalMovies as LocalMoviesIcon,
  Flight as FlightIcon,
  LocalGasStation as LocalGasStationIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import Image from "next/image";

const CACHE_KEY = "referralData";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const categoryIcons = {
  Dining: <RestaurantMenuIcon sx={{ fontSize: 16 }} />,
  Movies: <LocalMoviesIcon sx={{ fontSize: 16 }} />,
  Travel: <FlightIcon sx={{ fontSize: 16 }} />,
  Fuel: <LocalGasStationIcon sx={{ fontSize: 16 }} />,
  Shopping: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
};

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
              acc[`${item.bank}-${item.cardName}`] = item;
              return acc;
            }, {});
            setReferralData(mappedData);
            return;
          }
        }

        const response = await fetch("https://files.ccreward.app/referral.json");
        const data = await response.json();

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        const mappedData = data.reduce((acc, item) => {
          acc[`${item.bank}-${item.cardName}`] = item;
          return acc;
        }, {});
        setReferralData(mappedData);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferralData();
  }, []);

  const renderFees = (cardKey) => {
    const referralInfo = referralData[cardKey];
    if (!referralInfo) return null;

    const joiningFees = parseInt(referralInfo.JoiningFees || "0");
    const renewalFees = parseInt(referralInfo.RenewalFees || "0");
    const isLtf = referralInfo.ltf;

    if (!joiningFees && !renewalFees) return null;

    return (
      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          Card Fees {isLtf && <Chip label="Lifetime Free" size="small" color="success" sx={{ height: 16, fontSize: "0.6rem" }} />}
        </Typography>
        <Stack 
          spacing={0.5} 
          sx={{ 
            mt: 0.5,
            px: 1.5,
            py: 1,
            bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          {joiningFees > 0 && (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between",
              textDecoration: isLtf ? "line-through" : "none",
            }}>
              <Typography variant="caption" color="text.secondary">
                Joining Fee:
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ₹{joiningFees} + GST
              </Typography>
            </Box>
          )}
          {renewalFees > 0 && (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between",
              textDecoration: isLtf ? "line-through" : "none",
            }}>
              <Typography variant="caption" color="text.secondary">
                Annual Fee:
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ₹{renewalFees} + GST
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    );
  };

  const renderCategories = (cardKey) => {
    const referralInfo = referralData[cardKey];
    if (!referralInfo?.bestSuitedFor?.length) return null;

    return (
      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            mb: 0.5,
            display: "block",
          }}
        >
          Best For
        </Typography>
        <Stack 
          direction="row" 
          spacing={0.5} 
          sx={{ 
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {referralInfo.bestSuitedFor.map((category) => (
            <Chip
              key={category}
              icon={categoryIcons[category]}
              label={category}
              size="small"
              variant="outlined"
              sx={{ 
                height: 20,
                bgcolor: "background.default",
                "& .MuiChip-icon": { 
                  marginLeft: "4px",
                  marginRight: "-4px"
                },
                "& .MuiChip-label": {
                  fontSize: "0.65rem",
                  padding: "0 8px"
                }
              }}
            />
          ))}
        </Stack>
      </Box>
    );
  };

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
        const referralInfo = referralData[cardKey];

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
                  <Stack spacing={0.5}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: card.orientation === "vertical" ? "0.75rem" : "0.875rem",
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
                        fontSize: card.orientation === "vertical" ? "0.7rem" : "0.75rem",
                        lineHeight: 1.2,
                      }}
                      noWrap
                    >
                      {card.bank}
                    </Typography>
                  </Stack>

                  {renderFees(cardKey)}
                  {renderCategories(cardKey)}

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
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
                          fontSize: card.orientation === "vertical" ? "0.7rem" : "0.75rem",
                        }}
                      >
                        Calculate Rewards
                      </Button>
                    )}
                    {referralInfo?.link && (
                      <Button
                        variant="outlined"
                        size="small"
                        href={referralInfo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          flex: 1,
                          fontSize: card.orientation === "vertical" ? "0.7rem" : "0.75rem",
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