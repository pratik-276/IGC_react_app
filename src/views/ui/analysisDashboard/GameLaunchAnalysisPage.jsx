import React, { useState } from "react";
import PageHeader from "../../../component/PageHeader";
import {
  Box, Card, Paper, Stack, Typography,
} from "@mui/material";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Label, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { GAME_DATA, GAME_NAMES, PROVIDER_NAMES } from "./gameData";
import ReusableLazyTable from "../../../component/ReusableLazyTable";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const B = {
  brand: "#392F6C",   
  brandLight: "#5C4F9E",   
  brandPale: "#EDE9F8",   
  brandMid: "#7B6BC0",  
  amber: "#F9A825",  
  green: "#2E7D32", 
  greenBg: "#E8F5E9",  
  red: "#B71C1C", 
  redBg: "#FDECEA", 
  divider: "#E3E0F0",  
  textMuted: "#7B6BC0",   
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
  <Paper elevation={0} sx={{ mb: 2.5, p: "20px 22px 16px !important" }}>
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
  </Paper>
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

// ─── Shared PrimeReact Dropdown styles ───────────────────────────────────────
const dropdownPt = {
  root: { style: { width: "220px", fontSize: "13.5px", borderRadius: "6px", border: `1px solid ${B.divider}` } },
  input: { style: { fontSize: "13.5px", padding: "7px 12px", color: "#1a1a2e", fontFamily: "inherit" } },
  trigger: { style: { color: B.brandMid } },
  panel: { style: { fontSize: "13.5px", borderColor: B.divider, borderRadius: "6px", boxShadow: "0 4px 12px rgba(57,47,108,0.10)", fontFamily: "inherit" } },
  item: { style: { fontSize: "13.5px", padding: "8px 14px", color: "#1a1a2e" } },
};

// ═══════════════════════════════════════════════════════════════════════════════
const GameLaunchAnalysisPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [provider, setProvider] = useState(PROVIDER_NAMES[0]);
  const firstGameOfProvider = GAME_NAMES.find(n => GAME_DATA[n].provider === PROVIDER_NAMES[0]);
  const [game, setGame] = useState(firstGameOfProvider);

  const d = GAME_DATA[game];
  const { axisProps, gridProps, labelStyle } = useChartProps();

  const providerOptions = PROVIDER_NAMES.map((p) => ({ label: p, value: p }));
  const gameOptions = GAME_NAMES
    .filter((n) => GAME_DATA[n].provider === provider)
    .map((g) => ({ label: g, value: g }));

  const handleProviderChange = (val) => {
    setProvider(val);
    const firstGame = GAME_NAMES.find((n) => GAME_DATA[n].provider === val);
    setGame(firstGame);
  };

  const operatorTableData = d.operatorMatrix.map((row) => {
    const flatRow = { operator: row.operator, geography: row.geography };
    d.operatorWeeks.forEach((week, i) => {
      flatRow[`w${week}`] = row.availability[i];
    });
    return flatRow;
  });

const operatorOptions = [
  ...new Set(operatorTableData.map((row) => row.operator))
].map((op) => ({ label: op, value: op }));

const geographyOptions = [
  ...new Set(operatorTableData.map((row) => row.geography))
].map((geo) => ({ label: geo, value: geo }));

const createDropdownFilter = (optionsList, placeholder) => (options) => {
  return (
    <Dropdown
      value={options.value}
      options={optionsList}
      onChange={(e) => options.filterApplyCallback(e.value)}
      placeholder={placeholder}
      showClear
      style={{ minWidth: "180px" }}
    />
  );
};

const operatorFilterElement = createDropdownFilter(operatorOptions, "Select Operator");
const geographyFilterElement = createDropdownFilter(geographyOptions, "Select Geography");

  const operatorColumns = [
    {
      field: "operator",
      header: "Operator",

      sortable: false,

      filter: true,
      filterField: "operator",
      filterMatchMode: "equals",
      filterElement: operatorFilterElement,

      showFilterMenu: true,
      showFilterOperator: false,
      showAddButton: false,

      style: { minWidth: "130px", fontWeight: 500 }
    },

    {
      field: "geography",
      header: "Geography",

      sortable: false,

      filter: true,
      filterField: "geography",
      filterMatchMode: "equals",
      filterElement: geographyFilterElement,

      showFilterMenu: true,
      showFilterOperator: false,
      showAddButton: false,

      style: { minWidth: "110px" }
    },

    ...d.operatorWeeks.map((week) => ({
      field: `w${week}`,
      header: `w${week}`,
      sortable: false,
      style: { minWidth: "52px", textAlign: "center" },
      body: (row) => {
        const val = row[`w${week}`];
        if (val === 1) return <span style={{ color: B.green }}>✓</span>;
        if (val === 0) return <span style={{ color: B.red }}>✕</span>;
        return <span style={{ color: B.amber }}>—</span>;
      },
    })),
  ];

  return (
    <Paper
      elevation={0}
      sx={{ minHeight: "100vh", position: "relative" }}
    >
      <PageHeader
        title="Game Launch Analysis"
        onToggleFilter={() => setShowFilter((prev) => !prev)}
        features={{
          search: false,
          filters: true,
          download: false,
          chat: false,
        }}
      />
      {showFilter && (
        <div className="d-flex gap-2 align-items-center justify-content-end mb-3">
          <Dropdown
            optionLabel="label"
            optionValue="value"
            filter
            placeholder="Select Provider"
            value={provider}
            onChange={(e) => handleProviderChange(e.value)}
            options={providerOptions}
            style={{ width: "220px" }}
          />

          <Dropdown
            optionLabel="label"
            optionValue="value"
            filter
            placeholder="Select Game"
            value={game}
            onChange={(e) => setGame(e.value)}
            options={gameOptions}
            style={{ width: "220px" }}
          />
        </div>
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
      <ChartCard
        title="Game's Availability on Operators"
        subtitle="Per-operator weekly availability from launch week"
      >
        <ReusableLazyTable
         key={game} 
          data={operatorTableData}
          loading={false}
          columns={operatorColumns}
          scrollHeight="400px"
          hasMore={false}
        />
      </ChartCard>

    </Paper>
  );
};

export default GameLaunchAnalysisPage;