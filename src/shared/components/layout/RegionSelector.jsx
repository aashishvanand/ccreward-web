import { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";
import { useRegion, REGIONS } from "../../../core/providers/RegionContext";

const RegionSelector = () => {
  const { region, setRegion, regionName, hasUserSetRegion } = useRegion();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Read directly from localStorage first to prevent any flicker
  const [displayRegion, setDisplayRegion] = useState(() => {
    // Get from localStorage if possible
    if (typeof window !== 'undefined') {
      const savedRegion = localStorage.getItem("app-region")?.toUpperCase();
      if (savedRegion && Object.keys(REGIONS).includes(savedRegion)) {
        return savedRegion;
      }
    }
    return region; // Fall back to context value
  });

  // Then sync with context
  useEffect(() => {
    setDisplayRegion(region);
  }, [region]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRegionChange = (newRegion) => {
    // Always uppercase the region code for consistency
    const regionCode = newRegion.toUpperCase();
    
    // Close the menu first
    handleClose();
    
    // Skip if trying to set the same region (compare case-insensitive)
    if (regionCode === displayRegion) {
      return;
    }
    
    // Update immediately for responsive UI
    setDisplayRegion(regionCode);
    
    // Update localStorage directly
    localStorage.setItem('app-region', regionCode);
    localStorage.setItem('user-set-region', 'true');
    
    // Call context method which will handle dispatching events
    setRegion(regionCode);
  };

  // Add a visual indicator if using IP-detected region vs user-selected
  const regionIndicator = hasUserSetRegion ? "" : " (Auto)";

  return (
    <>
      <Tooltip title={`Region: ${REGIONS[displayRegion] || "Unknown"}${regionIndicator}`}>
        <IconButton
          onClick={handleClick}
          color="inherit"
          aria-label="select region"
          size="small"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <PublicIcon />
          <Typography
            variant="caption"
            sx={{ display: { xs: "none", sm: "inline" } }}
          >
            {displayRegion}
          </Typography>
        </IconButton>
      </Tooltip>
      <Menu
        id="region-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "region-button",
          }
        }}
      >
        {Object.entries(REGIONS).map(([code, name]) => (
          <MenuItem
            key={code}
            onClick={() => handleRegionChange(code)}
            selected={displayRegion === code}
            disabled={displayRegion === code} // Disable the currently selected region
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {code === "IN" ? "🇮🇳" : "🇸🇬"} {name}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RegionSelector;