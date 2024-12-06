import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const CACHE_KEY = "referralData";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const ReferralButton = ({
  bank,
  cardName,
  userCards,
  calculationPerformed,
}) => {
  const [referralLink, setReferralLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
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

        const response = await fetch(
          "https://files.ccreward.app/referral.json"
        );
        const data = await response.json();

        localStorage.setItem(
          CACHE_KEY,
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

    if (bank && cardName) {
      fetchReferralData();
    }
  }, [bank, cardName]);

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
