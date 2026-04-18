import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";
import useCardImagesData from "@/core/hooks/useCardImagesData";
import { useRegion } from "@/core/providers/RegionContext";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

const TopSearchs = () => {
  // Get the current region from the context
  const { region, isInitialized } = useRegion();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("daily");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sliderRef = useRef(null);
  const { cardImagesData } = useCardImagesData();

  useEffect(() => {
    // Don't fetch if region is not initialized or not available
    if (!isInitialized || !region) {
      setLoading(true);
      return;
    }

    const fetchStats = async () => {
      // Reset state when region changes
      setLoading(true);
      setError(null);
      setStatsData(null);

      try {
        // Construct the URL dynamically based on the current region
        const url = `https://files.ccreward.app/stats/${region.toLowerCase()}/latest.json`;
        const response = await fetch(url);

        if (!response.ok) {
          console.warn(`Trending stats for region "${region}" not found.`);
          throw new Error("Stats not available for this region.");
        }

        const data = await response.json();
        setStatsData(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Add `region` and `isInitialized` to the dependency array to refetch when they change
  }, [region, isInitialized]);

  const handleTimeframeChange = (event, newValue) => {
    setTimeframe(newValue);
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Do not render the component if there was an error or no data
  if (error || !statsData) return null;

  const currentStats = statsData?.stats?.[timeframe];

  if (!currentStats?.length) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Trending Credit Cards
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            mb: 3
          }}>
          Most searched cards this {timeframe.replace('ly', '')}
        </Typography>

        <Tabs
          value={timeframe}
          onChange={handleTimeframeChange}
          centered
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="Daily" value="daily" />
          <Tab label="Weekly" value="weekly" />
          <Tab label="Monthly" value="monthly" />
        </Tabs>
      </Box>
      <Box sx={{ position: "relative" }}>
        {!isMobile && (
          <>
            <IconButton
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              sx={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                backgroundColor: "background.paper",
                boxShadow: 2,
                "&:hover": { backgroundColor: "primary.light" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              sx={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                backgroundColor: "background.paper",
                boxShadow: 2,
                "&:hover": { backgroundColor: "primary.light" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        <Box
          ref={sliderRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {currentStats.map((card, index) => {
            const cardImage = cardImagesData.find(
              (img) =>
                img.bank.toLowerCase() === card.bank.toLowerCase() &&
                img.cardName.toLowerCase() === card.cardName.toLowerCase()
            );

            return (
              <Box
                key={`${card.bank}-${card.cardName}`}
                sx={{
                  minWidth: isMobile ? 280 : 320,
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  position: "relative",
                  "&:hover": {
                    boxShadow: 3,
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "primary.main",
                      mr: 1,
                    }}
                  >
                    #{index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: "text.secondary"
                  }}>
                    {card.searches} searches
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {cardImage ? (
                    <Image
                      src={buildCloudflareImageUrl(cardImage.id, "public")}
                      alt={`${card.bank} ${card.cardName}`}
                      width={cardImage.orientation === "horizontal" ? 80 : 50}
                      height={cardImage.orientation === "horizontal" ? 50 : 80}
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 60,
                        height: 40,
                        backgroundColor: "grey.200",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="caption" sx={{
                        color: "text.secondary"
                      }}>
                        {card.bank}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, lineHeight: 1.2 }}
                    >
                      {card.bank}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.2
                      }}>
                      {card.cardName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default TopSearchs;
