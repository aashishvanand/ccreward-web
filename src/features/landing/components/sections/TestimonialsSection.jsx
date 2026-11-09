"use client";

import { useReducedMotion } from "framer-motion";
import { Box, Container, Typography, Grid, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Pause, PlayArrow } from "@mui/icons-material";
import TweetContainer from "./TweetContainer";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { m, AnimatePresence } from "framer-motion";

const TestimonialsSection = ({
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  isMobile,
  autoplayAvailable = false,
  isAutoplayStopped = false,
  onToggleAutoplay,
  onHoverChange,
  onFocusChange,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Focus moving between elements inside the carousel shouldn't resume autoplay
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange?.(false);
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Recommended by the X Community
        </Typography>

        <Box
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={handleBlur}
          sx={{ position: "relative", px: { xs: 4, sm: 6, md: 8 } }}
        >
          <IconButton
            onClick={handlePrevPage}
            aria-label="Previous testimonials"
            sx={{
              position: "absolute",
              left: { xs: -8, sm: -16, md: -24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <AnimatePresence mode="wait">
            <m.div
              key={visibleTweets[0]?.url || "empty"}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
            >
              <Grid
                container
                spacing={3}
                sx={{ width: "100%", margin: "0 auto" }}
              >
                {visibleTweets.map((tweet, index) => {
                  // Extract tweet ID from URL for a unique key
                  const tweetId = tweet.url.split("/").pop();
                  return (
                    <Grid
                      key={tweetId || `tweet-${index}`}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <m.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: prefersReducedMotion ? 0 : index * 0.1,
                          duration: prefersReducedMotion ? 0 : 0.3,
                        }}
                      >
                        <ErrorBoundary 
                          componentName="TweetContainer"
                          fallback={
                            <Box sx={{ 
                              p: 4, 
                              minHeight: '200px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              bgcolor: 'background.paper',
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              color: 'text.secondary'
                            }}>
                              <Typography variant="body2">Tweet could not be loaded.</Typography>
                            </Box>
                          }
                        >
                          <TweetContainer tweetUrl={tweet.url} />
                        </ErrorBoundary>
                      </m.div>
                    </Grid>
                  );
                })}
              </Grid>
            </m.div>
          </AnimatePresence>

          <IconButton
            onClick={handleNextPage}
            aria-label="Next testimonials"
            sx={{
              position: "absolute",
              right: { xs: -8, sm: -16, md: -24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {autoplayAvailable && onToggleAutoplay && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <IconButton
              onClick={onToggleAutoplay}
              aria-label={isAutoplayStopped ? "Resume testimonial autoplay" : "Pause testimonial autoplay"}
              size="small"
              sx={{ border: 1, borderColor: "divider" }}
            >
              {isAutoplayStopped ? <PlayArrow fontSize="small" /> : <Pause fontSize="small" />}
            </IconButton>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
