import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";
import useCardImagesData from "../../../../core/hooks/useCardImagesData";

const TopSearchs = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("daily");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sliderRef = useRef(null);
  const { cardImagesData } = useCardImagesData();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://files.ccreward.app/stats/latest.json"
        );
        const data = await response.json();
        setStatsData(data);
      } catch (err) {
        setError("Failed to load stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

  if (error) return null;

  const currentStats = statsData?.[timeframe];

  const CardsList = ({ data }) => (
    <Box sx={{ position: "relative", mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ ml: 2 }}>
        Top Cards
      </Typography>

      <Box sx={{ position: "relative", group: "slider" }}>
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "background.paper",
            opacity: 0,
            transition: "opacity 0.2s",
            "&:hover": { opacity: 1 },
            ".group:hover &": { opacity: 1 },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box
          ref={sliderRef}
          sx={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            overflowY: "hidden",
            pb: 4,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            px: 2,
            pt: 2,
          }}
        >
          {data?.map((item, index) => {
            const cardImage = cardImagesData?.find(
              (img) => img.bank === item.bank && img.cardName === item.card
            );
            if (!cardImage) return null;

            const isVertical = cardImage.orientation === "vertical";

            return (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  height: 150,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  sx={{
                    position: "absolute",
                    left: index === 9 ? -32 : isVertical ? -16 : -20,
                    bottom: -20,
                    fontSize: "160px",
                    fontWeight: 900,
                    color: "background.paper",
                    opacity: 0.5,
                    WebkitTextStroke: "2px",
                    WebkitTextStrokeColor: (theme) => theme.palette.divider,
                    fontFamily: "Arial Black, sans-serif",
                    lineHeight: 0.8,
                    zIndex: 0,
                    letterSpacing: index === 9 ? "-0.05em" : "normal",
                  }}
                >
                  {index + 1}
                </Typography>

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    width: isVertical ? 150 : 240,
                    height: 150,
                    ml: index === 9 ? 8 : isVertical ? 4 : 6,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={cardImage.id}
                      alt={`${item.bank} ${item.card}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "background.paper",
            opacity: 0,
            transition: "opacity 0.2s",
            "&:hover": { opacity: 1 },
            ".group:hover &": { opacity: 1 },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            mb: 4,
          }}
        >
          Trending on CCReward
        </Typography>

        <Tabs
          value={timeframe}
          onChange={handleTimeframeChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Today" value="daily" />
          <Tab label="This Month" value="monthly" />
        </Tabs>
        <CardsList data={currentStats?.cards} />
      </Container>
    </Box>
  );
};

export default TopSearchs;
