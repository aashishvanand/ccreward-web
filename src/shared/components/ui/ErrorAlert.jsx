"use client";

import { useEffect } from "react";
import { Alert, Collapse, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const alertVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.9,
    transition: { 
      duration: 0.2 
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -45 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 20,
      delay: 0.2
    }
  },
  hover: { 
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 10
    }
  },
  tap: { scale: 0.9 }
};

const ErrorAlert = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Disappear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {Boolean(message) && (
        <motion.div
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <Alert
            severity="error"
            slots={{
              root: "div",
              icon: "span",
            }}
            action={
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={onClose}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </motion.div>
            }
            sx={{ 
              mb: 2,
              boxShadow: 2,
              borderRadius: 1.5,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: "error.main",
                zIndex: 0
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: {
                  delay: 0.1,
                  duration: 0.3
                }
              }}
            >
              {message}
            </motion.div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorAlert;