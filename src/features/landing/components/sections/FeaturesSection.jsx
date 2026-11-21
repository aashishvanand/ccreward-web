"use client";

// src/features/landing/components/sections/FeaturesSection.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
} from "@mui/material";
import {
  Search as SearchIcon,
  Calculate as CalculateIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";

const features = [
  {
    icon: <SearchIcon />,
    title: "Compare Top Cards",
    description: "Compare cards from leading banks.",
  },
  {
    icon: <CalculateIcon />,
    title: "Reward Calculator",
    description:
      "Estimate your potential rewards without adding any personal card details.",
  },
  {
    icon: <BoltIcon />,
    title: "Merchant-Specific Rewards",
    description:
      "Find the best card for your favorite merchants based on cashback and rewards.",
  },
];

const FeaturesSection = ({ cardBg = "background.paper" }) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            mb: { xs: 6, md: 4 },
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: "text.primary", // Use theme color
          }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 4,
                  bgcolor: cardBg,
                  backgroundImage: "none",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: (theme) =>
                      `0 8px 24px ${theme.palette.primary.main}15`,
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    color: "primary.main", // Use theme color
                    fontSize: "2.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(feature.icon, { fontSize: "inherit" })}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: "medium", color: "text.primary" }} // Use theme color
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ color: "text.secondary" }} // Use theme color
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
