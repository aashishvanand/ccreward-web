import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import Image from "next/image";
import {
  getAppStoreUrl,
  getPlayStoreUrl,
} from "../../../core/utils/deviceUtils";

const MobileAppPromotion = ({
  isAndroid,
  androidScreenshots = [
    "f8cfbf48-0e82-4095-89d8-3dbbd9406700",
    "e89a3c45-b747-4fc5-ae82-9afbc7112800",
    "9c347c88-aff4-4d98-2e05-3b5271de9f00",
    "0f7a22f5-00aa-457d-212f-2490e22ea900",
  ],
  iosScreenshots = [
    "439c672a-a623-4006-dbc0-147d773a6300",
    "5efcffce-4ba7-46ce-54ca-2803b2291c00",
    "f48ef214-901e-437d-5c5c-b7b8820e5900",
  ],
}) => {
  const theme = useTheme();
  const screenshots = isAndroid ? androidScreenshots : iosScreenshots;

  return (
    <Box
      sx={{
        py: 4,
        bgcolor: "background.default",
        borderRadius: "24px 24px 0 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            mb: 4,
            px: 2,
            "&::-webkit-scrollbar": { display: "none" },
            scrollSnapType: "x mandatory",
          }}
        >
          {screenshots.map((screenshot, index) => (
            <Box
              key={index}
              sx={{
                flexShrink: 0,
                width: "280px",
                height: "560px",
                position: "relative",
                scrollSnapAlign: "center",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: theme.shadows[4],
              }}
            >
              <Image
                src={screenshot}
                alt={`App Screenshot ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
              />
            </Box>
          ))}
        </Box>

        <Box sx={{ textAlign: "center", px: 2 }}>
          <Button
            variant="contained"
            size="large"
            href={isAndroid ? getPlayStoreUrl() : getAppStoreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              height: 56,
              width: "100%",
              maxWidth: 280,
              fontSize: "1.1rem",
              borderRadius: "28px",
              mb: 2,
            }}
          >
            {isAndroid ? "Get it on Google Play" : "Download on App Store"}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Get the full experience with our app for{" "}
            {isAndroid ? "Android" : "iOS"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MobileAppPromotion;
