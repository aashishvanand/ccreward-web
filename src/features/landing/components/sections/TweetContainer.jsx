import React from "react";
import { Tweet } from "react-tweet";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tweets } from "../../../../shared/constants/testimonials";

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
        minHeight: "400px",
        p: 2,
        "& .react-tweet-theme": {
          "--tweet-container-margin": "0",
          "--tweet-font-family": "inherit",
          "--tweet-bg-color": theme.palette.background.paper,
          "--tweet-border-color": theme.palette.divider,
          "--tweet-text-color": theme.palette.text.primary,
          "--tweet-link-color": theme.palette.primary.main,
        },
        // Add styles for static images
        "& img": {
          maxWidth: "100%",
          height: "auto",
        },
      }}
    >
      <Tweet
        id={tweetId}
        components={{
          AvatarImg: (props) => (
            <img
              {...props}
              loading="lazy"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "24px",
              }}
            />
          ),
          MediaImg: (props) => (
            <img
              {...props}
              loading="lazy"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          ),
        }}
      />
    </Box>
  );
};

export default TweetContainer;
