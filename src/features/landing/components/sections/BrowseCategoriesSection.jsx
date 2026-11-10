"use client";

import Link from "next/link";
import { Box, Container, Typography, Chip } from "@mui/material";
import { categoryPath } from "@/core/utils/slug";

/**
 * Links to every "best cards for <category>" page for the region.
 * region: "IN" | "SG"; categories: category names (route keys) for that region.
 */
const BrowseCategoriesSection = ({ region, categories = [] }) => {
  if (!categories.length) return null;
  const code = region === "SG" ? "sg" : "in";
  const countryName = region === "SG" ? "Singapore" : "India";

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
          Best Cards by Category
        </Typography>
        <Typography align="center" sx={{ color: "text.secondary", mb: 4, maxWidth: 640, mx: "auto" }}>
          See which credit cards in {countryName} earn the most where you spend.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
          {categories.map((name) => (
            <Chip
              key={name}
              component={Link}
              href={categoryPath(code, name)}
              clickable
              label={name}
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: "0.95rem", py: 2.25, px: 0.5 }}
            />
          ))}
          <Chip
            component={Link}
            href={`/${code}/top-cards`}
            clickable
            label="All categories"
            color="primary"
            sx={{ fontWeight: 600, fontSize: "0.95rem", py: 2.25, px: 0.5 }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default BrowseCategoriesSection;
