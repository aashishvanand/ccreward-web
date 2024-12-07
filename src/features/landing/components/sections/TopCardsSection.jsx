import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useCardCategories from "../../../../core/hooks/useCardCategories";

const categoryNames = [
  "Education",
  "Entertainment",
  "Food & Dining",
  "Government/Tax",
  "Groceries",
  "Healthcare & Medical",
  "Insurance",
  "International Spends",
  "Jwellery",
  "Offline Shopping",
  "Online Shopping",
  "Petrol",
  "Travel & Transportation",
  "Utility Bill",
  "Wallet Loading",
];

const TopCardsSection = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { categories, isLoading, error } = useCardCategories();

  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 4;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(categoryNames.length / itemsPerPage);
  const visibleCategories = categoryNames.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error">
          Error loading categories. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Top Credit Cards in India
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              mb: 4,
            }}
          >
            Discover the best credit cards for your spending needs across
            different categories
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/top-cards")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Explore Top Cards in India
          </Button>
        </Box>

        <Box sx={{ position: "relative", px: { xs: 4, sm: 6 } }}>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { xs: -8, sm: -16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "background.paper",
                opacity: 0.9,
                boxShadow: (theme) =>
                  `0 8px 16px ${theme.palette.primary.main}15`,
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <Grid container spacing={3}>
            {visibleCategories.map((categoryName) => {
              const category = categories?.[categoryName];
              if (!category) return null;

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={categoryName}
                  sx={{
                    display: "flex",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <Card
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        "& .MuiButton-root": {
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: "medium" }}
                      >
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {category.cards.length} cards available
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          router.push(
                            `/top-cards?category=${encodeURIComponent(
                              categoryName
                            )}`
                          )
                        }
                        className="MuiButton-root"
                        sx={{
                          transition: "all 0.3s ease-in-out",
                        }}
                      >
                        View Cards
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: -8, sm: -16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "background.paper",
                opacity: 0.9,
                boxShadow: (theme) =>
                  `0 8px 16px ${theme.palette.primary.main}15`,
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default TopCardsSection;
