"use client";

import { Box, Container, Typography, Grid, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TweetContainer from "./TweetContainer";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
// For motion components
import { motion } from "framer-motion";

// For AnimatePresence
import { AnimatePresence } from "framer-motion";

const TestimonialsSection = ({
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  isMobile,
}) => {
  // Temporary: completely hide the tweet section to bypass react-tweet crashing errors
  return null;

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Recommended by the X Community
        </Typography>

        <Box sx={{ position: "relative", px: { xs: 4, sm: 6, md: 8 } }}>
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
            <motion.div
              key={visibleTweets[0]?.url || "empty"} // Use the first tweet URL as key
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
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
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.3,
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
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </motion.div>
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
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
