import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import Image from "next/image";
import {
  getAppStoreUrl,
  getPlayStoreUrl,
} from "../../../core/utils/deviceUtils";

const MobileAppPromotion = ({ isAndroid }) => {
  const theme = useTheme();
  const screenshots = isAndroid
    ? [
        "f8cfbf48-0e82-4095-89d8-3dbbd9406700",
        "e89a3c45-b747-4fc5-ae82-9afbc7112800",
        "9c347c88-aff4-4d98-2e05-3b5271de9f00",
        "0f7a22f5-00aa-457d-212f-2490e22ea900",
      ]
    : [
        "439c672a-a623-4006-dbc0-147d773a6300",
        "5efcffce-4ba7-46ce-54ca-2803b2291c00",
        "f48ef214-901e-437d-5c5c-b7b8820e5900",
      ];

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4 },
        bgcolor: "background.default",
        borderRadius: { xs: "16px 16px 0 0", sm: "24px 24px 0 0" },
        position: "relative",
        zIndex: 1,
        mt: -2,
        mb: { xs: 4, sm: 5 },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            gap: { xs: 3, sm: 4 },
            overflowX: "auto",
            pb: 3,
            mb: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 3 },
            "&::-webkit-scrollbar": { display: "none" },
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch", // Fixed kebab-case
            "& > *:not(:last-child)": {
              mr: { xs: 2, sm: 3 },
            },
          }}
        >
          {screenshots.map((screenshot, index) => (
            <Box
              key={index}
              sx={{
                flexShrink: 0,
                width: { xs: "240px", sm: "280px" },
                height: { xs: "480px", sm: "560px" },
                position: "relative",
                scrollSnapAlign: "center",
                borderRadius: { xs: "16px", sm: "24px" },
                overflow: "hidden",
                boxShadow: theme.shadows[4],
                flexBasis: { xs: "240px", sm: "280px" },
                minWidth: { xs: "240px", sm: "280px" },
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

        <Box
          sx={{
            textAlign: "center",
            px: { xs: 3, sm: 4 },
            mt: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Button
            variant="contained"
            size="large"
            href={isAndroid ? getPlayStoreUrl() : getAppStoreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              height: { xs: 48, sm: 56 },
              width: "100%",
              maxWidth: "280px",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              borderRadius: "28px",
            }}
          >
            {isAndroid ? "Get it on Google Play" : "Download on App Store"}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Get the full experience with our app for{" "}
            {isAndroid ? "Android" : "iOS"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MobileAppPromotion;
