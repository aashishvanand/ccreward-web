import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  X as XIcon,
} from "@mui/icons-material";

const TestimonialsSection = ({
  visibleTweets,
  handlePrevPage,
  handleNextPage,
}) => {
  return (
    <Box sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Recommended by the X Community
        </Typography>
        <Box sx={{ position: "relative", px: { xs: 4, sm: 6, md: 8 } }}>
          {/* Previous button */}
          <IconButton
            onClick={handlePrevPage}
            sx={{
              position: "absolute",
              left: { xs: -8, sm: -16, md: -24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            {visibleTweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </Grid>

          {/* Next button */}
          <IconButton
            onClick={handleNextPage}
            sx={{
              position: "absolute",
              right: { xs: -8, sm: -16, md: -24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

const TweetCard = ({ tweet }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={tweet.avatar}
            alt={tweet.author}
            sx={{ mr: 2, width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {tweet.author}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {tweet.handle}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
          {tweet.content}
        </Typography>
        <Button
          variant="outlined"
          href={tweet.url}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          sx={{
            mt: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          View on <XIcon sx={{ fontSize: 16 }} />
        </Button>
      </CardContent>
    </Card>
  </Grid>
);

export default TestimonialsSection;
