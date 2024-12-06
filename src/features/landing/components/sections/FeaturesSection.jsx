import React from "react";
import { Box, Container, Typography, Grid, Card } from "@mui/material";
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

const FeaturesSection = () => (
  <Box 
    sx={{ 
      position: 'relative',
      minHeight: { md: "40vh" }, // Set minimum height for desktop
      display: "flex",
      alignItems: "center",
      py: { xs: 8, md: 0 }, // Remove padding on desktop
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: (theme) => `linear-gradient(0deg, ${theme.palette.primary.main}15 0%, ${theme.palette.background.default} 100%)`,
        opacity: 0.8,
        zIndex: 0
      }
    }}
  >
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom 
        sx={{ 
          mb: { xs: 6, md: 4 },
          fontSize: { xs: "2rem", md: "2.5rem" },
        }}
      >
        Key Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
                bgcolor: 'background.paper',
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}15`
                },
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  color: "primary.main",
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
                sx={{ fontWeight: "medium" }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{ color: "text.secondary" }}
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

export default FeaturesSection;