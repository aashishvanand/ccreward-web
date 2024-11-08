import { Box, Container, Typography, Grid, Card } from "@mui/material";
import Image from "next/image";
import bankImagesData from "../../../../shared/constants/bankImages";

const BankSection = () => {
  return (
    <Box sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Supported Banks
        </Typography>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {bankImagesData.map((bank) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={bank.id}>
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
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BankSection;
