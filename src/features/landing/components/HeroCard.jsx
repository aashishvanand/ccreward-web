import PropTypes from "prop-types";
import { Card } from "@mui/material";
import Image from "next/image";

const HeroCard = ({ card, index, isMobile, isTablet, isLargeScreen }) => {
  // Mobile configuration
  const mobileTransform = `translateX(-50%) rotate(${(index - 1) * 5}deg)`;
  const mobileHoverTransform = "translateX(-50%) scale(1.05) rotate(0deg)";

  // Tablet/Desktop configuration
  const nonMobileTransform = `rotate(${(index - 1) * 5}deg)`;
  const nonMobileHoverTransform = "scale(1.05) rotate(0deg)";

  // Get width and height based on screen size
  const getCardDimensions = () => {
    if (isMobile) return { width: 240, height: 150 };
    if (isTablet) return { width: 280, height: 175 };
    return { width: 320, height: 200 };
  };

  // Get left position for non-mobile
  const getLeftPosition = () => {
    if (isMobile) return "50%";
    return `${index * (isLargeScreen ? 5 : 8)}%`;
  };

  // Get top position
  const getTopPosition = () => {
    if (isMobile) return `${index * 20}%`;
    return `${index * (isTablet ? 22 : 25)}%`;
  };

  const { width, height } = getCardDimensions();

  return (
    <Card
      elevation={4}
      sx={{
        position: "absolute",
        transition: "all 0.3s ease-in-out",
        top: getTopPosition(),
        left: getLeftPosition(),
        width,
        height,
        transform: isMobile ? mobileTransform : nonMobileTransform,
        "&:hover": {
          zIndex: 10,
          transform: isMobile ? mobileHoverTransform : nonMobileHoverTransform,
        },
      }}
    >
      <Image
        src={card.id}
        alt={`${card.bank} ${card.cardName}`}
        layout="fill"
        objectFit="contain"
        sizes="(max-width: 600px) 240px, (max-width: 960px) 280px, 320px"
      />
    </Card>
  );
};

HeroCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    bank: PropTypes.string.isRequired,
    cardName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
};

HeroCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    bank: PropTypes.string.isRequired,
    cardName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
};

export default HeroCard;
