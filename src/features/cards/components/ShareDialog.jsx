import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Reddit as RedditIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const ShareDialog = ({ open, onClose, onShare, isGenerating }) => {
  const [imageGenerated, setImageGenerated] = useState(false);
  const [imageDownloaded, setImageDownloaded] = useState(false);
  const [error, setError] = useState(null);
  const [generationTimeout, setGenerationTimeout] = useState(false);

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (open) {
      setImageGenerated(false);
      setImageDownloaded(false);
      setError(null);
      setGenerationTimeout(false);
    }
  }, [open]);

  // Handle generation timeout
  useEffect(() => {
    let timeoutId;
    if (open && isGenerating) {
      timeoutId = setTimeout(() => {
        setGenerationTimeout(true);
        setError("Image generation is taking longer than expected. Please try again.");
      }, 30000); // 30 second timeout
    }
    return () => clearTimeout(timeoutId);
  }, [open, isGenerating]);

  // Only generate the image when dialog opens
  useEffect(() => {
    if (open && !isGenerating && !imageGenerated && !error) {
      const generateImage = async () => {
        try {
          await onShare("generate");
          setImageGenerated(true);
          setError(null);
        } catch (err) {
          console.error("Error generating image:", err);
          setError("Failed to generate image. Please try again.");
        }
      };
      generateImage();
    }
  }, [open, isGenerating, imageGenerated, error]);

  // Handle download with error handling
  const handleDownload = async () => {
    if (!imageDownloaded) {
      try {
        await onShare("download");
        setImageDownloaded(true);
        setError(null);
      } catch (err) {
        console.error("Error downloading image:", err);
        setError("Failed to download image. Please try again.");
      }
    }
  };

  // Handle retry
  const handleRetry = () => {
    setImageGenerated(false);
    setImageDownloaded(false);
    setError(null);
    setGenerationTimeout(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share Your Card Collection</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : null}

        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Step 1: Download your collection as image
            </Typography>
            {imageDownloaded && (
              <CheckCircleIcon color="success" sx={{ fontSize: 24 }} />
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={
              isGenerating ? <CircularProgress size={20} /> : <DownloadIcon />
            }
            onClick={handleDownload}
            disabled={isGenerating || !imageGenerated || Boolean(error)}
            fullWidth
            color={imageDownloaded ? "success" : "primary"}
          >
            {isGenerating
              ? generationTimeout 
                ? "Generation Taking Long..."
                : "Generating Image..."
              : !imageGenerated
              ? "Preparing Image..."
              : imageDownloaded
              ? "Image Downloaded ✓"
              : "Download Collection"}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Step 2: Choose where to share
            </Typography>
            {!imageDownloaded && (
              <Typography variant="caption" color="text.secondary">
                (Download image first)
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
              opacity: imageDownloaded ? 1 : 0.5,
            }}
          >
            {[
              { icon: <TwitterIcon />, name: "twitter", label: "Twitter" },
              { icon: <FacebookIcon />, name: "facebook", label: "Facebook" },
              { icon: <RedditIcon />, name: "reddit", label: "Reddit" },
              { icon: <WhatsAppIcon />, name: "whatsapp", label: "WhatsApp" },
              { icon: <TelegramIcon />, name: "telegram", label: "Telegram" },
            ].map((platform) => (
              <Button
                key={platform.name}
                variant="outlined"
                startIcon={platform.icon}
                onClick={() => onShare(platform.name)}
                disabled={!imageDownloaded}
                sx={{
                  minWidth: "140px",
                  height: "48px",
                  flexGrow: 1,
                  flexBasis: "140px",
                }}
              >
                {platform.label}
              </Button>
            ))}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              opacity: imageDownloaded ? 1 : 0.7,
              fontStyle: "italic",
            }}
          >
            {imageDownloaded
              ? "Upload the downloaded collection when sharing!"
              : "Complete Step 1 to enable sharing options"}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;