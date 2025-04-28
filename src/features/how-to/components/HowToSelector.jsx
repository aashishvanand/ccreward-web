import React from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Skeleton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const HowToSelector = ({ 
  platforms, 
  availableTopics,
  selectedPlatform, 
  selectedTopic, 
  onPlatformChange, 
  onTopicChange,
  isLoading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: 2,
        p: 3,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
        width: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto',
          flexGrow: isMobile ? 1 : 0
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mr: 2, 
              fontWeight: 500,
              whiteSpace: 'nowrap',
              color: 'text.secondary'
            }}
          >
            Platform:
          </Typography>
          
          {isLoading ? (
            <Skeleton variant="rectangular" width={200} height={40} />
          ) : (
            <FormControl 
              sx={{ 
                width: isMobile ? '100%' : 200,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    {platform.icon && (
                      <Box 
                        component="img"
                        src={platform.icon}
                        alt={platform.name}
                        sx={{ width: 24, height: 24 }}
                      />
                    )}
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto',
          flexGrow: 1
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mr: 2, 
              fontWeight: 500,
              whiteSpace: 'nowrap',
              color: 'text.secondary'
            }}
          >
            Topic:
          </Typography>
          
          {isLoading ? (
            <Skeleton variant="rectangular" width={isMobile ? '100%' : 300} height={40} />
          ) : (
            <FormControl 
              sx={{ width: isMobile ? '100%' : 300 }}
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
                    ? 'Select platform first' 
                    : availableTopics.length === 0 
                      ? 'No topics available' 
                      : 'Select topic'
                  }
                </MenuItem>
                {availableTopics.map((topic) => (
                  <MenuItem 
                    key={topic.id} 
                    value={topic.id}
                  >
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Typography variant="body2">{topic.title}</Typography>
                      {topic.difficulty && (
                        <Typography variant="caption" color="text.secondary">
                          Difficulty: {topic.difficulty} • Est. Time: {topic.estimatedTime}
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
  isLoading: PropTypes.bool
};

HowToSelector.defaultProps = {
  availableTopics: [],
  isLoading: false
};

export default HowToSelector;