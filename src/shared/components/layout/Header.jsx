// src/shared/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { useRegion } from "../../../core/providers/RegionContext";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  CreditCard,
  DarkMode,
  LightMode,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Calculate as CalculateIcon,
  Menu as MenuIcon,
  Stars as StarsIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from "../../../core/providers/ThemeRegistry";
import { useAuth } from "../../../core/providers/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCardsForUser } from "../../../core/services/firebaseUtils";
import { onCardUpdate } from "../../../core/utils/events";
import { detectDevice } from "../../../core/utils/deviceUtils";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import RegionSelector from "./RegionSelector";

// Animation variants
const appBarVariants = {
  hidden: { y: -60 },
  visible: { 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: 0.1,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    }
  }
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  },
  tap: { scale: 0.98 }
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  },
  hover: { 
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 8
    }
  },
  tap: { scale: 0.95 }
};

function Header() {
  const { mode, toggleTheme } = useAppTheme();
  const { region } = useRegion();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isAndroid: false,
    isIOS: false,
    isTablet: false,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userCardCount, setUserCardCount] = useState(0);
  const isHomePage = pathname === "/";
  const [currentRegion, setCurrentRegion] = useState(() => localStorage.getItem("app-region")
  );

  useEffect(() => {
    const updateRegionFromStorage = () => {
      const storedRegion = localStorage.getItem("app-region");
      setCurrentRegion(storedRegion);
    };

    // Listen for storage events (if another tab changes localStorage)
    window.addEventListener("storage", updateRegionFromStorage);

    // Listen for our custom event
    const handleRegionChanged = () => {
      updateRegionFromStorage();
    };
    window.addEventListener("region-changed", handleRegionChanged);

    return () => {
      window.removeEventListener("storage", updateRegionFromStorage);
      window.removeEventListener("region-changed", handleRegionChanged);
    };
  }, []);

  useEffect(() => {
    setDeviceInfo(detectDevice());
  }, []);

  useEffect(() => {
    const fetchUserCardCount = async () => {
      if (user) {
        try {
          const userCards = await getCardsForUser(user.uid);
          setUserCardCount(userCards.length);
        } catch (error) {
          console.error("Error fetching user cards:", error);
        }
      }
    };

    fetchUserCardCount();
    const unsubscribe = onCardUpdate(fetchUserCardCount);
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Home", icon: <HomeIcon />, href: "/" },
    ...(isAuthenticated()
      ? [
          { label: "Calculator", icon: <CalculateIcon />, href: "/calculator" },
          { label: "My Cards", icon: <CreditCard />, href: "/my-cards" },
          {
            label: "Best Card",
            icon: <StarsIcon />,
            href: "/best-card",
            disabled: userCardCount < 2,
            tooltip:
              userCardCount < 2
                ? "Add at least two cards to use this feature"
                : "",
          },
        ]
      : []),
  ];

  const renderMenuItems = () => {
    return menuItems.map(
      (item) =>
        pathname !== item.href && (
          <motion.div
            key={item.label}
            variants={menuItemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              href={item.href}
              disabled={item.disabled}
            >
              {item.icon}
              <Typography sx={{ ml: 1 }}>{item.label}</Typography>
            </MenuItem>
          </motion.div>
        )
    );
  };

  // Now render based on device type
  if (deviceInfo.isAndroid || deviceInfo.isIOS) {
    return (
      <motion.div
        variants={appBarVariants}
        initial="hidden"
        animate="visible"
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <motion.div variants={logoVariants} whileHover="hover" whileTap="tap">
              <Typography
                variant="h6"
                component="div"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Box sx={{ position: "relative", width: 40, height: 40, mr: 1 }}>
                  <Image
                    src={
                      mode === "dark"
                        ? "f4bf16b1-527e-4d80-47b4-99989a1ded00"
                        : "b6c3c6f1-a744-4e47-8c50-4c33c84c3900"
                    }
                    alt="CCReward Logo"
                    width={40}
                    height={40}
                    priority
                  />
                </Box>
                CCReward
              </Typography>
            </motion.div>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <motion.div variants={itemVariants}>
                <RegionSelector currentRegion={currentRegion} />
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ rotate: 180, transition: { duration: 0.5 } }}>
                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  aria-label="toggle theme"
                >
                  {mode === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </motion.div>
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>
    );
  }

  const LogoContent = () => (
    <>
      <Box sx={{ position: "relative", width: 40, height: 40, mr: 1 }}>
        <Image
          src={
            mode === "dark"
              ? "f4bf16b1-527e-4d80-47b4-99989a1ded00"
              : "b6c3c6f1-a744-4e47-8c50-4c33c84c3900"
          }
          alt="CCReward Logo"
          width={40}
          height={40}
          priority
        />
      </Box>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 500,
        }}
      >
        CCReward
      </Typography>
    </>
  );

  return (
    <motion.div
      variants={appBarVariants}
      initial="hidden"
      animate="visible"
    >
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            "& .MuiButton-root": {
              ml: 2,
            },
            "& .MuiAvatar-root": {
              ml: 2,
              width: 40,
              height: 40,
            },
          }}
        >
          {isHomePage ? (
            <motion.div 
              variants={logoVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LogoContent />
              </Box>
            </motion.div>
          ) : (
            <motion.div 
              variants={logoVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Box
                component={Link}
                href="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <LogoContent />
              </Box>
            </motion.div>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <motion.div variants={itemVariants}>
              <RegionSelector />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ rotate: 180, transition: { duration: 0.5 } }}
            >
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                aria-label="toggle theme"
              >
                {mode === "dark" ? <LightMode /> : <DarkMode />}
              </IconButton>
            </motion.div>

            {isMobile ? (
              <>
                <motion.div variants={itemVariants}>
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                  >
                    <MenuIcon />
                  </IconButton>
                </motion.div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  slots={{
                    root: "div",
                    backdrop: "div",
                  }}
                >
                  <AnimatePresence>
                    {Boolean(anchorEl) && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        variants={{
                          hidden: {},
                          visible: {
                            transition: {
                              staggerChildren: 0.05,
                              delayChildren: 0.1
                            }
                          }
                        }}
                      >
                        {renderMenuItems()}
                        {isAuthenticated() && (
                          <motion.div
                            variants={menuItemVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <MenuItem onClick={handleLogout}>
                              <LogoutIcon />
                              <Typography sx={{ ml: 1 }}>Logout</Typography>
                            </MenuItem>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Menu>
              </>
            ) : (
              <>
                {menuItems.map(
                  (item) =>
                    pathname !== item.href && (
                      <Tooltip key={item.label} title={item.tooltip || ""} arrow>
                        <Box>
                          <motion.div 
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              color="inherit"
                              startIcon={item.icon}
                              component={Link}
                              href={item.href}
                              sx={{ ml: 2 }}
                              disabled={item.disabled}
                            >
                              {item.label}
                            </Button>
                          </motion.div>
                        </Box>
                      </Tooltip>
                    )
                )}

                {user && (
                  <motion.div variants={itemVariants}>
                    <ProfileMenu user={user} onLogout={handleLogout} />
                  </motion.div>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default Header;