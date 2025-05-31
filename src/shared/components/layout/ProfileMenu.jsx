import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
// For motion components
import { motion } from 'framer-motion';

// For AnimatePresence
import { AnimatePresence } from 'framer-motion';

const ProfileMenu = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  // Custom framer motion variants
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: -20,
      transformOrigin: "top right" 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transformOrigin: "top right",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -20,
      transformOrigin: "top right",
      transition: { 
        duration: 0.2 
      }
    }
  };

  // User avatar animation
  const avatarVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <>
      <motion.div
        variants={avatarVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <IconButton
          onClick={handleClick}
          size="small"
          edge="end"
          aria-label="account menu"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          color="inherit"
          sx={{
            p: 0,
            width: 32,
            height: 32,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {user?.photoURL ? (
            <Avatar
              src={user.photoURL}
              alt={user.displayName || user.email}
              sx={{
                width: 32,
                height: 32,
              }}
            />
          ) : (
            <AccountCircle sx={{ width: 32, height: 32 }} />
          )}
        </IconButton>
      </motion.div>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 320,
              maxWidth: "90vw",
              borderRadius: 2,
              overflow: "visible",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
              // This makes the Menu component use our custom animation
              '& .MuiPaper-root': {
                background: 'transparent',
                boxShadow: 'none'
              }
            },
          },
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                background: 'inherit',
                borderRadius: 'inherit',
                boxShadow: 'inherit'
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <Avatar
                      src={user?.photoURL}
                      alt={user?.displayName || user?.email}
                      sx={{
                        width: 80,
                        height: 80,
                        mb: 1,
                        border: 1,
                        borderColor: "divider",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {user?.displayName || "User"}
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        wordBreak: "break-all",
                        maxWidth: "100%",
                      }}
                    >
                      {user?.email || ""}
                    </Typography>
                  </motion.div>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ p: 1 }}>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign out</ListItemText>
                  </MenuItem>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Menu>
    </>
  );
};

export default ProfileMenu;