import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  Tooltip,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PlayCircle as PlayIcon,
  FullscreenExit as MinimizeIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const VideoTutorial = ({
  videoUrl,
  title,
  description,
  thumbnail,
  platformColor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Validate YouTube URL
  const validateYouTubeUrl = (url) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  // Convert regular YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!validateYouTubeUrl(url)) return null;

    let embedUrl = url;
    if (url.includes("watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
    }

    // Add autoplay and other parameters
    return `${embedUrl}?autoplay=1&modestbranding=1&rel=0`;
  };

  // Extract video ID from URL
  const getVideoId = (url) => {
    if (!url) return null;

    const idMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^\/\?\&]+)/
    );
    return idMatch && idMatch[1] ? idMatch[1] : null;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    console.warn("Invalid YouTube URL provided");
    return null;
  }

  // Get high-quality thumbnail URL
  const getThumbnailUrl = (id) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  const handleOpenVideo = () => setIsOpen(true);
  const handleCloseVideo = () => setIsOpen(false);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        my: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1.5,
          textAlign: "center",
          fontWeight: "medium",
          color: platformColor || theme.palette.primary.main,
          fontSize: { xs: "1rem", sm: "1.25rem" },
        }}
      >
        {title || "Video Tutorial"}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2,
            textAlign: "center",
            maxWidth: 600,
            fontSize: "0.875rem"
          }}>
          {description}
        </Typography>
      )}
      <Paper
        elevation={2}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 700,
          paddingTop: "56.25%", // 16:9 aspect ratio
          borderRadius: isMobile ? 1.5 : 2,
          overflow: "hidden",
          cursor: "pointer",
          mx: "auto",
        }}
        onClick={handleOpenVideo}
      >
        <Box
          component="img"
          src={thumbnail || getThumbnailUrl(videoId)}
          alt={`${title} Tutorial Thumbnail`}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="lazy"
        />

        {/* Semi-transparent overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.2)",
            transition: "background-color 0.3s ease",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.4)",
            },
          }}
        />

        {/* Play button */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="Play video"
            sx={{
              color: "white",
              bgcolor: platformColor || "rgba(0,0,0,0.7)",
              p: isMobile ? 0.5 : 1,
              mb: 1,
              "&:hover": {
                bgcolor: platformColor
                  ? `${platformColor}CC`
                  : "rgba(0,0,0,0.8)",
              },
            }}
          >
            <PlayIcon sx={{ fontSize: isMobile ? 48 : 60 }} />
          </IconButton>
        </Box>
      </Paper>
      <Dialog
        open={isOpen}
        onClose={handleCloseVideo}
        maxWidth="lg"
        fullWidth
        fullScreen={isFullscreen || isMobile}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "black",
              position: "relative",
              overflow: "hidden",
              borderRadius: isFullscreen || isMobile ? 0 : 2,
              m: isMobile ? 0 : 2,
            },
          }
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1000,
            display: "flex",
            gap: 1,
          }}
        >
          {!isMobile && (
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                sx={{
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.8)",
                  },
                }}
                size="small"
              >
                {isFullscreen ? <MinimizeIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Close">
            <IconButton
              onClick={handleCloseVideo}
              aria-label="Close video"
              sx={{
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.8)",
                },
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <DialogContent sx={{ p: 0, height: "100%" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <iframe
              width="100%"
              height={isFullscreen || isMobile ? "100%" : "56.25vw"} // 16:9 aspect ratio
              src={embedUrl}
              title={title || "Video Tutorial"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: "none",
                maxHeight: isFullscreen || isMobile ? "100vh" : "80vh",
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

VideoTutorial.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  thumbnail: PropTypes.string,
  platformColor: PropTypes.string,
};

VideoTutorial.defaultProps = {
  title: "Tutorial Video",
  description: "",
  thumbnail: null,
};

export default VideoTutorial;
