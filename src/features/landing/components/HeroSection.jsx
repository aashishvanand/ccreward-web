"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import HeroCard from "./HeroCard";
import SignInButtons from "@/shared/components/auth/SignInButtons";
import { useAuth } from "@/core/providers/AuthContext";

const HeroSection = ({
  cardImages,
  isMobile,
  isTablet,
  isLargeScreen,
  onGoogleSignIn,
  onAppleSignIn,
  isLoading,
}) => {
  const theme = useTheme();
  const { user, loading } = useAuth();

  return (
    <Box
      sx={{
        bgcolor: "transparent",
        // Vars + scheme-scoped rule: one stylesheet is correct in both modes
        background: (theme) => ({
          background: `radial-gradient(circle at 50% 0%, rgba(${theme.vars.palette.primary.lightChannel} / 0.082) 0%, transparent 50%), ${theme.vars.palette.background.default}`,
          ...theme.applyStyles('dark', {
            background: `radial-gradient(circle at 50% 0%, rgba(${theme.vars.palette.primary.darkChannel} / 0.125) 0%, transparent 50%), ${theme.vars.palette.background.default}`,
          }),
        }),
        minHeight: { md: "80vh" },
        display: "flex",
        alignItems: "center",
        pt: { xs: 8, md: 0 },
        pb: { xs: 8, md: 0 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Grid
          container
          spacing={{ xs: 4, md: 6, lg: 8 }}
          sx={{ alignItems: "center", minHeight: { md: "60vh" } }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4.5rem" },
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.1,
                background: (theme) => ({
                  background: `linear-gradient(90deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.secondary.main} 100%)`,
                  ...theme.applyStyles('dark', {
                    background: `linear-gradient(90deg, ${theme.vars.palette.primary.light} 0%, ${theme.vars.palette.secondary.light} 100%)`,
                  }),
                }),
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Maximize Your Rewards with the Right Credit Card
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: { md: "36rem" },
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
              }}
            >
              Compare cards, calculate rewards, and find the perfect credit card
              for your spending habits.
            </Typography>
            {!loading && !user ? (
              <Box sx={{ mt: 4, maxWidth: 320 }}>
                <SignInButtons
                  onGoogleSignIn={onGoogleSignIn}
                  onAppleSignIn={onAppleSignIn}
                  isLoading={isLoading}
                  fullWidth
                  size="large"
                />
              </Box>
            ) : null}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                height: { xs: 300, sm: 400, md: "50vh" },
                width: "100%",
                maxWidth: { xs: 320, sm: 400, md: "100%" },
                margin: "0 auto",
              }}
            >
              {cardImages.map((card, index) => (
                <HeroCard
                  key={card.id}
                  card={card}
                  index={index}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  isLargeScreen={isLargeScreen}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
