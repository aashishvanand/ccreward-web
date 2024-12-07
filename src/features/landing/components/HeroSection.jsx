import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import HeroCard from "./HeroCard";

const HeroSection = ({
  cardImages,
  isMobile,
  isTablet,
  isLargeScreen,
  handleSignIn,
  isLoading,
  isAuthenticated,
  loading,
  signInWithGoogle,
  signInAnonymously,
}) => (
  <Box
    sx={{
      bgcolor: "background.default",
      minHeight: { md: "60vh" }, // Set minimum height for desktop
      display: "flex",
      alignItems: "center",
      pt: { xs: 4, md: 0 }, // Remove top padding on desktop
      pb: { xs: 4, md: 0 }, // Remove bottom padding on desktop
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Container maxWidth="lg" sx={{ width: "100%" }}>
      <Grid
        container
        spacing={{ xs: 4, md: 6, lg: 8 }}
        alignItems="center"
        sx={{ minHeight: { md: "60vh" } }} // Ensure grid takes full height
      >
        <Grid item xs={12} md={6}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.75rem" },
              fontWeight: "bold",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Maximize Your Rewards with the Right Credit Card
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              mb: 4,
              fontSize: { xs: "1.125rem", md: "1.5rem" },
              lineHeight: 1.4,
            }}
          >
            Compare cards, calculate rewards, and find the perfect credit card
            for your spending habits.
          </Typography>
          {!loading && !isAuthenticated && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => handleSignIn(signInWithGoogle)}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                sx={{
                  height: 48,
                  px: 4,
                  fontSize: "1.125rem",
                }}
              >
                Sign in with Google
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleSignIn(signInAnonymously)}
                disabled={isLoading}
                sx={{
                  height: 48,
                  px: 4,
                  fontSize: "1.125rem",
                }}
              >
                Continue Anonymously
              </Button>
            </Stack>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              height: { xs: 300, sm: 400, md: "50vh" }, // Adjust height for desktop
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

export default HeroSection;
