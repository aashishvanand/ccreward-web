"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Counter from "./Counter";
import { useRegion } from "@/core/providers/RegionContext";

// Shown only if the server didn't pass counts
const FALLBACK_STATS = {
  IN: { cards: 300, banks: 20 },
  SG: { cards: 200, banks: 13 },
};

// cardStats: { IN: { cards, banks }, SG: { cards, banks } }, computed on the server
const StatsSection = ({ cardStats }) => {
  const { region, isInitialized } = useRegion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const prevRegionRef = useRef(region);

  const isLoading = !isInitialized || !region;
  const stats = (region && (cardStats?.[region] || FALLBACK_STATS[region])) || { cards: 0, banks: 0 };

  const roundToNearestFifty = (num) => Math.floor(num / 50) * 50;
  const roundToNearestTen = (num) => Math.floor(num / 10) * 10;

  // Replay the counter animation when the region changes
  useEffect(() => {
    if (prevRegionRef.current !== region) {
      setHasAnimated(false);
      prevRegionRef.current = region;
    }
  }, [region]);

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

        <Grid container spacing={4} sx={{
          justifyContent: "center"
        }}>
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
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontWeight: 400
                }}>
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
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontWeight: 400
                }}>
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