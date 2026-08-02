"use client";

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
  Avatar,
  Divider,
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
  Login as LoginIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Terminal as TerminalIcon,
} from "@mui/icons-material";
import Link from "@/shared/components/NextLink";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/core/providers/AuthContext";
import SignInButtons from "@/shared/components/auth/SignInButtons";
import { useAppTheme } from "@/core/providers/ThemeRegistry";
import { useRegion } from "@/core/providers/RegionContext";
import { getUserCards } from "@/core/services/api";
import { onCardUpdate } from "@/core/utils/events";
import { detectDevice } from "@/core/utils/deviceUtils";
import { buildCloudflareImageUrl } from "@/core/utils/cloudflareImages";
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
  const hideNavigation = false;
  const { mode, toggleTheme } = useAppTheme();
  const { region } = useRegion();
  const { user, logout, deleteAccount, isAuthenticated, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isAndroid: false,
    isIOS: false,
    isTablet: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [signInAnchorEl, setSignInAnchorEl] = useState(null);
  const [cardCount, setCardCount] = useState(0);

  // Get the appropriate CCReward icon based on theme and region
  const ccrewardIconId = useMemo(() => {
    const currency = REGION_CURRENCY_MAP[region] || "dollar"; // Default to dollar if region not found
    return CCREWARD_ICONS[mode]?.[currency] || CCREWARD_ICONS.light.dollar; // Fallback to light dollar
  }, [mode, region]);

  // Generate the icon URL
  const ccrewardIconUrl = useMemo(() => {
    return buildCloudflareImageUrl(ccrewardIconId, "public");
  }, [ccrewardIconId]);

  useEffect(() => {
    setDeviceInfo(detectDevice());
  }, []);

  useEffect(() => {
    if (isAuthenticated() && user) {
      const updateCardCount = async () => {
        try {
          const userCards = await getUserCards();
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount();
        setCardCount(0);
        router.push("/");
      } catch (error) {
        console.error("Delete account error:", error);
      }
    }
    handleMenuClose();
  };

  const handleSignInMenuOpen = (event) => {
    setSignInAnchorEl(event.currentTarget);
  };

  const handleSignInMenuClose = () => {
    setSignInAnchorEl(null);
  };

  const handleGoogleLogin = async () => {
    try {
      handleSignInMenuClose();
      handleMenuClose();
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      handleSignInMenuClose();
      handleMenuClose();
      await signInWithApple();
    } catch (error) {
      console.error("Login error:", error);
    }
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
    {
      label: "MCC Lookup",
      path: "/mcc-lookup",
      icon: SearchIcon,
      description: "Lookup Merchant Category Codes",
    },
    ...(isAuthenticated()
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
    {
      label: "MCP",
      path: "/mcp",
      icon: TerminalIcon,
      description: "Connect ccreward to Claude Code & other MCP clients",
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
              transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out, transform 0.3s ease-in-out",
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
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 200,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(10px)",
            }
          }
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
                component={Link}
                href={item.path}
                onClick={isMobile ? handleMenuClose : undefined}
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
                      <Icon color={active ? "primary" : "inherit"} aria-hidden="true" />
                    </Badge>
                  ) : (
                    <Icon color={active ? "primary" : "inherit"} aria-hidden="true" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontWeight: active ? 600 : 400,
                      color: active ? "primary.main" : "text.primary",
                    }
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

          {!isAuthenticated() && (
            <Box sx={{ px: 2, py: 1 }}>
              <SignInButtons
                onGoogleSignIn={handleGoogleLogin}
                onAppleSignIn={handleAppleLogin}
                fullWidth
                size="medium"
              />
            </Box>
          )}
        </Box>
      </Menu>
    );
  };

  const renderProfileMenu = () => {
    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              borderRadius: 2,
              minWidth: 220,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(10px)",
            }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {isAuthenticated() && (
          <Box sx={{ px: 2, py: 1.5 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                src={user?.photoURL}
                alt={user?.displayName || "User"}
                 sx={{ width: 40, height: 40, mr: 1.5 }}
              >
                  {user?.displayName?.charAt(0) || <PersonIcon />}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                 <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                    {user?.displayName || "User"}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: "text.secondary",
                    display: 'block'
                  }}>
                    {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
             <Typography variant="caption" color="error" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                DANGER ZONE
            </Typography>
             <MenuItem 
                onClick={handleDeleteAccount} 
                sx={{ 
                    py: 1, 
                    px: 0, 
                    color: 'error.main',
                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' }
                }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Delete Account" />
            </MenuItem>
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
                width={36}
                height={36}
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
                  aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
                  sx={{
                    ml: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "rotate(180deg)",
                    },
                    transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "background-color 0.3s ease-in-out",
                    },
                  }}
                >
                  {mode === "dark" ? <LightModeIcon aria-hidden="true" /> : <DarkModeIcon aria-hidden="true" />}
                </IconButton>
              </Tooltip>

              {/* Profile Button for Desktop */}
              {isAuthenticated() && (
                <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenuOpen}
                    aria-label="Account settings"
                    sx={{
                      ml: 1,
                      p: 0,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      transition: 'border-color 0.2s',
                        '&:hover': {
                         border: '2px solid rgba(255, 255, 255, 0.5)',
                        }
                    }}
                  >
                   <Avatar 
                        src={user?.photoURL} 
                        alt={user?.displayName || "User"}
                        sx={{ width: 32, height: 32 }}
                    >
                         {user?.displayName?.charAt(0) || <PersonIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                {renderProfileMenu()}
                </>
              )}

              {/* Login Button for Desktop */}
              {!isAuthenticated() && (
                <>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<LoginIcon />}
                    onClick={handleSignInMenuOpen}
                    sx={{
                      ml: 1,
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      color: "inherit",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Menu
                    anchorEl={signInAnchorEl}
                    open={Boolean(signInAnchorEl)}
                    onClose={handleSignInMenuClose}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1.5,
                          borderRadius: 2,
                          minWidth: 260,
                          p: 1.5,
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                          backdropFilter: "blur(10px)",
                        }
                      }
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <SignInButtons
                      onGoogleSignIn={handleGoogleLogin}
                      onAppleSignIn={handleAppleLogin}
                      fullWidth
                      size="medium"
                    />
                  </Menu>
                </>
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

/**
 * Minimal header variant — logo + theme toggle only, no navigation.
 * Use on pages that direct mobile users to the app (e.g. mobile landing).
 */
export function MinimalHeader() {
  const { mode, toggleTheme } = useAppTheme();
  const { region } = useRegion();
  const ccrewardIconId = useMemo(() => {
    const currency = REGION_CURRENCY_MAP[region] || "dollar";
    return CCREWARD_ICONS[mode]?.[currency] || CCREWARD_ICONS.light.dollar;
  }, [mode, region]);
  const ccrewardIconUrl = useMemo(() => buildCloudflareImageUrl(ccrewardIconId, "public"), [ccrewardIconId]);

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
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <motion.div variants={logoVariants} whileHover="hover" whileTap="tap">
            <Box
              component={Link}
              href="/"
              sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit", mr: 3 }}
            >
              <Box
                component="img"
                src={ccrewardIconUrl}
                alt="ccreward"
                width={36}
                height={36}
                sx={{ height: { xs: 32, sm: 36 }, width: "auto", mr: 1.5, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
              />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  background: "linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ccreward
              </Typography>
            </Box>
          </motion.div>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`} arrow>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)", transform: "rotate(180deg)" },
                transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
                "@media (prefers-reduced-motion: reduce)": { transition: "background-color 0.3s ease-in-out" },
              }}
            >
              {mode === "dark" ? <LightModeIcon aria-hidden="true" /> : <DarkModeIcon aria-hidden="true" />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default Header;
