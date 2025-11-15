import React, { useState, useEffect, useMemo } from "react";
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
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SwapHoriz as SwapHorizIcon,
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

// Icon mapping based on theme and region
const CCREWARD_ICONS = {
  light: {
    dollar: "cceba9aa-3612-4b9c-bb28-b751cf9e3d00", // ccreward_light_dollar.webp
    rupee: "74a7a71f-9603-4843-cbb9-366d30bc8800", // ccreward_light_rupee.webp
  },
  dark: {
    dollar: "9577f34c-20ab-4932-80cb-9306bbc32000", // ccreward_dark_dollar.webp
    rupee: "31538947-9523-4088-85e6-15010a4d7a00", // ccreward_dark_rupee.webp
  },
};

// Region to currency mapping
const REGION_CURRENCY_MAP = {
  IN: "rupee",
  SG: "dollar",
  // Add more regions as needed
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 8,
    },
  },
  tap: { scale: 0.95 },
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [cardCount, setCardCount] = useState(0);

  // Get the appropriate CCReward icon based on theme and region
  const ccrewardIconId = useMemo(() => {
    const currency = REGION_CURRENCY_MAP[region] || "dollar"; // Default to dollar if region not found
    return CCREWARD_ICONS[mode]?.[currency] || CCREWARD_ICONS.light.dollar; // Fallback to light dollar
  }, [mode, region]);

  // Generate the icon URL
  const ccrewardIconUrl = useMemo(() => {
    return `https://imagedelivery.net/o7c7-WjKE1zaslpSuiAT5w/${ccrewardIconId}/public`;
  }, [ccrewardIconId]);

  useEffect(() => {
    setDeviceInfo(detectDevice());
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const updateCardCount = async () => {
        try {
          const userCards = await getCardsForUser(user.uid);
          setCardCount(userCards.length);
        } catch (error) {
          console.error("Error fetching user cards:", error);
          setCardCount(0);
        }
      };

      updateCardCount();

      const unsubscribe = onCardUpdate(updateCardCount);
      return () => unsubscribe();
    } else {
      setCardCount(0);
    }
  }, [isAuthenticated, user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCardCount(0);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (isMobile) {
      handleMenuClose();
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: HomeIcon,
      description: "Main dashboard",
    },
    {
      label: "Reward Calculator",
      path: "/calculator",
      icon: CalculateIcon,
      description: "Calculate rewards",
    },
    {
      label: "Transfer Calculator",
      path: "/transfer-calculator",
      icon: SwapHorizIcon,
      description: "Calculate point transfers",
    },
    ...(isAuthenticated
      ? [
          {
            label: "My Cards",
            path: "/my-cards",
            icon: CreditCard,
            badge: cardCount,
            description: "Manage your cards",
          },
        ]
      : []),
    {
      label: "Best Cards",
      path: "/best-card",
      icon: StarsIcon,
      description: "Top recommendations",
    },
  ];

  const renderNavItems = () => {
    return navItems.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.path);

      return (
        <Tooltip
          key={item.path}
          title={item.description}
          arrow
          placement="bottom"
        >
          <Button
            component={Link}
            href={item.path}
            color="inherit"
            startIcon={
              item.badge ? (
                <Badge
                  badgeContent={item.badge}
                  color="secondary"
                  max={99}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Icon />
                </Badge>
              ) : (
                <Icon />
              )
            }
            sx={{
              mx: 0.5,
              px: 2,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: active ? 600 : 400,
              backgroundColor: active
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
              color: active ? "inherit" : "rgba(255, 255, 255, 0.8)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "inherit",
                transform: "translateY(-1px)",
              },
            }}
          >
            {item.label}
          </Button>
        </Tooltip>
      );
    });
  };

  const renderMobileMenu = () => {
    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 200,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            backdropFilter: "blur(10px)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <MenuItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                py: 1.5,
                px: 2,
                backgroundColor: active
                  ? "rgba(25, 118, 210, 0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              <ListItemIcon>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="secondary" max={99}>
                    <Icon color={active ? "primary" : "inherit"} />
                  </Badge>
                ) : (
                  <Icon color={active ? "primary" : "inherit"} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: active ? 600 : 400,
                  color: active ? "primary.main" : "text.primary",
                }}
              />
            </MenuItem>
          );
        })}

        <Box sx={{ borderTop: 1, borderColor: "divider", mt: 1, pt: 1 }}>
          <MenuItem onClick={toggleTheme} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText
              primary={`${mode === "dark" ? "Light" : "Dark"} Mode`}
            />
          </MenuItem>

          {isAuthenticated && (
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          )}
        </Box>
      </Menu>
    );
  };

  return (
    <motion.div variants={headerVariants} initial="hidden" animate="visible">
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(25, 118, 210, 0.9)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Logo Section */}
          <motion.div variants={logoVariants} whileHover="hover" whileTap="tap">
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                mr: 3,
              }}
            >
              {/* Dynamic CCReward Icon */}
              <Box
                component="img"
                src={ccrewardIconUrl}
                alt="ccreward"
                sx={{
                  height: { xs: 32, sm: 36 },
                  width: "auto",
                  mr: 1.5,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  background:
                    "linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                ccreward
              </Typography>
            </Box>
          </motion.div>

          {/* Region Selector */}
          <RegionSelector />

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {renderNavItems()}

              {/* Theme Toggle */}
              <Tooltip
                title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
                arrow
              >
                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  sx={{
                    ml: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "rotate(180deg)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              {/* Logout Button for Desktop */}
              {isAuthenticated && (
                <Tooltip title="Logout" arrow>
                  <IconButton
                    onClick={handleLogout}
                    color="inherit"
                    sx={{
                      ml: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Mobile Menu */}
          {isMobile && renderMobileMenu()}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default Header;
