"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import TweetLoading from "./TweetLoading";
import { useTheme } from "@mui/material/styles";

const TweetContent = dynamic(() => import("./TweetContent"), {
  ssr: false,
  loading: () => <TweetLoading />,
});

const TweetContainer = ({ tweetUrl }) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Don't load react-tweet or fetch the tweet until it's about to be seen
  useEffect(() => {
    if (isNearViewport || !containerRef.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isNearViewport]);

  const getTweetId = (url) => {
    if (!url) return null;
    const matches = url.match(/status\/(\d+)/);
    return matches ? matches[1] : null;
  };

  const tweetId = getTweetId(tweetUrl);

  if (!tweetId) return null;

  return (
    <Box
      ref={containerRef}
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
      {isNearViewport ? <TweetContent tweetId={tweetId} /> : <TweetLoading />}
    </Box>
  );
};

export default TweetContainer;
