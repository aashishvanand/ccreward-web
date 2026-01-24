import { Box, Container, Typography, Grid, Card } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRegion } from "@/core/providers/RegionContext";

const BankSection = () => {
  const { region, regionName, isInitialized } = useRegion();
  const [bankData, setBankData] = useState([]);
  
  useEffect(() => {
    if (region) {
      const url = region === 'SG' 
        ? 'https://files.ccreward.app/banks_sg.json'
        : 'https://files.ccreward.app/banks_in.json';
        
      fetch(url)
        .then(res => res.json())
        .then(data => setBankData(data))
        .catch(err => console.error("Failed to fetch bank data", err));
    }
  }, [region]);
  
  // Don't render if region is not initialized or bankData is empty
  if (!isInitialized || !region || bankData.length === 0) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Loading Banks...
          </Typography>
        </Container>
      </Box>
    );
  }
  
  // Select bank data based on region - already handled by state


  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Supported Banks {regionName}
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
                href={`/${encodeURIComponent(region.toLowerCase())}/bank/${encodeURIComponent(bank.bank.toLowerCase())}`}
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
                      src={bank.id}
                      alt={`${bank.bank.toUpperCase()} logo`}
                      width={80}
                      height={80}
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