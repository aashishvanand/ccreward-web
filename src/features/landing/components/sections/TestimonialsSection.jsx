import React from "react";
import { Box, Container, Typography, Grid, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TweetContainer from "./TweetContainer";

const TestimonialsSection = ({
  visibleTweets,
  handlePrevPage,
  handleNextPage,
  isMobile,
}) => {
  return (
    <Box sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Recommended by the X Community
        </Typography>

        <Box sx={{ position: "relative", px: { xs: 4, sm: 6, md: 8 } }}>
          <IconButton
            onClick={handlePrevPage}
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

          <Grid container spacing={3} sx={{ width: "100%", margin: "0 auto" }}>
            {visibleTweets.map((tweet, index) => {
              // Extract tweet ID from URL for a unique key
              const tweetId = tweet.url.split("/").pop();
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={tweetId || `tweet-${index}`}
                >
                  <TweetContainer tweetUrl={tweet.url} />
                </Grid>
              );
            })}
          </Grid>

          <IconButton
            onClick={handleNextPage}
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
