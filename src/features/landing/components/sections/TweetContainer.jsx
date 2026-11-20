"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import TweetLoading from "./TweetLoading";
import { useTheme } from "@mui/material/styles";
import { useAppTheme } from "@/core/providers/ThemeRegistry";

const TweetContent = dynamic(() => import("./TweetContent"), {
  ssr: false,
  loading: () => <TweetLoading />,
});

const TweetContainer = ({ tweetUrl }) => {
  const theme = useTheme();
  // react-tweet needs the resolved mode ('light'/'dark') as a value, not CSS
  const { resolvedMode } = useAppTheme();
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
      className={resolvedMode}
      data-theme={resolvedMode}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        p: 2,
        "& .react-tweet-theme": {
          "--tweet-container-margin": "0",
          "--tweet-font-family": "inherit",
          "--tweet-bg-color": theme.vars.palette.background.paper,
          "--tweet-border-color": theme.vars.palette.divider,
          "--tweet-text-color": theme.vars.palette.text.primary,
          "--tweet-link-color": theme.vars.palette.primary.main,
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
