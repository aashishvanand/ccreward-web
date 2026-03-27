"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegion } from "@/core/providers/RegionContext";
import { Box, CircularProgress } from "@mui/material";

export default function ExplorePage() {
  const router = useRouter();
  const { region, isInitialized } = useRegion();

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams(window.location.search);
    const bank = params.get("bank");
    const card = params.get("card");
    const regionSlug = (region || "in").toLowerCase();

    if (bank && card) {
      router.replace(`/${regionSlug}/bank/${encodeURIComponent(bank)}/${encodeURIComponent(card)}`);
    } else if (bank) {
      router.replace(`/${regionSlug}/bank/${encodeURIComponent(bank)}`);
    } else {
      router.replace(`/${regionSlug}`);
    }
  }, [isInitialized, region, router]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
