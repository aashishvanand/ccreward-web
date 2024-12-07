import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';

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

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        edge="end"
        aria-label="account menu"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="inherit"
        sx={{
          p: 0,
          width: 32,
          height: 32,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {user?.photoURL ? (
          <Avatar 
            src={user.photoURL} 
            alt={user.displayName || user.email}
            sx={{ 
              width: 32, 
              height: 32
            }}
          />
        ) : (
          <AccountCircle sx={{ width: 32, height: 32 }} />
        )}
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 320,
              maxWidth: '90vw',
              borderRadius: 2,
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            mb: 2 
          }}>
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName || user?.email}
              sx={{
                width: 80,
                height: 80,
                mb: 1,
                border: 1,
                borderColor: 'divider'
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {user?.displayName || 'User'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                wordBreak: 'break-all',
                maxWidth: '100%'
              }}
            >
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
          <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;