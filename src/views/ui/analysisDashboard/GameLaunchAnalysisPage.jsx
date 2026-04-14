import React, { useState } from "react";
import PageHeader from "../../../component/PageHeader";
import {
  Box, Card, CardContent, FormControl,
  MenuItem, Paper, Select, Stack, Typography,
} from "@mui/material";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Label, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { GAME_DATA, GAME_NAMES } from "./gameData";
import OperatorMatrix from "./OperatorMatrix";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const B = {
  brand: "#392F6C",   // base purple
  brandLight: "#5C4F9E",   // lighter tint for secondary/game bars
  brandPale: "#EDE9F8",   // very light purple for hover / bg tints
  brandMid: "#7B6BC0",   // mid purple for area fill / accents
  amber: "#F9A825",   // not-searched dash
  green: "#2E7D32",   // found tick text
  greenBg: "#E8F5E9",   // found tick bg
  red: "#B71C1C",   // not-found cross text
  redBg: "#FDECEA",   // not-found cross bg
  divider: "#E3E0F0",   // purple-tinted border
  textMuted: "#7B6BC0",   // axis / caption text
};

const SECTION_COLORS = {
  newGames: "#E91E63",
  popular: "#FF9800",
  slots: "#29B6F6",
  liveCasino: "#F9A825",
  other: "#90A4AE",
};

// ─── Chart axis / grid props ─────────────────────────────────────────────────
const useChartProps = () => ({
  axisProps: {
    tick: { fill: B.textMuted, fontSize: 10.5 },
    axisLine: false,
    tickLine: false,
  },
  gridProps: {
    strokeDasharray: "3 3",
    stroke: B.divider,
    vertical: false,
  },
  labelStyle: { fill: B.textMuted, fontSize: 10 },
});

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Card variant="outlined" sx={{ px: 2, py: 1.5, minWidth: 160, borderColor: B.divider }}>
      <Typography variant="caption" fontWeight={500} sx={{ color: B.brand }} display="block" mb={0.5}>
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Stack key={i} direction="row" justifyContent="space-between" gap={2}>
          <Typography variant="caption" sx={{ color: p.color || p.fill }}>{p.name}</Typography>
          <Typography variant="caption" fontWeight={500} color="text.primary">
            {p.value?.toLocaleString()}
          </Typography>
        </Stack>
      ))}
    </Card>
  );
};

