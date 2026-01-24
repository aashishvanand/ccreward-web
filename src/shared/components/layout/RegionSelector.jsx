import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";
import { useRegion, REGIONS } from "@/core/providers/RegionContext";

const RegionSelector = () => {
  // ✅ USE CONTEXT ONLY - NO DIRECT LOCALSTORAGE ACCESS
  const { region, setRegion, regionName, hasUserSetRegion, isInitialized } = useRegion();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // ✅ REMOVED: All localStorage initialization and state management
  // ✅ REMOVED: displayRegion state - use context region directly

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRegionChange = (newRegion) => {
    // Close the menu first
    handleClose();
    
    // Skip if trying to set the same region
    if (newRegion === region) {
      return;
    }
    
    // ✅ USE CONTEXT METHOD ONLY - NO DIRECT LOCALSTORAGE
    setRegion(newRegion);
  };

  // ✅ SHOW LOADING STATE WHILE REGION INITIALIZES
  if (!isInitialized) {
    return (
      <Tooltip title="Loading region...">
        <IconButton disabled color="inherit" size="small">
          <CircularProgress size={16} />
        </IconButton>
      </Tooltip>
    );
  }

  // ✅ HANDLE CASE WHERE REGION IS NOT SET
  if (!region) {
    return (
      <Tooltip title="Please select a region">
        <IconButton disabled color="inherit" size="small">
          <PublicIcon />
          <Typography variant="caption" sx={{ display: { xs: "none", sm: "inline" } }}>
            --
          </Typography>
        </IconButton>
      </Tooltip>
    );
  }

  // ✅ ADD VISUAL INDICATOR FOR AUTO-DETECTED VS USER-SELECTED
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
            {region} {/* ✅ USE CONTEXT REGION DIRECTLY */}
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
              {region === code && !hasUserSetRegion && (
                <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                  (Auto)
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RegionSelector;