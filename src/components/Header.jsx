import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import {
  CreditCard,
  Brightness4,
  Brightness7,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Calculate as CalculateIcon,
} from "@mui/icons-material";
import { useAppTheme } from "../components/ThemeRegistry";
import { useAuth } from "../app/providers/AuthContext";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

function Header() {
  const { mode, toggleTheme } = useAppTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderNavLinks = () => {
    if (pathname === '/') {
      return null; // No additional links on the home page
    }

    return (
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
        {pathname !== '/' && (
          <Button color="inherit" startIcon={<HomeIcon />} component={Link} href="/">
            Home
          </Button>
        )}
        {pathname !== '/calculator' && (
          <Button color="inherit" startIcon={<CalculateIcon />} component={Link} href="/calculator">
            Calculator
          </Button>
        )}
      </Box>
    );
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
        >
          <CreditCard sx={{ mr: 1 }} />
          CCReward
        </Typography>
        {renderNavLinks()}
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        {isAuthenticated() && (
          <>
            <Button
              color="inherit"
              component={Link}
              href="/my-cards"
              startIcon={<CreditCard />}
              sx={{ ml: 2 }}
            >
              My Cards
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
            <Avatar
              src={user?.photoURL || ""}
              alt={user?.displayName || "User"}
              sx={{ ml: 2, width: 40, height: 40 }}
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;