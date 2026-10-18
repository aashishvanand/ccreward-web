"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegion } from "@/core/providers/RegionContext";
import { bankPath, cardPath } from "@/core/utils/slug";
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
      router.replace(cardPath(regionSlug, bank, card));
    } else if (bank) {
      router.replace(bankPath(regionSlug, bank));
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