// ─── Chart card ──────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children }) => (
  <Card variant="outlined" sx={{ mb: 2.5, borderColor: B.divider }}>
    <CardContent sx={{ p: "20px 22px 16px !important" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="subtitle2" fontWeight={500} sx={{ color: B.brand }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>

      </Stack>
      {children}
    </CardContent>
  </Card>
);

// ─── Legend row ──────────────────────────────────────────────────────────────
const LegendRow = ({ items }) => (
  <Stack direction="row" flexWrap="wrap" gap={1.5} mb={1.5}>
    {items.map(([label, color]) => (
      <Stack key={label} direction="row" alignItems="center" gap={0.6}>
        <Box sx={{ width: 9, height: 9, borderRadius: "2px", bgcolor: color }} />
        <Typography variant="caption" sx={{ color: B.textMuted }}>{label}</Typography>
      </Stack>
    ))}
  </Stack>
);

// ═══════════════════════════════════════════════════════════════════════════════
const GameLaunchAnalysisPage = () => {
  const [game, setGame] = useState(GAME_NAMES[0]);
  const [showFilter, setShowFilter] = useState(false);
  const d = GAME_DATA[game];
  const { axisProps, gridProps, labelStyle } = useChartProps();

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, minHeight: "100vh", borderRadius: 0, position: "relative" }}
    >
      <PageHeader
        title="Game Launch Analysis"
        onToggleFilter={() => setShowFilter((prev) => !prev)}
        features={{
          search: false,
          filters: true,
          download: true,
          chat: false,
        }}
      />
      {showFilter && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          flexWrap="wrap"
          gap={1.5}
          mb={3}
        >
          <FormControl size="small">
            <Select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              sx={{
                minWidth: 220,
                bgcolor: "#fff",
                borderRadius: 2,
                fontSize: 13.5,

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: B.divider,
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: B.brandMid,
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: B.brandMid,
                  borderWidth: "2px",
                },

                "&.Mui-focused": {
                  boxShadow: "none",
                },
              }}
            >
              {GAME_NAMES.map((g) => (
                <MenuItem key={g} value={g} sx={{ fontSize: 13.5 }}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      {/* Chart 1 — Provider Availability */}
      <ChartCard title="Provider Availability" subtitle="Total providers carrying this game per week">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={d.weekly} margin={{ top: 8, right: 12, left: 0, bottom: 28 }}>
            <defs>
              <linearGradient id="gBrand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={B.brand} stopOpacity={0.18} />
                <stop offset="95%" stopColor={B.brand} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps}>
              <Label value="Weeks since launch" offset={-18} position="insideBottom" style={labelStyle} />
            </XAxis>
            <YAxis {...axisProps} width={36}>
              <Label value="Provider presence" angle={-90} position="insideLeft" style={{ ...labelStyle, textAnchor: "middle" }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="providerPresence" name="Provider Presence"
              stroke={B.brand} strokeWidth={2.5} fill="url(#gBrand)"
              dot={{ r: 3.5, fill: B.brand, strokeWidth: 0 }} activeDot={{ r: 6, fill: B.brand }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 2 — Game Availability */}
      <ChartCard title="Game Availability" subtitle="Game adoption vs provider distribution footprint per week" >
        <LegendRow items={[["Provider Presence", B.brand], ["Game Presence", B.brandLight]]} />
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={d.weekly} margin={{ top: 4, right: 12, left: 0, bottom: 28 }} barSize={13} barCategoryGap="28%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps}>
              <Label value="Weeks since launch" offset={-18} position="insideBottom" style={labelStyle} />
            </XAxis>
            <YAxis {...axisProps} width={36} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="providerPresence" name="Provider Presence" fill={B.brand} radius={[3, 3, 0, 0]} />
            <Bar dataKey="gamePresence" name="Game Presence" fill={B.brandLight} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 3 — Total Casinos Across Sections */}
      <ChartCard title="Total Casinos Across Sections" subtitle="Absolute casino counts per placement section over time">
        <LegendRow items={Object.entries({
          "New Games": SECTION_COLORS.newGames,
          "Popular": SECTION_COLORS.popular,
          "Slots": SECTION_COLORS.slots,
          "Live Casino": SECTION_COLORS.liveCasino,
          "Other": SECTION_COLORS.other,
        })} />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={d.sectionMapping} margin={{ top: 4, right: 12, left: 0, bottom: 28 }} barSize={26} barCategoryGap="35%">
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps}>
              <Label value="Weeks since launch" offset={-18} position="insideBottom" style={labelStyle} />
            </XAxis>
            <YAxis {...axisProps} width={36} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="newGames" name="New Games" stackId="s" fill={SECTION_COLORS.newGames} />
            <Bar dataKey="popular" name="Popular" stackId="s" fill={SECTION_COLORS.popular} />
            <Bar dataKey="slots" name="Slots" stackId="s" fill={SECTION_COLORS.slots} />
            <Bar dataKey="liveCasino" name="Live Casino" stackId="s" fill={SECTION_COLORS.liveCasino} />
            <Bar dataKey="other" name="Other" stackId="s" fill={SECTION_COLORS.other} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Operator Matrix */}
      <ChartCard title="Game's Availability on Operators" subtitle="Per-operator weekly availability from launch week" >
        <OperatorMatrix data={d.operatorMatrix} weeks={d.operatorWeeks} />
      </ChartCard>

    </Paper>
  );
};

export default GameLaunchAnalysisPage;