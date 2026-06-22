"use client";

import { Suspense } from "react";
import { EmbeddedTweet, TweetNotFound, TweetSkeleton, useTweet } from "react-tweet";
import { Box, Typography, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Loading placeholder that mimics a tweet card shape.
 */
const TweetLoading = () => (
  <Box
    sx={{
      minHeight: "200px",
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      bgcolor: "background.paper",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Skeleton variant="circular" width={48} height={48} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={16} />
      </Box>
    </Box>
    <Skeleton width="100%" height={16} />
    <Skeleton width="90%" height={16} />
    <Skeleton width="70%" height={16} />
  </Box>
);

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

const TweetContainer = ({ tweetUrl }) => {
  const theme = useTheme();

  const getTweetId = (url) => {
    if (!url) return null;
    const matches = url.match(/status\/(\d+)/);
    return matches ? matches[1] : null;
  };

  const tweetId = getTweetId(tweetUrl);

  if (!tweetId) return null;

  return (
    <Box
      className={theme.palette.mode}
      data-theme={theme.palette.mode}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        p: 2,
        "& .react-tweet-theme": {
          "--tweet-container-margin": "0",
          "--tweet-font-family": "inherit",
          "--tweet-bg-color": theme.palette.background.paper,
          "--tweet-border-color": theme.palette.divider,
          "--tweet-text-color": theme.palette.text.primary,
          "--tweet-link-color": theme.palette.primary.main,
        },
        "& img": {
          maxWidth: "100%",
          height: "auto",
        },
      }}
    >
      <Suspense fallback={<TweetLoading />}>
        <TweetContent tweetId={tweetId} />
      </Suspense>
    </Box>
  );
};

export default TweetContainer;
