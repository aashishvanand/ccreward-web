// src/shared/components/layout/RegionSelector.jsx
import { useState } from "react";
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRegionChange = (newRegion) => {
    // Always uppercase the region code for consistency
    const regionCode = newRegion.toUpperCase();
    
    // Get current value directly
    const currentRegion = localStorage.getItem('app-region');
    
    // Skip if trying to set the same region (compare case-insensitive)
    if (currentRegion && regionCode.toUpperCase() === currentRegion.toUpperCase()) {
      console.log(`Preventing unnecessary region change`);
      handleClose();
      return;
    }
    
    console.log(`Changing region from "${currentRegion}" to "${regionCode}"`);
    
    // IMPORTANT: Save both the region and user choice flag
    localStorage.setItem('app-region', regionCode);
    localStorage.setItem('user-set-region', 'true'); // Set to string 'true'
    
    // Call context setRegion function
    setRegion(regionCode);
    
    // Close the menu
    handleClose();
  };

  // Add a visual indicator if using IP-detected region vs user-selected
  const regionIndicator = hasUserSetRegion ? "" : " (Auto)";

  return (
    <>
      <Tooltip title={`Region: ${regionName}${regionIndicator}`}>
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
            {region}
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
            selected={region === code}
            disabled={region === code} // Disable the currently selected region
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