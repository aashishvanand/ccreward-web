// src/shared/components/layout/RegionSelector.jsx
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
  const [currentRegion, setCurrentRegion] = useState(region);

  // Sync with the context whenever region changes
  useEffect(() => {
    setCurrentRegion(region);
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
    if (regionCode.toUpperCase() === currentRegion.toUpperCase()) {
      console.log(`Preventing unnecessary region change - already using ${regionCode}`);
      return;
    }
    
    console.log(`Changing region from "${currentRegion}" to "${regionCode}"`);
    
    // Call the context's setRegion function to handle all the state updates
    setRegion(regionCode);
    
    // Directly update localStorage as a fallback (the context should do this too)
    localStorage.setItem('app-region', regionCode);
    localStorage.setItem('user-set-region', 'true');
    
    // Dispatch a custom event for other components to listen for
    window.dispatchEvent(
      new CustomEvent("region-changed", {
        detail: { region: regionCode },
      })
    );
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
            {currentRegion}
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
            selected={currentRegion === code}
            disabled={currentRegion === code} // Disable the currently selected region
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