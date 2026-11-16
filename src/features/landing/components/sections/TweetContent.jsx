"use client";

// react-tweet lives in its own chunk: TweetContainer loads this file only when
// the testimonials scroll near the viewport.
import { EmbeddedTweet, useTweet } from "react-tweet";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import TweetLoading from "./TweetLoading";

/**
 * Fallback when a tweet cannot be loaded.
 */
const TweetError = () => (
  <Box
    sx={{
      p: 4,
      minHeight: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "background.paper",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      color: "text.secondary",
    }}
  >
    <Typography variant="body2">Tweet could not be loaded.</Typography>
  </Box>
);

/**
 * Inner component that uses the useTweet SWR hook for client-side fetching.
 */
const TweetContent = ({ tweetId }) => {
  const { data, error, isLoading } = useTweet(tweetId);

  if (isLoading) return <TweetLoading />;
  if (error || !data) return <TweetError />;

  return <EmbeddedTweet tweet={data} />;
};

TweetContent.propTypes = {
  tweetId: PropTypes.string.isRequired,
};

export default TweetContent;
