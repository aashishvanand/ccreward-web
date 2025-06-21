import { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Counter from "./Counter";
import { useRegion } from "../../../../core/providers/RegionContext";

const StatsSection = () => {
  const { region, regionName } = useRegion();
  const [stats, setStats] = useState({ cards: 0, banks: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const prevRegionRef = useRef(region);

  const roundToNearestFifty = (num) => {
    const rounded = Math.floor(num / 50) * 50;
    return rounded;
  };

  const roundToNearestTen = (num) => {
    const rounded = Math.floor(num / 10) * 10;
    return rounded;
  };

  const title = region === 'SG'
    ? `${regionName} Credit Card Coverage`
    : 'Comprehensive Credit Card Coverage';

    const description = `With support for credit cards across major banks in ${regionName}, it's never been easier to optimize your credit card rewards.`;

  // Reset stats and loading state when region changes
  useEffect(() => {
    if (prevRegionRef.current !== region) {
      // Reset stats and trigger a refetch when region changes
      setIsLoading(true);
      setStats({ cards: 0, banks: 0 });
      prevRegionRef.current = region;
    }
  }, [region]);

  // Data fetching effect
  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoading) return;
      
      try {
        // Generate cache key based on region
        const cacheKey = `cardImagesData_${region.toLowerCase()}`;
        
        // Clear cached data for this region to force fresh fetch
        localStorage.removeItem(cacheKey);
        
        // Fetch data based on region
        const url = `https://files.ccreward.app/cardImages_${region.toLowerCase()}.json`;
        console.log(`Fetching stats from: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const cardData = await response.json();
        const uniqueBanks = new Set(cardData.map((card) => card.bank));
        
        console.log(`Fetched ${cardData.length} cards for ${region}`);
        
        setStats({
          cards: cardData.length,
          banks: uniqueBanks.size,
        });
        
        // Save to localStorage with region-specific key
        localStorage.setItem(cacheKey, JSON.stringify({
          data: cardData,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error(`Error fetching stats for ${region}:`, error);
        // Fallback to reasonable defaults based on region
        setStats({
          cards: region === 'IN' ? 200 : 100,
          banks: region === 'IN' ? 20 : 13,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isLoading, region]);

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
          {title}
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
          {description}
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
                  value={stats.cards ? roundToNearestFifty(stats.cards) : 0}
                  animate={hasAnimated && !isLoading}
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
                <Counter
                  value={stats.banks ? roundToNearestTen(stats.banks) : 0}
                  animate={hasAnimated && !isLoading}
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