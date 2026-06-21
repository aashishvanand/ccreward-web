import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Fade,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
  Alert,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";
import StepRenderer from "./components/StepRenderer";
import VideoTutorial from "./components/VideoTutorial";
import HowToSelector from "./components/HowToSelector";
import { useRegion } from "../../core/providers/RegionContext";
import {
  Apple as AppleIcon,
  Android as AndroidIcon,
  Laptop as WebIcon,
} from "@mui/icons-material";
import { HELP_TOPICS } from "./constants/helpTopics";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

// Define platforms with MUI icons
const PLATFORMS = {
  IOS: {
    id: "ios",
    name: "iOS",
    icon: AppleIcon,
    description: "Guides for iPhone and iPad users",
  },
  ANDROID: {
    id: "android",
    name: "Android",
    icon: AndroidIcon,
    description: "Guides for Android smartphone and tablet users",
  },
  WEB: {
    id: "web",
    name: "Web",
    icon: WebIcon,
    description: "Guides for browser-based usage",
  },
};

// Define platform colors
const PLATFORM_COLORS = {
  ios: "#007AFF", // iOS blue
  android: "#3DDC84", // Android green
  web: "#FF7300", // Web orange
};

const HowToGuide = ({ initialGuidesData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { region } = useRegion();

  const [guidesData, setGuidesData] = useState(initialGuidesData || {});
  const [guidesLoaded, setGuidesLoaded] = useState(!!initialGuidesData);
  const [dataError, setDataError] = useState(null);

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [currentGuide, setCurrentGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [error, setError] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // Load guide data
  useEffect(() => {
    const loadGuideData = async () => {
      setGuidesLoaded(false);
      setDataError(null);

      const platforms = ["ios", "android", "web"];
      const currentRegion = region || "IN";
      const guides = {};

      try {
        await Promise.all(
          platforms.map(async (platform) => {
            try {
              const response = await axios.get(
                `https://files.ccreward.app/guides/${currentRegion.toLowerCase()}/${platform}-guides.json`
              );
              guides[platform] = response.data;
            } catch (err) {
              console.error(`Error loading ${platform} guides:`, err);
              // Create empty placeholder if guide data is missing
              guides[platform] = { platform, topics: [] };
            }
          })
        );

        setGuidesData(guides);
        setGuidesLoaded(true);
      } catch (err) {
        console.error("Error loading guide data:", err);
        setDataError("Failed to load guides. Please try again later.");
      }
    };

    loadGuideData();
  }, [region]);

  // Handle platform change
  const handlePlatformChange = (platform) => {
    setIsLoading(true);
    setSelectedPlatform(platform);

    // Reset topic selection when platform changes
    setSelectedTopic("");
    setShowGuide(false);

    // Get available topics for this platform
    if (platform && guidesData[platform]) {
      try {
        const platformGuides = guidesData[platform];
        const topicIds = platformGuides.topics.map((topic) => topic.id);

        // Filter HELP_TOPICS to only include those available for this platform
        const filteredTopics = Object.values(HELP_TOPICS).filter((topic) =>
          topicIds.includes(topic.id)
        );

        setAvailableTopics(filteredTopics);
        setError(null);
      } catch (err) {
        console.error("Error loading platform guides:", err);
        setError("Error loading guides for this platform. Please try again.");
        setAvailableTopics([]);
      }
    } else {
      setAvailableTopics([]);
    }

    setTimeout(() => setIsLoading(false), 300);
  };

  // Handle topic change
  const handleTopicChange = (topic) => {
    setIsLoading(true);
    setSelectedTopic(topic);
    setTimeout(() => {
      setIsLoading(false);
      if (topic) {
        setShowGuide(true);
      }
    }, 300);
  };

  // Update current guide when platform and topic are selected
  useEffect(() => {
    if (selectedPlatform && selectedTopic && guidesData[selectedPlatform]) {
      try {
        const platformGuides = guidesData[selectedPlatform];
        const guide = platformGuides.topics.find(
          (topic) => topic.id === selectedTopic
        );

        if (guide) {
          // Short delay to allow for nice animation
          setTimeout(() => {
            setCurrentGuide(guide);
            setError(null);
          }, 300);
        } else {
          setError("Guide not found for the selected topic.");
          setCurrentGuide(null);
        }
      } catch (err) {
        console.error("Error loading guide:", err);
        setError("Error loading the selected guide. Please try again.");
        setCurrentGuide(null);
      }
    } else {
      setCurrentGuide(null);
    }
  }, [selectedPlatform, selectedTopic, guidesData]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0 },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Get current platform color
  const getCurrentPlatformColor = () => {
    return selectedPlatform
      ? PLATFORM_COLORS[selectedPlatform]
      : theme.palette.primary.main;
  };

  // Get platform icon component
  const getPlatformIcon = (platformId) => {
    if (!platformId) return null;

    const platform = Object.values(PLATFORMS).find((p) => p.id === platformId);
    if (!platform) return null;

    const Icon = platform.icon;
    return <Icon sx={{ color: PLATFORM_COLORS[platformId] }} />;
  };

  // Show loading state while guides are being loaded
  if (!guidesLoaded && !dataError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CircularProgress />
        </Box>
        <Footer />
      </Box>
    );
  }

  // Show error state if guides failed to load
  if (dataError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            py: 4,
          }}
        >
          <Alert
            severity="error"
            sx={{
              maxWidth: 500,
              width: "100%",
            }}
          >
            {dataError}
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <title>How to Guide - CCReward</title>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "transparent",
        }}
      >
        <Header />

        <Container
          component="main"
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: { xs: 3, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AnimatePresence mode="wait">
            {!showGuide ? (
              <motion.div
                key="search-ui"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexGrow: 1,
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  align="center"
                  sx={{
                    mb: { xs: 3, md: 4 },
                    fontWeight: "bold",
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  How-To Guides
                </Typography>

                <Box
                  sx={{
                    maxWidth: 800,
                    width: "100%",
                    textAlign: "center",
                    mb: { xs: 4, md: 6 },
                  }}
                >
                  <motion.div variants={slideUp}>
                    {/* Both Desktop and Mobile layout - simplified */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "nowrap",
                        gap: 2,
                      }}
                    >
                      <Typography variant="h6" component="span">
                        I am using
                      </Typography>

                      <FormControl sx={{ minWidth: isMobile ? "100%" : 200 }}>
                        <Select
                          value={selectedPlatform}
                          onChange={(e) => handlePlatformChange(e.target.value)}
                          displayEmpty
                          sx={{
                            borderRadius: 2,
                            "& .MuiSelect-select": {
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              py: 1.5,
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Platform
                          </MenuItem>
                          {Object.values(PLATFORMS).map((platform) => {
                            const Icon = platform.icon;
                            return (
                              <MenuItem
                                key={platform.id}
                                value={platform.id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Icon
                                  sx={{
                                    fontSize: 24,
                                    color: PLATFORM_COLORS[platform.id],
                                  }}
                                />
                                {platform.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      {selectedPlatform && (
                        <>
                          <Typography variant="h6" component="span">
                            and I want to
                          </Typography>

                          <FormControl
                            sx={{ minWidth: isMobile ? "100%" : 240 }}
                            disabled={!selectedPlatform || isLoading}
                          >
                            <Select
                              value={selectedTopic}
                              onChange={(e) =>
                                handleTopicChange(e.target.value)
                              }
                              displayEmpty
                              sx={{
                                borderRadius: 2,
                                "& .MuiSelect-select": {
                                  py: 1.5,
                                },
                              }}
                            >
                              <MenuItem value="" disabled>
                                {!selectedPlatform
                                  ? "Select platform first"
                                  : isLoading
                                  ? "Loading..."
                                  : "Select topic"}
                              </MenuItem>
                              {availableTopics.map((topic) => (
                                <MenuItem key={topic.id} value={topic.id}>
                                  {topic.title}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </>
                      )}
                    </Box>
                  </motion.div>

                  {isLoading && (
                    <Box
                      sx={{ mt: 4, display: "flex", justifyContent: "center" }}
                    >
                      <CircularProgress
                        size={30}
                        sx={{ color: getCurrentPlatformColor() }}
                      />
                    </Box>
                  )}

                  {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    maxWidth: 800,
                    width: "100%",
                    opacity: 0.7,
                    mt: { xs: 2, md: 4 },
                  }}
                >
                  <Divider sx={{ mb: 3 }} />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ opacity: 0.8, px: 2 }}
                  >
                    Select your platform and what you'd like to learn about to
                    access our detailed step-by-step guides
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="guide-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: 1000,
                    mx: "auto",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: { xs: 2, sm: 1 },
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                        flexGrow: 1,
                      }}
                    >
                      How-To Guides
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      <HowToSelector
                        platforms={PLATFORMS}
                        availableTopics={availableTopics}
                        selectedPlatform={selectedPlatform}
                        selectedTopic={selectedTopic}
                        onPlatformChange={handlePlatformChange}
                        onTopicChange={handleTopicChange}
                        isLoading={isLoading}
                        isMini={true}
                      />
                    </Stack>
                  </Box>

                  {isLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6,
                      }}
                    >
                      <CircularProgress
                        sx={{ color: getCurrentPlatformColor() }}
                      />
                    </Box>
                  ) : currentGuide ? (
                    <Fade in={!!currentGuide}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: { xs: 2, sm: 3 },
                          borderRadius: 2,
                          overflow: "hidden",
                          borderTop: `4px solid ${getCurrentPlatformColor()}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: { xs: 1, sm: 0 },
                            }}
                          >
                            {getPlatformIcon(selectedPlatform)}
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "bold",
                                color: getCurrentPlatformColor(),
                                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                              }}
                            >
                              {currentGuide.title}
                            </Typography>
                          </Box>

                          {currentGuide.lastUpdated && (
                            <Box
                              component="span"
                              sx={{
                                fontSize: "0.75rem",
                                color: "text.secondary",
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                              }}
                            >
                              Updated: {currentGuide.lastUpdated}
                            </Box>
                          )}
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            mb: 3
                          }}>
                          {currentGuide.description}
                        </Typography>

                        <StepRenderer
                          steps={currentGuide.steps || []}
                          videoUrl={currentGuide.videoUrl}
                          platformColor={getCurrentPlatformColor()}
                          isMobile={isMobile}
                          region={region}
                        />

                        {/* Troubleshooting Section */}
                        {currentGuide.troubleshooting &&
                          currentGuide.troubleshooting.length > 0 && (
                            <>
                              <Divider sx={{ my: 3 }} />
                              <Typography
                                variant="h6"
                                sx={{
                                  mb: 2,
                                  fontWeight: "bold",
                                  color: getCurrentPlatformColor(),
                                  fontSize: { xs: "1rem", sm: "1.25rem" },
                                }}
                              >
                                Troubleshooting Tips
                              </Typography>
                              <Stack spacing={1.5}>
                                {currentGuide.troubleshooting.map(
                                  (tip, index) => (
                                    <Paper
                                      key={index}
                                      variant="outlined"
                                      sx={{
                                        p: 1.5,
                                        bgcolor:
                                          theme.palette.mode === "dark"
                                            ? "rgba(255, 255, 255, 0.05)"
                                            : "rgba(0, 0, 0, 0.02)",
                                        borderRadius: 1.5,
                                        borderLeft: `3px solid ${getCurrentPlatformColor()}`,
                                      }}
                                    >
                                      <Typography variant="body2">
                                        <Box
                                          component="span"
                                          sx={{ fontWeight: "bold", mr: 1 }}
                                        >
                                          {index + 1}.
                                        </Box>
                                        {tip}
                                      </Typography>
                                    </Paper>
                                  )
                                )}
                              </Stack>
                            </>
                          )}
                      </Paper>
                    </Fade>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography sx={{
                        color: "text.secondary"
                      }}>
                        {error || "Select a guide to view its content."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>

        <Footer />
      </Box>
    </motion.div>
  );
};

export default HowToGuide;
