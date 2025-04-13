// src/shared/components/layout/RegionSelector.jsx
import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Tooltip,
  Badge,
} from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";
import { useRegion, REGIONS } from "../../../core/providers/RegionContext";

const RegionSelector = () => {
  const { region, setRegion, regionName } = useRegion();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    handleClose();
    // Reload the page to refresh all components
    window.location.reload();
  };

  return (
    <>
      <Tooltip title={`Region: ${regionName}`}>
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
