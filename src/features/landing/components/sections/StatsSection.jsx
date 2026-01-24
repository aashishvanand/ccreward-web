import { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Counter from "./Counter";
import { useRegion } from "@/core/providers/RegionContext";

const StatsSection = () => {
  const { region, isInitialized } = useRegion();
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

  // Reset stats and loading state when region changes
  useEffect(() => {
    if (prevRegionRef.current !== region) {
      // Reset stats and trigger a refetch when region changes
      setIsLoading(true);
      setStats({ cards: 0, banks: 0 });
      setHasAnimated(false);
      prevRegionRef.current = region;
    }
  }, [region]);

  // Data fetching effect - only run when region is initialized
  useEffect(() => {
    const fetchStats = async () => {
      // Don't fetch if region is not initialized or not available
      if (!isInitialized || !region) {
        setIsLoading(true);
        return;
      }

      try {

        setIsLoading(true);
        
        // Generate cache key for cards data
        const cacheKey = `cardsData_${region.toLowerCase()}`;
        
        // Check if we have recent cached cards data first
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          try {
            const { data: cardsData, timestamp } = JSON.parse(cachedData);
            const cacheAge = Date.now() - timestamp;
            const cacheExpirationTime = 24 * 60 * 60 * 1000; // 24 hours
            
            if (cacheAge < cacheExpirationTime && cardsData && cardsData.issuers) {

              
              // Count total cards and banks from the cached data
              const issuers = Object.keys(cardsData.issuers);
              const totalCards = Object.values(cardsData.issuers).reduce((total, issuer) => {
                return total + (issuer.cards ? issuer.cards.length : 0);
              }, 0);
              
              setStats({
                cards: totalCards,
                banks: issuers.length,
              });
              setIsLoading(false);
              return;
            }
          } catch (cacheError) {
            console.warn('Error parsing cached cards data:', cacheError);
            localStorage.removeItem(cacheKey);
          }
        }
        
        // Fetch fresh cards data from the API
        const url = `https://files.ccreward.app/cards_${region.toLowerCase()}.json`;

        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch cards data: ${response.status} ${response.statusText}`);
        }
        
        const cardsData = await response.json();
        
        if (!cardsData || !cardsData.issuers) {
          throw new Error('Invalid cards data format received');
        }
        
        // Count total cards and banks from all issuers
        const issuers = Object.keys(cardsData.issuers);
        const totalCards = Object.values(cardsData.issuers).reduce((total, issuer) => {
          return total + (issuer.cards ? issuer.cards.length : 0);
        }, 0);
        

        
        setStats({
          cards: totalCards,
          banks: issuers.length,
        });
        
        // Save cards data to localStorage with region-specific key
        localStorage.setItem(cacheKey, JSON.stringify({
          data: cardsData,
          timestamp: Date.now()
        }));
        
      } catch (error) {
        console.error('Error fetching stats for:', region, error);
        
        // Fallback to reasonable defaults based on region
        const fallbackStats = {
          cards: region === 'SG' ? 200 : region === 'IN' ? 300 : 100,
          banks: region === 'SG' ? 13 : region === 'IN' ? 20 : 15,
        };
        

        setStats(fallbackStats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [region, isInitialized]);

  // Setup and cleanup intersection observer
  useEffect(() => {
    const setupObserver = () => {
      if (!sectionRef.current || observerRef.current) return;
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated && !isLoading) {

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
  }, [hasAnimated, isLoading]);

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
            mb: 10,
            maxWidth: "800px",
            mx: "auto",
            color: "text.secondary",
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
            lineHeight: 1.6,
          }}
        >
          {getRegionSpecificDescription()}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 6, md: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5rem" },
                  color: "primary.main",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
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
          
          <Grid size={{ xs: 6, md: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5rem" },
                  color: "primary.main",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
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