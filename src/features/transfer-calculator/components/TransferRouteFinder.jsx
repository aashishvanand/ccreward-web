// src/features/transfer-calculator/components/TransferRouteFinder.jsx
"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";
import { useAuth } from "@/core/providers/AuthContext";
import { useRegion } from "@/core/providers/RegionContext";
import { fetchTransferPrograms, findTransferRoutes } from "@/core/services/api";
import useUsageLimit from "@/core/hooks/useUsageLimit";
import { RateLimitedFeature } from "@/core/services/usageLimitService";
import { useAnalytics } from "@/core/hooks/useAnalytics";

const CATEGORY_LABELS = { airline: "Airlines", hotel: "Hotels", other: "Other Programs" };
const MAX_CARDS_SHOWN = 6;

const categoryIcon = (category, props) => {
  if (category === "airline") return <FlightIcon {...props} />;
  if (category === "hotel") return <HotelIcon {...props} />;
  return <SwapHorizIcon {...props} />;
};

const formatNumber = (value) => new Intl.NumberFormat().format(value);

const RouteCard = ({ route }) => {
  const extraCards = route.cards.length - MAX_CARDS_SHOWN;
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {route.source}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {[route.source_currency, ...route.route].join(" → ")}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
            <Chip size="small" label={route.ratio} color="primary" variant="outlined" />
            <Chip
              size="small"
              label={route.is_direct ? "Direct" : `Via ${route.route.length - 1} program${route.route.length > 2 ? "s" : ""}`}
              color={route.is_direct ? "success" : "default"}
              variant="outlined"
            />
          </Stack>
        </Box>

        {route.cards.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {route.cards.slice(0, MAX_CARDS_SHOWN).map((card) => (
              <Chip key={card} size="small" label={card} />
            ))}
            {extraCards > 0 && <Chip size="small" variant="outlined" label={`+${extraCards} more`} />}
          </Box>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {route.points_needed !== null && route.points_needed !== undefined && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Points needed:{" "}
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                {formatNumber(route.points_needed)} {route.source_currency}
              </Typography>
            </Typography>
          )}
          {route.minimum_points && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Minimum transfer: {formatNumber(route.minimum_points)}
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {route.transfer_time_display}
            </Typography>
          </Box>
        </Box>

        {route.notes && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {route.notes}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

/**
 * "Who transfers to…": pick a target program and list every card and points
 * balance in the region that can reach it, with route, ratio, points and time.
 */
const TransferRouteFinder = () => {
  const { region, isInitialized } = useRegion();
  const { isAuthenticated } = useAuth();
  const { canUse, limitMessage } = useUsageLimit(RateLimitedFeature.TRANSFERS);
  const { trackButtonClick } = useAnalytics();

  const [programs, setPrograms] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [target, setTarget] = useState(null);
  const [targetPoints, setTargetPoints] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isInitialized || !isAuthenticated()) return;
    setIsLoadingPrograms(true);
    setTarget(null);
    setResult(null);
    fetchTransferPrograms()
      // Only programs something in this region can transfer to
      .then((list) => setPrograms(Array.isArray(list) ? list.filter((program) => program.reachable) : []))
      .catch(() => setError("Could not load transfer programs. Please try again."))
      .finally(() => setIsLoadingPrograms(false));
  }, [isInitialized, region, isAuthenticated]);

  const handleSearch = async () => {
    if (!target) return;
    if (!canUse) {
      setError(limitMessage);
      return;
    }

    setIsSearching(true);
    setError("");
    setResult(null);
    trackButtonClick("find_transfer_routes", { target: target.name, region });

    try {
      const data = await findTransferRoutes({
        target: target.name,
        ...(Number(targetPoints) > 0 && { target_points: Number(targetPoints) }),
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not find transfer routes. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Who Transfers To…
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Pick an airline, hotel or rewards program to see every card and points currency that can
            transfer to it, directly or through another program.
          </Typography>
        </Box>

        {!isAuthenticated() ? (
          <Alert severity="warning">Please sign in to find transfer routes.</Alert>
        ) : (
          <>
            <TextField
              select
              fullWidth
              label="Transfer to"
              value={target?.name ?? ""}
              onChange={(event) => {
                setTarget(programs.find((program) => program.name === event.target.value) ?? null);
                setResult(null);
              }}
              disabled={isLoadingPrograms || programs.length === 0}
              slotProps={{
                select: { MenuProps: { slotProps: { paper: { sx: { maxHeight: 420 } } } } },
                input: isLoadingPrograms
                  ? { endAdornment: <InputAdornment position="end" sx={{ mr: 3 }}><CircularProgress size={20} /></InputAdornment> }
                  : undefined,
              }}
            >
              {/* Grouped dropdown: Airlines, Hotels, Other Programs */}
              {Object.entries(CATEGORY_LABELS).flatMap(([category, label]) => {
                const group = programs.filter((program) => program.category === category);
                if (group.length === 0) return [];
                return [
                  <ListSubheader key={`header-${category}`}>{label}</ListSubheader>,
                  ...group.map((program) => (
                    <MenuItem key={program.name} value={program.name} sx={{ gap: 1.5 }}>
                      {categoryIcon(program.category, { fontSize: "small", color: "action" })}
                      <Box sx={{ flexGrow: 1 }}>
                        {program.name}
                        {program.brand_name && program.brand_name !== program.name && (
                          <Typography component="span" variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
                            {program.brand_name}
                          </Typography>
                        )}
                      </Box>
                      {program.iata && <Chip size="small" label={program.iata} />}
                    </MenuItem>
                  )),
                ];
              })}
            </TextField>

            <TextField
              fullWidth
              label="Points or miles you need (optional)"
              type="number"
              value={targetPoints}
              onChange={(event) => setTargetPoints(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">Pts</InputAdornment>,
                  inputProps: { min: 1, step: 1000 },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!target || isSearching || !isInitialized}
              sx={{ height: 48 }}
            >
              {isSearching ? <CircularProgress size={24} color="inherit" /> : "Find Transfer Routes"}
            </Button>
          </>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {result && (
          <Stack spacing={2}>
            <Typography variant="h6">
              {result.routes.length} way{result.routes.length === 1 ? "" : "s"} to get {result.target}
              {result.target_points ? ` (${formatNumber(result.target_points)})` : ""}
            </Typography>
            {result.routes.length === 0 ? (
              <Alert severity="info">No card or program in this region transfers to {result.target}.</Alert>
            ) : (
              result.routes.map((route) => (
                <RouteCard key={`${route.source}|${route.cards.join(",")}|${route.ratio}`} route={route} />
              ))
            )}
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Ratio &quot;3:1&quot; means 3 of your points give 1 {result.target} point (before bonuses). Cards are
              grouped when they transfer at the same rate.
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default TransferRouteFinder;
