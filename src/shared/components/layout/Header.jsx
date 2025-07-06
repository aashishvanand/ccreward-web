import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Calculate as CalculateIcon,
  CreditCard,
  Stars as StarsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../../../core/providers/AuthContext";
import { useAppTheme } from "../../../core/providers/ThemeRegistry";
import { useRegion } from "../../../core/providers/RegionContext";
import { getCardsForUser } from "../../../core/services/firebaseUtils";
import { onCardUpdate } from "../../../core/utils/events";
import { detectDevice } from "../../../core/utils/deviceUtils";
import RegionSelector from "./RegionSelector";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
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
  // ✅ REMOVED: Direct localStorage access for currentRegion
  // ✅ USE CONTEXT ONLY
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

  // ✅ REMOVED: All localStorage event listeners and region management
  // RegionContext handles this now

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
                ? "Add at least 2 cards to use this feature"
                : undefined,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  cursor: "pointer",
                }}
              >
                CCReward
              </Typography>
            </Link>
          </motion.div>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Region Selector */}
            <RegionSelector />

            {/* Theme Toggle */}
            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {!isMobile ? (
              // Desktop Navigation
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {menuItems.map((item) => (
                  <Tooltip key={item.label} title={item.tooltip || ""}>
                    <span>
                      <Button
                        component={Link}
                        href={item.href}
                        color="inherit"
                        disabled={item.disabled}
                        startIcon={item.icon}
                        sx={{
                          textTransform: "none",
                          "&.Mui-disabled": {
                            color: "text.disabled",
                          },
                        }}
                      >
                        {item.label === "My Cards" && userCardCount > 0 ? (
                          <Badge badgeContent={userCardCount} color="primary">
                            {item.label}
                          </Badge>
                        ) : (
                          item.label
                        )}
                      </Button>
                    </span>
                  </Tooltip>
                ))}

                {isAuthenticated() ? (
                  <Button
                    onClick={handleLogout}
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      component={Link}
                      href="/auth"
                      color="inherit"
                      startIcon={<LoginIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      Login
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              // Mobile Navigation
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  component={Link}
                  href={item.href}
                  onClick={handleMenuClose}
                  disabled={item.disabled}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>
                    {item.label === "My Cards" && userCardCount > 0 ? (
                      <Badge badgeContent={userCardCount} color="primary">
                        {item.label}
                      </Badge>
                    ) : (
                      item.label
                    )}
                  </ListItemText>
                </MenuItem>
              ))}

              <MenuItem
                onClick={isAuthenticated() ? handleLogout : () => router.push("/auth")}
              >
                <ListItemIcon>
                  {isAuthenticated() ? <LogoutIcon /> : <LoginIcon />}
                </ListItemIcon>
                <ListItemText>
                  {isAuthenticated() ? "Logout" : "Login"}
                </ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default Header;