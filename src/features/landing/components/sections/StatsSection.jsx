import { Box, Container, Typography, Grid } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import Counter from "./Counter";
import { useRegion } from "../../../../core/providers/RegionContext";

const StatsSection = () => {
  const { region, isInitialized } = useRegion();
  const [stats, setStats] = useState({ cards: 0, banks: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  // Load stats based on region
  useEffect(() => {
    // Don't load stats if region is not initialized
    if (!isInitialized || !region) {
      setIsLoading(true);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Set region-specific stats
        setStats({
          cards: region === 'SG' ? 200 : 100,
          banks: region === 'IN' ? 20 : 13,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isLoading, region, isInitialized]);

  // Setup and cleanup intersection observer
  useEffect(() => {
    const setupObserver = () => {
      if (!sectionRef.current || observerRef.current) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
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
  }, [hasAnimated]);

  // Reset animation state when region changes
  useEffect(() => {
    setHasAnimated(false);
  }, [region]);

  const getRegionSpecificTitle = () => {
    if (!region) return "Loading...";
    return region === 'SG' 
      ? "Singapore Credit Card Coverage" 
      : "Comprehensive Credit Card Coverage";
  };

  const getRegionSpecificDescription = () => {
    if (!region) return "Loading credit card data...";
    return region === 'SG' 
      ? "With support for credit cards across major banks in Singapore, optimize your credit card rewards easily"
      : "With support for hundreds of credit cards across major banks in India, it's never been easier to optimize your credit card rewards";
  };

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
          {getRegionSpecificTitle()}
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
          {getRegionSpecificDescription()}
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
                  value={stats.cards ? stats.cards : 0}
                  shouldAnimate={hasAnimated && !isLoading}
                  duration={2000}
                />
                +
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: "medium",
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
                <Counter
                  value={stats.banks ? stats.banks : 0}
                  shouldAnimate={hasAnimated && !isLoading}
                  duration={2000}
                />
                +
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: "medium",
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