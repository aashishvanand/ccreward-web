"use client";

import { Box, Container, Typography, Grid, Card } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRegion } from "@/core/providers/RegionContext";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";
import { bankPath } from "@/core/utils/slug";
import bankImagesIN from "@/data/bankImages_in.json";
import bankImagesSG from "@/data/bankImages_sg.json";

/**
 * region: "IN" | "SG" from the page (falls back to the visitor's region).
 * banksWithoutLogo: [{ bank, count }] banks with cards but no uploaded logo; they get a
 *   lettered tile in the same grid, so every bank page is linked from a tile.
 */
const BankSection = ({ region: regionProp, banksWithoutLogo = [], tileBg = "background.paper" }) => {
  const { region: contextRegion } = useRegion();
  const region = regionProp || contextRegion;
  const regionName = region === "SG" ? "in Singapore" : region === "IN" ? "in India" : "";
  const code = region === "SG" ? "sg" : "in";
  // Bundled at build time by scripts/fetch-static-data.js, so the logos render with the page
  const bankData = region === "SG" ? bankImagesSG : bankImagesIN;
  const banks = [
    ...bankData.map((b) => ({ key: b.id, bank: b.bank, imageId: b.id })),
    ...banksWithoutLogo.map((b) => ({ key: `nologo-${b.bank}`, bank: b.bank, imageId: null })),
  ].sort((a, b) => a.bank.localeCompare(b.bank, undefined, { sensitivity: "base" }));

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Supported Banks{regionName ? ` ${regionName}` : ""}
        </Typography>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {banks.map((bank) => (
            <Grid
              key={bank.key}
              size={{
                xs: 6,
                sm: 4,
                md: 3,
                lg: 2
              }}
            >
              <Link 
                href={bankPath(code, bank.bank)}
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
                    bgcolor: tileBg,
                    backgroundImage: "none",
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
                    {bank.imageId ? (
                      <Image
                        src={buildCloudflareImageUrl(bank.imageId, "public")}
                        alt={`${bank.bank.toUpperCase()} logo`}
                        width={80}
                        height={80}
                        unoptimized
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      // No logo uploaded for this bank yet: lettered placeholder
                      <Box
                        aria-hidden="true"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.75rem",
                          fontWeight: 700,
                          color: "primary.main",
                          bgcolor: (theme) =>
                            `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
                          border: 1,
                          borderColor: (theme) =>
                            `rgba(${theme.vars.palette.primary.mainChannel} / 0.3)`,
                        }}
                      >
                        {bank.bank.charAt(0).toUpperCase()}
                      </Box>
                    )}
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
