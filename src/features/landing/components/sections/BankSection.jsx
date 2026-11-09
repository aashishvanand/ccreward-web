"use client";

import { Box, Container, Typography, Grid, Card } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRegion } from "@/core/providers/RegionContext";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";
import { bankPath } from "@/core/utils/slug";
import bankImagesIN from "@/data/bankImages_in.json";
import bankImagesSG from "@/data/bankImages_sg.json";

const BankSection = () => {
  const { region, regionName } = useRegion();
  // Bundled at build time by scripts/fetch-static-data.js, so the logos render with the page
  const bankData = region === "SG" ? bankImagesSG : bankImagesIN;

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Supported Banks{region ? ` ${regionName}` : ""}
        </Typography>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {bankData.map((bank) => (
            <Grid
              key={bank.id}
              size={{
                xs: 6,
                sm: 4,
                md: 3,
                lg: 2
              }}
            >
              <Link 
                href={bankPath(region === 'SG' ? 'sg' : 'in', bank.bank)}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Image
                      src={buildCloudflareImageUrl(bank.id, "public")}
                      alt={`${bank.bank.toUpperCase()} logo`}
                      width={80}
                      height={80}
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Typography variant="subtitle2" align="center">
                    {bank.bank.toUpperCase()}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BankSection;
