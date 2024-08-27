import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  CreditCard,
  Brightness4,
  Brightness7,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Calculate as CalculateIcon,
  Menu as MenuIcon,
  Stars as StarsIcon,
} from "@mui/icons-material";
import { useAppTheme } from "../components/ThemeRegistry";
import { useAuth } from "../app/providers/AuthContext";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCardsForUser } from "../utils/firebaseUtils";

function Header() {
  const { mode, toggleTheme } = useAppTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userCardCount, setUserCardCount] = useState(0);

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
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
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
    { label: 'Home', icon: <HomeIcon />, href: '/' },
    { label: 'Calculator', icon: <CalculateIcon />, href: '/calculator' },
    ...(isAuthenticated() ? [
      { label: 'My Cards', icon: <CreditCard />, href: '/my-cards' },
      ...(userCardCount > 1 ? [{ label: 'Best Card', icon: <StarsIcon />, href: '/best-card' }] : [])
    ] : []),
  ];

  const renderMenuItems = () => {
    return menuItems.map((item) => (
      pathname !== item.href && (
        <MenuItem
          key={item.label}
          onClick={handleMenuClose}
          component={Link}
          href={item.href}
        >
          {item.icon}
          <Typography sx={{ ml: 1 }}>{item.label}</Typography>
        </MenuItem>
      )
    ));
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CreditCard sx={{ mr: 1 }} />
          CCReward
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {renderMenuItems()}
                {isAuthenticated() && (
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon />
                    <Typography sx={{ ml: 1 }}>Logout</Typography>
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              {menuItems.map((item) => (
                pathname !== item.href && (
                  <Button
                    key={item.label}
                    color="inherit"
                    startIcon={item.icon}
                    component={Link}
                    href={item.href}
                    sx={{ ml: 2 }}
                  >
                    {item.label}
                  </Button>
                )
              ))}
              
              {isAuthenticated() && (
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              )}
            </>
          )}
          
          {isAuthenticated() && (
            <Avatar
              src={user?.photoURL || ""}
              alt={user?.displayName || "User"}
              sx={{ ml: 2, width: 40, height: 40 }}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;