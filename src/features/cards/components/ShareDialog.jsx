import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Reddit as RedditIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const ShareDialog = ({ open, onClose, onShare, isGenerating }) => {
  const [imageGenerated, setImageGenerated] = useState(false);
  const [imageDownloaded, setImageDownloaded] = useState(false);

  // Only generate the image when dialog opens
  useEffect(() => {
    if (open && !isGenerating && !imageGenerated) {
      onShare('generate'); // New action type that only generates without downloading
      setImageGenerated(true);
    }
    
    // Reset states when dialog closes
    if (!open) {
      setImageGenerated(false);
      setImageDownloaded(false);
    }
  }, [open, isGenerating]);

  // Handle download with success state
  const handleDownload = async () => {
    if (!imageDownloaded) {
      await onShare('download');
      setImageDownloaded(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share Your Card Collection</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Step 1: Download your collection as image
            </Typography>
            {imageDownloaded && (
              <CheckCircleIcon color="success" sx={{ fontSize: 24 }} />
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={isGenerating ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={handleDownload}
            disabled={isGenerating || !imageGenerated}
            fullWidth
            color={imageDownloaded ? "success" : "primary"}
          >
            {isGenerating 
              ? "Generating Image..." 
              : !imageGenerated
              ? "Preparing Image..."
              : imageDownloaded 
                ? "Image Downloaded ✓"
                : "Download Collection"}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              fontStyle: 'italic'
            }}
          >
            {imageDownloaded 
              ? "Upload the downloaded collection when sharing!"
              : "Complete Step 1 to enable sharing options"}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;