import { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Counter from "./Counter";

const StatsSection = () => {
  const [stats, setStats] = useState({ cards: 0, banks: new Set() });
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  const roundToNearestFifty = (num) => {
    const rounded = Math.floor(num / 50) * 50;
    return rounded;
  };

  // Data fetching effect
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const cachedData = localStorage.getItem("cardImagesData");
        if (cachedData) {
          const cardData = JSON.parse(cachedData).data;
          const uniqueBanks = new Set(cardData.map((card) => card.bank));
          setStats({
            cards: cardData.length,
            banks: uniqueBanks.size,
          });
        } else {
          const response = await fetch(
            "https://files.ccreward.app/cardImages.json"
          );
          const cardData = await response.json();
          const uniqueBanks = new Set(cardData.map((card) => card.bank));
          setStats({
            cards: cardData.length,
            banks: uniqueBanks.size,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Setup and cleanup intersection observer
  useEffect(() => {

    const setupObserver = () => {
      if (!sectionRef.current || observerRef.current) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          console.log("Intersection callback triggered:", {
            isIntersecting: entries[0].isIntersecting,
            hasAnimated,
          });

          if (entries[0].isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        },
        {
          threshold: 0.2,
          rootMargin: "50px",
        }
      );
      observerRef.current.observe(sectionRef.current);
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasAnimated, sectionRef.current]); // Added sectionRef.current as dependency

  if (isLoading) return null;

  return (
    <Box ref={sectionRef} sx={{ py: 8, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 6,
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            color: "text.primary",
          }}
        >
          Comprehensive Credit Card Coverage
        </Typography>

        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 8,
            maxWidth: "800px",
            mx: "auto",
            color: "text.secondary",
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
          }}
        >
          With support for hundreds of credit cards across major banks in India,
          it&apos;s never been easier to optimize your credit card rewards
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "regular",
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  color: "primary.main",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Counter
                  value={roundToNearestFifty(stats.cards)}
                  animate={hasAnimated}
                  suffix="+"
                />
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontWeight: "regular",
                }}
              >
                Credit Cards
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "regular",
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  color: "primary.main",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Counter value={stats.banks} animate={hasAnimated} suffix="+" />
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontWeight: "regular",
                }}
              >
                Banks
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
