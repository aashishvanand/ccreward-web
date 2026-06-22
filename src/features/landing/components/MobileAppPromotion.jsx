"use client";

import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import Image from "next/image";
import {
  getAppStoreUrl,
  getPlayStoreUrl,
} from "@/core/utils/deviceUtils";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";

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
        "66261793-c3fd-4631-5886-12aeb832f200",
        "732a2090-e94b-4897-89fa-804d31a31800",
        "8f508b1f-a5e6-4808-dcc9-be7e12788600",
        "924202b4-200d-4b0e-01bb-77128c8cdb00",
        "a4afaadf-1fda-417c-1a3e-ad1b6e789100",
        "bfd9d1cf-c210-4f24-20cf-bbc8d5e78a00",
        "9ec2fdcf-af33-4376-4ade-dfdf211f2b00",
        "c6646a5d-8012-41f2-7536-faecaece9100",
      ];

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4 },
        bgcolor: "transparent",
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
                src={buildCloudflareImageUrl(screenshot, "public")}
                alt={`App Screenshot ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
                unoptimized
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
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.875rem", sm: "1rem" }
            }}>
            Get the full experience with our app for{" "}
            {isAndroid ? "Android" : "iOS"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MobileAppPromotion;
