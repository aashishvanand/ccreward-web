import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";

const AppStoreSection = ({ isMobile, theme }) => {
  return (
    <Box sx={{ bgcolor: "background.paper", py: 8 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Get CCReward App on Your Device
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: "600px",
              mb: 6,
              color: "text.secondary",
            }}
          >
            Download the app to maximize your credit card rewards on the go!
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              mb: 4,
              width: "100%",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <AppStoreButton
              href="https://apps.apple.com/in/app/ccreward/id6736835206"
              imageId={
                theme.palette.mode === "dark"
                  ? "d6909a96-9073-4189-84ea-54475d93ac00"
                  : "60ca24d3-0052-4177-4da7-ce7fc0d24a00"
              }
              alt="Download on the App Store"
            />
            <AppStoreButton
              href="https://play.google.com/store/apps/details?id=app.ccreward"
              imageId="9a793092-57c3-41e6-15d3-9801d75ae900"
              alt="Get it on Google Play"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const AppStoreButton = ({ href, imageId, alt }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      transition: "transform 0.3s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
      },
      display: "flex",
      alignItems: "center",
    }}
  >
    <Image
      src={imageId}
      alt={alt}
      width={200}
      height={60}
      style={{ objectFit: "contain" }}
    />
  </Box>
);

export default AppStoreSection;
