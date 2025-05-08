import { useState, useRef, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { motion, AnimatePresence } from "framer-motion";

const CalculationResults = ({ result, isLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    result && (result.points > 0 || result.cashback > 0 || result.miles > 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2 
      }
    }
  };

  // Celebration animations when rewards are high
  const celebrationVariants = {
    hidden: { scale: 0, rotate: -10, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        delay: 0.3
      }
    }
  };

  // Loading spinner animation
  const spinnerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        yoyo: Infinity,
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <Paper
          elevation={3}
          sx={[
            {
              p: 2,
              mt: 2,
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative"
            },
            hasRewards
              ? {
                  bgcolor: "success.light",
                }
              : {
                  bgcolor: "error.light",
                },
          ]}
        >
          {isLoading ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", py: 2 }}
            >
              <motion.div
                variants={spinnerVariants}
                initial="hidden"
                animate="visible"
              >
                <CircularProgress />
              </motion.div>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {hasRewards && (
                  <>
                    <motion.div
                      style={{
                        position: "absolute",
                        left: 10,
                        top: -5
                      }}
                      variants={celebrationVariants}
                    >
                      <Typography variant="h4">🎉</Typography>
                    </motion.div>
                    <motion.div
                      style={{
                        position: "absolute",
                        right: 10,
                        top: -5
                      }}
                      variants={celebrationVariants}
                    >
                      <Typography variant="h4">🎉</Typography>
                    </motion.div>
                  </>
                )}
                
                <Typography
                  ref={textRef}
                  variant="h6"
                  align="center"
                  color="textPrimary"
                  onClick={toggleExpand}
                  sx={[
                    {
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      cursor: "pointer",
                      maxWidth: "calc(100% - 40px)",
                      transition: "all 0.3s ease",
                    },
                    expanded
                      ? {}
                      : {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                  ]}
                >
                  {hasRewards ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {result.rewardText}
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      😢 No rewards earned 😢
                    </motion.span>
                  )}
                </Typography>
                
                {(isMobile || isOverflowing) && (
                  <Tooltip title={expanded ? "Collapse" : "Expand"}>
                    <IconButton size="small" onClick={toggleExpand} sx={{ ml: 1 }}>
                      {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

export default CalculationResults;