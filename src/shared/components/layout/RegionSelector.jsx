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
    // Skip if trying to set the same region
    if (newRegion === region) {
      console.log(`🚫 Preventing unnecessary region change: ${region} to ${newRegion}`);
      handleClose();
      return;
    }
    
    console.log(`🌎 Region selector changing from ${region} to ${newRegion}`);
    
    // Use the context's setRegion function to handle the change
    // This will update localStorage, mark as user choice, and trigger reload
    setRegion(newRegion);
    
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
        MenuListProps={{
          "aria-labelledby": "region-button",
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