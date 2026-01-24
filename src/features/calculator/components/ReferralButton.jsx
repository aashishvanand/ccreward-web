import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRegion } from "@/core/providers/RegionContext";

// Use a prefix for the cache key to make it dynamic
const CACHE_KEY_PREFIX = "referralData_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const ReferralButton = ({
  bank,
  cardName,
  userCards,
  calculationPerformed,
}) => {
  // Get the current region from the context
  const { region, isInitialized } = useRegion();
  const [referralLink, setReferralLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a dynamic cache key based on the region (only if region exists)
  const cacheKey = region ? `${CACHE_KEY_PREFIX}${region.toLowerCase()}` : null;

  useEffect(() => {
    // Don't fetch if region is not initialized or not available
    if (!isInitialized || !region || !cacheKey) {
      setIsLoading(false);
      return;
    }

    const fetchReferralData = async () => {
      // Reset state when dependencies change
      setIsLoading(true);
      setReferralLink(null);

      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            const cardReferral = data.find(
              (item) =>
                item.bank === bank && item.cardName === cardName && item.link
            );
            setReferralLink(cardReferral?.link || null);
            setIsLoading(false);
            return;
          }
        }

        // Construct the URL dynamically using the current region
        const url = `https://files.ccreward.app/referral_${region.toLowerCase()}.json`;
        const response = await fetch(url);

        if (!response.ok) {
          // Handle cases where a region-specific file might not exist
          console.warn(`Referral file for region "${region}" not found.`);
          // Set empty data in cache to avoid refetching on every render
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: [], timestamp: Date.now() })
          );
          return;
        }

        const data = await response.json();

        // Use the dynamic cache key to store the data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        const cardReferral = data.find(
          (item) =>
            item.bank === bank && item.cardName === cardName && item.link
        );
        setReferralLink(cardReferral?.link || null);
      } catch (error) {
        console.error('Error fetching referral data for region:', region, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, [bank, cardName, region, isInitialized, cacheKey]);

  // Don't render button if loading, no referral link, or conditions not met
  if (
    isLoading ||
    !referralLink ||
    !calculationPerformed ||
    userCards.some((card) => card.bank === bank && card.cardName === cardName)
  ) {
    return null;
  }

  const handleReferralClick = () => {
    // Track the referral click if analytics are available
    if (window.gtag) {
      window.gtag('event', 'referral_click', {
        bank: bank,
        card_name: cardName,
        region: region
      });
    }
    
    // Open referral link in new tab
    window.open(referralLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant="contained"
      color="success"
      size="large"
      onClick={handleReferralClick}
      sx={{
        mt: 2,
        fontWeight: "bold",
        px: 4,
        py: 1.5,
        borderRadius: 2,
        textTransform: "none",
        boxShadow: 3,
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
        transition: "all 0.3s ease",
      }}
    >
      Get This Card
    </Button>
  );
};

export default ReferralButton;