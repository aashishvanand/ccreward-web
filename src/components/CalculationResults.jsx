import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CalculationResults = ({ result, isLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isTextOverflowing =
          textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsOverflowing(isTextOverflowing);
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        resizeObserver.unobserve(textRef.current);
      }
    };
  }, [result]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const hasRewards =
    result &&
    (result.points > 0 || result.cashback > 0 || result.miles > 0);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        width: '100%',
        bgcolor: hasRewards ? 'success.light' : 'error.light',
        borderRadius: 2,
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              ref={textRef}
              variant="h6"
              align="center"
              color="textPrimary"
              fontWeight="bold"
              onClick={toggleExpand}
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                cursor: 'pointer',
                maxWidth: 'calc(100% - 40px)',
                ...(expanded
                  ? {}
                  : {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }),
              }}
            >
              {hasRewards ? (
                <>
                  🎉 {result.rewardText} 🎉
                </>
              ) : (
                <>😢 No rewards earned 😢</>
              )}
            </Typography>
            {(isMobile || isOverflowing) && (
              <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
                <IconButton size="small" onClick={toggleExpand} sx={{ ml: 1 }}>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default CalculationResults;
