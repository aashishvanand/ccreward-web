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
        "ce5efd9d-6027-4ab0-6248-05e4d09f3600",
        "f2cf43a3-8bad-44b4-58d3-a7bb0383bf00",
        "dd338f12-a709-4e82-a8e0-0eff777b2100",
        "801a4c01-01f5-4564-e73b-9a77f46ce500",
        "3a8dc462-51ce-4367-8292-1e1ae594da00",
        "46f32a7a-d554-4897-deaa-440d69df4800",
        "970ac62d-57cf-4638-4aa6-9a2c351aaa00",
        "2ccc7b3f-acda-4147-25f1-2b5806bce500",
      ]
    : [
        "cc11f2c9-1423-4cf8-cc35-dd3264ac0600",
        "75b6651c-dee3-497a-6f8f-b3dcf6d88100",
        "ac414eb8-1f97-4178-5c22-6c1a9b2cf400",
        "cc0ec534-3d57-4b87-7b43-426510ad1c00",
        "16f92704-1e8a-43f1-77a0-380dfd407e00",
        "d66ff993-81c8-4de8-3a50-0f62d0700800",
        "e1300447-5ee8-400b-38ff-60a202621500",
        "3dc86490-32bf-4560-6bf5-97766ebe4a00",
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
