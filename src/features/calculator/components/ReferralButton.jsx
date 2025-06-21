import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRegion } from "../../../core/providers/RegionContext";

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
  const { region } = useRegion();
  const [referralLink, setReferralLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a dynamic cache key based on the region
  const cacheKey = `${CACHE_KEY_PREFIX}${region.toLowerCase()}`;

  useEffect(() => {
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
            localStorage.setItem(cacheKey, JSON.stringify({ data: [], timestamp: Date.now() }));
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
        console.error("Error fetching referral data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (bank && cardName && region) {
      fetchReferralData();
    }
  // Add region and cacheKey to the dependency array
  }, [bank, cardName, region, cacheKey]);

  if (!calculationPerformed || !referralLink || isLoading) {
    return null;
  }

  const isCardInCollection = userCards?.some(
    (card) => card.bank === bank && card.cardName === cardName
  );

  if (isCardInCollection) {
    return null;
  }

  return (
    <Button
      variant="contained"
      color="primary"
      href={referralLink}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ mt: 2, width: "100%" }}
    >
      Apply for {bank} {cardName}
    </Button>
  );
};

export default ReferralButton;