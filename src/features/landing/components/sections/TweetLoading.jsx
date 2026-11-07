import { Box, Skeleton } from "@mui/material";

/**
 * Loading placeholder that mimics a tweet card shape.
 */
const TweetLoading = () => (
  <Box
    sx={{
      minHeight: "200px",
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      bgcolor: "background.paper",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Skeleton variant="circular" width={48} height={48} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={16} />
      </Box>
    </Box>
    <Skeleton width="100%" height={16} />
    <Skeleton width="90%" height={16} />
    <Skeleton width="70%" height={16} />
  </Box>
);

export default TweetLoading;
