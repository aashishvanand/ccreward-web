"use client";

import Link from "next/link";
import { Box, Container, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";

function ToolsIndexPage({ tools }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, md: 5 }, flexGrow: 1 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: "1.75rem", sm: "2.25rem" } }}>
          Credit card tools
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Free tools to get more from the credit cards you have in India and Singapore.
        </Typography>
        <Grid container spacing={2}>
          {tools.map((t) => (
            <Grid key={t.slug} size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                <CardActionArea component={Link} href={`/tools/${t.slug}`} sx={{ height: "100%", alignItems: "flex-start" }}>
                  <CardContent>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                      {t.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {t.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}

export default ToolsIndexPage;
