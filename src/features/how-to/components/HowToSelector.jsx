import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const HowToSelector = ({
  platforms,
  availableTopics,
  selectedPlatform,
  selectedTopic,
  onPlatformChange,
  onTopicChange,
  isLoading,
  isMini = false,
  showLabels = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // If in mini mode, render a more compact selector
  if (isMini) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: 1,
          width: isMobile ? "100%" : "auto",
        }}
      >
        {showLabels && (
          <Typography
            variant="body2"
            sx={{
              mr: 1,
              fontWeight: 500,
              whiteSpace: "nowrap",
              color: "text.secondary",
            }}
          >
            Platform:
          </Typography>
        )}

        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 120 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        >
          <Select
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
              },
            }}
            displayEmpty={!selectedPlatform}
          >
            {!selectedPlatform && (
              <MenuItem value="" disabled>
                Select Platform
              </MenuItem>
            )}
            {Object.values(platforms).map((platform) => {
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
                  <Icon sx={{ fontSize: 20 }} />
                  {platform.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {showLabels && (
          <Typography
            variant="body2"
            sx={{
              mr: 1,
              fontWeight: 500,
              whiteSpace: "nowrap",
              color: "text.secondary",
            }}
          >
            Topic:
          </Typography>
        )}

        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 180 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          disabled={!selectedPlatform || isLoading}
        >
          <Select
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            displayEmpty={!selectedTopic}
          >
            {!selectedTopic && (
              <MenuItem value="" disabled>
                {!selectedPlatform
                  ? "Select platform first"
                  : availableTopics.length === 0
                  ? "No topics available"
                  : "Select topic"}
              </MenuItem>
            )}
            {availableTopics.map((topic) => (
              <MenuItem key={topic.id} value={topic.id}>
                {topic.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 3,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
          borderRadius: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            Platform:
          </Typography>

          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <FormControl
              sx={{
                width: "100%",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <Select
                value={selectedPlatform}
                onChange={(e) => onPlatformChange(e.target.value)}
                displayEmpty
                size="small"
              >
                <MenuItem value="" disabled>
                  Select Platform
                </MenuItem>
                {Object.values(platforms).map((platform) => (
                  <MenuItem
                    key={platform.id}
                    value={platform.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {React.createElement(platform.icon, {
                      style: { fontSize: 24 },
                    })}
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            Topic:
          </Typography>

          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <FormControl
              sx={{ width: "100%" }}
              disabled={!selectedPlatform || isLoading}
            >
              <Select
                value={selectedTopic}
                onChange={(e) => onTopicChange(e.target.value)}
                displayEmpty
                size="small"
              >
                <MenuItem value="" disabled>
                  {!selectedPlatform
                    ? "Select platform first"
                    : availableTopics.length === 0
                    ? "No topics available"
                    : "Select topic"}
                </MenuItem>
                {availableTopics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="body2">{topic.title}</Typography>
                      {topic.difficulty && (
                        <Typography variant="caption" sx={{
                          color: "text.secondary"
                        }}>
                          Difficulty: {topic.difficulty} • Est. Time:{" "}
                          {topic.estimatedTime}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

HowToSelector.propTypes = {
  platforms: PropTypes.object.isRequired,
  availableTopics: PropTypes.array.isRequired,
  selectedPlatform: PropTypes.string,
  selectedTopic: PropTypes.string,
  onPlatformChange: PropTypes.func.isRequired,
  onTopicChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isMini: PropTypes.bool,
  showLabels: PropTypes.bool,
};

HowToSelector.defaultProps = {
  availableTopics: [],
  isLoading: false,
  isMini: false,
  showLabels: true,
};

export default HowToSelector;
