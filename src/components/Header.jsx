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

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CreditCard sx={{ mr: 1 }} />
          CCReward
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          {pathname !== '/' && (
            <Button color="inherit" startIcon={<HomeIcon />} component={Link} href="/" sx={{ ml: 2 }}>
              Home
            </Button>
          )}
          
          {pathname !== '/calculator' && (
            <Button color="inherit" startIcon={<CalculateIcon />} component={Link} href="/calculator" sx={{ ml: 2 }}>
              Calculator
            </Button>
          )}
          
          {isAuthenticated() && (
            <>
              {pathname !== '/my-cards' && (
                <Button
                  color="inherit"
                  component={Link}
                  href="/my-cards"
                  startIcon={<CreditCard />}
                  sx={{ ml: 2 }}
                >
                  My Cards
                </Button>
              )}
              
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;