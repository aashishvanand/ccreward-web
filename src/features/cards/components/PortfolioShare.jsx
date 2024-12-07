import { useState, useEffect } from "react";
import {
  useTheme
} from "@mui/material";
import useCardImagesData from "../../../core/hooks/useCardImagesData";
import { forwardRef, useImperativeHandle } from 'react';

const PortfolioShare = forwardRef(({ cards }, ref) => {
  const theme = useTheme();
  const [shareUrl, setShareUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { cardImagesData } = useCardImagesData();
  const [processedCards, setProcessedCards] = useState([]);

  const loadImage = (imageId) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${imageId}/public`;
    });
  };

  const handleDownload = () => {
    if (shareUrl) {
      const link = document.createElement("a");
      link.href = shareUrl;
      link.download = "ccreward-collection.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSocialShare = (platform) => {
    const shareText = "Check out my credit card collection on CCReward! 💳";
    const url = "https://ccreward.app";
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + url)}`,
      download: 'download'
    };

    if (platform === 'download') {
      handleDownload();
    } else {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  const generateImage = async () => {
    if (!processedCards.length) return;

    setIsGenerating(true);
    try {
      const loadedImages = await Promise.all(
        processedCards.map((card) => loadImage(card.imageId))
      );

      const width = 1200;
      const padding = 30;
      const headerHeight = 160; // Increased for logo and text space
      const footerHeight = 150; // Space for buttons and text at the bottom
      const columnGap = 12;
      const columns = 4;
      const columnWidth =
        (width - padding * 2 - columnGap * (columns - 1)) / columns;
      const scale = 1.0;

      const columnHeights = Array(columns).fill(headerHeight);

      const layouts = processedCards.map((card, index) => {
        const img = loadedImages[index];
        const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        const x = padding + columnIndex * (columnWidth + columnGap);
        const y = columnHeights[columnIndex];

        // Calculate scaled dimensions while maintaining aspect ratio
        const aspectRatio = img.width / img.height;
        const cardWidth = columnWidth * scale;
        const cardHeight = cardWidth / aspectRatio;

        const textHeight = 45 * scale;
        columnHeights[columnIndex] = y + cardHeight + textHeight + columnGap;

        return {
          x,
          y,
          card,
          img,
          cardWidth,
          cardHeight,
          textHeight,
        };
      });

      const maxHeight = Math.max(...columnHeights) + footerHeight;

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = width;
      finalCanvas.height = maxHeight;
      const ctx = finalCanvas.getContext("2d");

      ctx.fillStyle = theme.palette.mode === "dark" ? "#121212" : "#ffffff";
      ctx.fillRect(0, 0, width, maxHeight);

      // Add CCReward logo
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src =
        theme.palette.mode === "dark"
          ? "https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/f4bf16b1-527e-4d80-47b4-99989a1ded00/public"
          : "https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/b6c3c6f1-a744-4e47-8c50-4c33c84c3900/public";
      await new Promise((resolve) => {
        logo.onload = resolve;
      });

      const logoWidth = 100;
      const logoHeight = (logo.height / logo.width) * logoWidth;

      const textStartX = padding + logoWidth + 20; // Space for logo and gap
      const textStartY = 50; // Adjusted to align logo and text

      // Draw logo slightly higher
      ctx.drawImage(logo, padding, textStartY - 20, logoWidth, logoHeight);

      // Draw creative header text
      ctx.fillStyle = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
      ctx.font = "bold 24px Inter";
      ctx.textAlign = "left";
      ctx.fillText(
        "ccreward.app - Maximize Your Rewards with the Right Credit Card - MyCards",
        textStartX,
        textStartY + 15
      );

      ctx.font = "18px Inter";
      ctx.fillStyle = theme.palette.mode === "dark" ? "#aaaaaa" : "#666666";
      ctx.fillText(
        "Compare cards, calculate rewards, and find the perfect credit card for your spending habits.",
        textStartX,
        textStartY + 50
      );

      layouts.forEach(
        ({ x, y, card, img, cardWidth, cardHeight, textHeight }) => {
          // Card background
          ctx.fillStyle = theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff";
          ctx.fillRect(x, y, cardWidth, cardHeight + textHeight);

          // Draw card image maintaining aspect ratio
          ctx.drawImage(img, x, y, cardWidth, cardHeight);

          // Draw card info
          ctx.fillStyle = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
          ctx.font = `bold ${14 * scale}px Inter`;
          ctx.textAlign = "left";
          ctx.fillText(card.cardName, x + 8, y + cardHeight + 18 * scale);

          ctx.fillStyle = theme.palette.mode === "dark" ? "#aaaaaa" : "#666666";
          ctx.font = `${12 * scale}px Inter`;
          ctx.fillText(card.bank, x + 8, y + cardHeight + 35 * scale);
        }
      );

      // Draw footer text
      ctx.fillStyle = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
      ctx.font = "bold 20px Inter";
      ctx.textAlign = "center";
      ctx.fillText(
        "Get CCReward App on Your Device",
        width / 2,
        maxHeight - footerHeight + 30
      );

      ctx.font = "16px Inter";
      ctx.fillStyle = theme.palette.mode === "dark" ? "#aaaaaa" : "#666666";
      ctx.fillText(
        "Download the app to maximize your credit card rewards on the go!",
        width / 2,
        maxHeight - footerHeight + 60
      );

      // Add App Store and Google Play buttons
      const appStoreLogo = new Image();
      appStoreLogo.crossOrigin = "anonymous";
      appStoreLogo.src =
        theme.palette.mode === "dark"
          ? "https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/d6909a96-9073-4189-84ea-54475d93ac00/public"
          : "https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/60ca24d3-0052-4177-4da7-ce7fc0d24a00/public";

      const googlePlayLogo = new Image();
      googlePlayLogo.crossOrigin = "anonymous";
      googlePlayLogo.src =
        "https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/9a793092-57c3-41e6-15d3-9801d75ae900/public";

      await new Promise((resolve) => {
        appStoreLogo.onload = resolve;
      });
      await new Promise((resolve) => {
        googlePlayLogo.onload = resolve;
      });

      const buttonWidth = 150;
      const buttonHeight = 45;
      const buttonGap = 20;
      const buttonsStartY = maxHeight - footerHeight + 80;

      ctx.drawImage(
        appStoreLogo,
        width / 2 - buttonWidth - buttonGap / 2,
        buttonsStartY,
        buttonWidth,
        buttonHeight
      );
      ctx.drawImage(
        googlePlayLogo,
        width / 2 + buttonGap / 2,
        buttonsStartY,
        buttonWidth,
        buttonHeight
      );

      const imageData = finalCanvas.toDataURL("image/png");
      setShareUrl(imageData);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAndShare = async (action) => {
    if (!shareUrl) {
      setIsGenerating(true);
      try {
        await generateImage();
      } catch (error) {
        console.error("Error generating image:", error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    }
    
    // If action is 'preview', just generate the image without sharing
    if (action === 'preview') {
      return;
    }
    
    // Execute the sharing action if we have a URL and it's not a preview
    if (shareUrl && action !== 'preview') {
      handleSocialShare(action);
    }
  };

  useImperativeHandle(ref, () => ({
    generateAndShare,
    generateImage
  }), [generateImage, generateAndShare]);

  useEffect(() => {
    if (cards && cardImagesData) {
      const processed = cards
        .map((card) => {
          const cardDetails = cardImagesData.find(
            (item) =>
              item.bank.toLowerCase() === card.bank.toLowerCase() &&
              item.cardName.toLowerCase() === card.cardName.toLowerCase()
          );
          return {
            ...card,
            imageId: cardDetails?.id,
          };
        })
        .filter((card) => card.imageId);

      setProcessedCards(processed);
    }
  }, [cards, cardImagesData]);

  return null;
});

PortfolioShare.displayName = 'PortfolioShare';

export default PortfolioShare;