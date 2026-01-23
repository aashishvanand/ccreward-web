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
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  School as SchoolIcon,
  Theaters as TheatersIcon,
  Restaurant as RestaurantIcon,
  AccountBalance as AccountBalanceIcon,
  LocalGroceryStore as LocalGroceryStoreIcon,
  LocalHospital as LocalHospitalIcon,
  Security as SecurityIcon,
  Public as PublicIcon,
  Diamond as DiamondIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalGasStation as LocalGasStationIcon,
  DirectionsBus as DirectionsBusIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRegion } from "../../../core/providers/RegionContext";

// Use a prefix for the cache key to make it dynamic
const CACHE_KEY_PREFIX = "referralData_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const categoryIcons = {
  Education: <SchoolIcon sx={{ fontSize: 16 }} />,
  Entertainment: <TheatersIcon sx={{ fontSize: 16 }} />,
  "Food & Dining": <RestaurantIcon sx={{ fontSize: 16 }} />,
  "Government/Tax": <AccountBalanceIcon sx={{ fontSize: 16 }} />,
  Groceries: <LocalGroceryStoreIcon sx={{ fontSize: 16 }} />,
  "Healthcare & Medical": <LocalHospitalIcon sx={{ fontSize: 16 }} />,
  Insurance: <SecurityIcon sx={{ fontSize: 16 }} />,
  "International Spends": <PublicIcon sx={{ fontSize: 16 }} />,
  Jewellery: <DiamondIcon sx={{ fontSize: 16 }} />,
  "Offline Shopping": <StoreIcon sx={{ fontSize: 16 }} />,
  "Online Shopping": <ShoppingCartIcon sx={{ fontSize: 16 }} />,
  Petrol: <LocalGasStationIcon sx={{ fontSize: 16 }} />,
  "Travel & Transportation": <DirectionsBusIcon sx={{ fontSize: 16 }} />,
  "Utility Bill": <ReceiptIcon sx={{ fontSize: 16 }} />,
  "Wallet Loading": <AccountBalanceWalletIcon sx={{ fontSize: 16 }} />,
};

const TopCardsGrid = ({
  cards,
  isMobile,
  isTablet,
  handleCardClick,
  theme,
}) => {
  // Get the current region from the context
  const { region, isInitialized } = useRegion();
  const router = useRouter();
  const [referralData, setReferralData] = useState({});
  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  // Create a region-specific cache key
  const cacheKey = region ? `${CACHE_KEY_PREFIX}${region.toLowerCase()}` : null;

  useEffect(() => {
    // Don't fetch if region is not initialized or not available
    if (!isInitialized || !region || !cacheKey) {
      return;
    }

    const fetchReferralData = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setReferralData(data);
            return;
          }
        }

        // Fetch fresh data for the current region
        const response = await fetch(`https://files.ccreward.app/referral_${region.toLowerCase()}.json`);
        if (response.ok) {
          const data = await response.json();
          setReferralData(data);
          
          // Cache the data with region-specific key
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error(`Error fetching referral data for region ${region}:`, error);
        
        // Try to use cached data even if expired
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          try {
            const { data } = JSON.parse(cachedData);
            setReferralData(data);
          } catch (parseError) {
            console.error('Error parsing cached referral data:', parseError);
          }
        }
      }
    };

    fetchReferralData();
  }, [region, isInitialized, cacheKey]);

  return (
    <ImageList variant="masonry" cols={cols} gap={16}>
      {cards.map((card, index) => {
        const referralInfo = referralData[`${card.bank}_${card.cardName}`];
        
        return (
          <ImageListItem key={`${card.bank}-${card.cardName}-${index}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    elevation: 8,
                    borderColor: "primary.main",
                  },
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => handleCardClick(card.bank, card.cardName)}
              >
                {/* Referral badge */}
                {referralInfo && (
                  <Chip
                    label={`₹${referralInfo.amount} Referral`}
                    size="small"
                    color="success"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: "0.7rem",
                      zIndex: 1,
                    }}
                  />
                )}

                <Box sx={{ 
                    position: "relative",
                    width: "100%",
                    aspectRatio: card.orientation === "vertical" ? "0.63/1" : "1.59/1",
                }}>
                  <Image
                    src={card.image}
                    alt={`${card.bank} ${card.cardName}`}
                    layout="fill"
                    objectFit="contain"
                    loading="lazy"
                  />
                </Box>

                <Box sx={{ p: 2 }}>
                    <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: isMobile ? "1rem" : "1.1rem",
                        lineHeight: 1.2,
                    }}
                    >
                    {card.bank}
                    </Typography>

                    <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        fontSize: isMobile ? "0.8rem" : "0.875rem",
                        lineHeight: 1.3,
                    }}
                    >
                    {card.cardName}
                    </Typography>

                    {card.categories && card.categories.length > 0 && (
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}>
                        {card.categories.slice(0, isMobile ? 2 : 3).map((category, catIndex) => (
                        <Chip
                            key={catIndex}
                            icon={categoryIcons[category]}
                            label={category}
                            size="small"
                            variant="outlined"
                            sx={{
                            fontSize: isMobile ? "0.6rem" : "0.7rem",
                            height: "auto",
                            "& .MuiChip-label": {
                                padding: "2px 4px",
                            },
                            }}
                        />
                        ))}
                        {card.categories.length > (isMobile ? 2 : 3) && (
                        <Chip
                            label={`+${card.categories.length - (isMobile ? 2 : 3)}`}
                            size="small"
                            variant="outlined"
                            sx={{
                            fontSize: isMobile ? "0.6rem" : "0.7rem",
                            height: "auto",
                            "& .MuiChip-label": {
                                padding: "2px 4px",
                            },
                            }}
                        />
                        )}
                    </Stack>
                    )}

                    <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                                borderRadius: 1.5,
                                textTransform: "none",
                                fontSize: isMobile ? "0.8rem" : "0.875rem",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const country = region ? region.toLowerCase() : 'in';
                                // Encode for URL but keep it clean
                                const safeBank = encodeURIComponent(card.bank.toLowerCase());
                                const safeCard = encodeURIComponent(card.cardName.toLowerCase());
                                router.push(`/${country}/bank/${safeBank}/${safeCard}`);
                            }}
                        >
                            View
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            sx={{
                                borderRadius: 1.5,
                                textTransform: "none",
                                fontSize: isMobile ? "0.8rem" : "0.875rem",
                            }}
                            onClick={() => handleCardClick(card.bank, card.cardName)}
                        >
                            Calc
                        </Button>
                    </Stack>
                </Box>
              </Paper>
            </motion.div>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

export default TopCardsGrid;