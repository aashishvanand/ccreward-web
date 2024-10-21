'use client'

import { useState, useEffect } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box 
} from '@mui/material'
import { Apple as AppleIcon, Close as CloseIcon } from '@mui/icons-material'

export default function Component() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setShowBanner(isIOS)
  }, [])

  if (!showBanner) return null

  return (
    <AppBar position="fixed" color="primary" elevation={0}>
      <Toolbar>
        <AppleIcon sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="div">
            Get the CCReward iOS App
          </Typography>
          <Typography variant="caption" component="div">
            Maximize your rewards on the go!
          </Typography>
        </Box>
        <Button 
          color="inherit" 
          variant="outlined"
          onClick={() => window.open('https://apps.apple.com/in/app/ccreward/id6736835206', '_blank')}
          sx={{ mr: 2 }}
        >
          Download
        </Button>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => setShowBanner(false)}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}