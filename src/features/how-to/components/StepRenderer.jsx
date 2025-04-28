import React from "react";
import { Box, Typography, Paper, Stack, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const StepRenderer = ({ steps, videoUrl, platformColor, isMobile, region }) => {
  const theme = useTheme();

  // Function to get the correct image URL with region-specific support
  const getImageUrl = (imageId) => {
    if (!imageId) return null;
  
    // Check if the image ID already contains the full URL to avoid duplication
    if (imageId.includes("http")) {
      try {
        const parsedUrl = new URL(imageId);
        // Only allow specific trusted domains
        if (parsedUrl.host === "imagedelivery.net") {
          return imageId;
        }
        // If domain doesn't match, fall through to the default path
      } catch (e) {
        // If imageId is not a valid URL or parsing fails, proceed with the existing logic
        console.warn("Invalid URL format for image:", imageId);
      }
    }
  
    // Check if there's a region-specific image ID format
    const regionSpecificId =
      region && imageId.includes(":")
        ? imageId.split(":")[region === "SG" ? 1 : 0]
        : imageId;
  
    // Create the proper URL, use different width for mobile
    return `https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${regionSpecificId}/${
      isMobile ? "width=320" : "width=640"
    }`;
  };

  const getImageStyle = (step) => {
    // Check if this is a full-screen screenshot
    if (step.fullScreenImage) {
      return {
        width: "100%",
        height: "auto",
        objectFit: "contain",
        maxHeight: { xs: "400px", sm: "500px" },
      };
    }

    // Default styling for regular images
    return {
      objectFit: "cover",
      height: "100%",
      width: "100%",
    };
  };

  const getImageContainerStyle = (step) => {
    // For full-screen images, constrain height but keep aspect ratio
    if (step.fullScreenImage) {
      return {
        width: "100%",
        maxHeight: { xs: "400px", sm: "500px" },
        position: "relative",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 1,
        mb: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      };
    }

    // For regular images, use fixed height
    return {
      width: "100%",
      height: { xs: 180, sm: 220 },
      position: "relative",
      borderRadius: 1,
      overflow: "hidden",
      boxShadow: 1,
      mb: 1,
    };
  };

  return (
    <Stack spacing={2.5} sx={{ width: "100%" }}>
      {steps.map((step) => (
        <Paper
          key={step.number}
          elevation={1}
          sx={{
            width: "100%",
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: platformColor || theme.palette.primary.main,
            },
          }}
        >
          <Box sx={{ 
            p: { xs: 1.5, sm: 2.5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "flex-start"
          }}>
            {/* Step number and description column */}
            <Box 
              sx={{ 
                flex: "1 1 auto", 
                pr: { xs: 0, sm: 2 },
                width: { xs: "100%", sm: "auto" }
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: platformColor || theme.palette.primary.main,
                    color: "#fff",
                    fontWeight: "bold",
                    mr: 1.5,
                    fontSize: "0.875rem",
                  }}
                >
                  {step.number}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "medium",
                    lineHeight: 1.3,
                    fontSize: { xs: "1rem", sm: "1.125rem" },
                  }}
                >
                  {step.description}
                </Typography>
              </Box>

              {step.details && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Bank-Specific Message Patterns:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {step.details.map((detail, index) => (
                      <Box component="li" key={index} sx={{ mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {detail}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {step.tip && (
                <Box
                  sx={{
                    mt: 1,
                    mb: 1,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                    border: `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.875rem",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        mr: 1,
                        fontSize: "1rem",
                        lineHeight: 1,
                      }}
                    >
                      💡
                    </Box>
                    <Box component="span" sx={{ fontWeight: "medium" }}>
                      Tip:
                    </Box>
                    <Box component="span" sx={{ ml: 0.5 }}>
                      {step.tip}
                    </Box>
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Image column - right-aligned */}
            {step.image && (
              <Box
                sx={{
                  flex: "0 0 auto",
                  width: { 
                    xs: "100%", 
                    sm: step.fullScreenImage ? "45%" : "320px" 
                  },
                  mt: { xs: 2, sm: 0 },
                  alignSelf: { xs: "center", sm: "flex-start" },
                }}
              >
                <Box
                  sx={getImageContainerStyle(step)}
                >
                  <Box
                    component="img"
                    src={getImageUrl(step.image)}
                    alt={step.alt || `Step ${step.number}`}
                    sx={getImageStyle(step)}
                    loading="lazy"
                  />
                </Box>
                {step.caption && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", textAlign: "center" }}
                  >
                    {step.caption}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      ))}

      {videoUrl && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            paddingTop: "56.25%", // 16:9 aspect ratio
            overflow: "hidden",
            borderRadius: 2,
            boxShadow: 3,
            mt: 3,
          }}
        >
          <iframe
            src={videoUrl}
            title="Tutorial Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </Box>
      )}
    </Stack>
  );
};

StepRenderer.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string,
      alt: PropTypes.string,
      tip: PropTypes.string,
      caption: PropTypes.string,
      fullScreenImage: PropTypes.bool,
    })
  ).isRequired,
  videoUrl: PropTypes.string,
  platformColor: PropTypes.string,
  isMobile: PropTypes.bool,
  region: PropTypes.string,
};

StepRenderer.defaultProps = {
  isMobile: false,
  region: "IN",
};

export default StepRenderer;