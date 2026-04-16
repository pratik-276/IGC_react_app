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
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const B = {
  brand: "#392f6c",
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

// ─── MultiSelect label helper ─────────────────────────────────────────────────
const getSelectedLabel = (selectedArray) => {
  if (!selectedArray || selectedArray.length <= 2) return "";
  const firstTwo = selectedArray.slice(0, 2).join(", ");
  return `${firstTwo}, ...`;
};

// ─── Chart axis / grid props ──────────────────────────────────────────────────
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

// ─── Tooltip ──────────────────────────────────────────────────────────────────
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

// ─── Chart card — no borders ──────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children }) => (
  <div style={{ padding: "12px 0 16px", marginTop: "16px" }}>
    <div className="d-flex align-items-center justify-content-between mb-2">
      <div>
        <h5 className="font-semibold mb-0" style={{ color: B.brand }}>{title}</h5>
        {subtitle && (
          <span style={{ fontSize: "12px", color: "#6c757d" }}>{subtitle}</span>
        )}
      </div>
    </div>
    {children}
  </div>
);

// ─── Legend row ───────────────────────────────────────────────────────────────
const LegendRow = ({ items }) => (
  <div className="d-flex flex-wrap gap-2 mb-2">
    {items.map(([label, color]) => (
      <div key={label} className="d-flex align-items-center gap-1">
        <div style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: color }} />
        <span style={{ fontSize: "11px", color: B.textMuted }}>{label}</span>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
const GameLaunchAnalysisPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [provider, setProvider] = useState(PROVIDER_NAMES[0]);
  const firstGameOfProvider = GAME_NAMES.find(n => GAME_DATA[n].provider === PROVIDER_NAMES[0]);
  const [game, setGame] = useState(firstGameOfProvider);

  const [operatorFilters, setOperatorFilters] = useState({
    operator: [],
    geography: [],
  });

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

  // ─── Operator table data ──────────────────────────────────────────────────
  const operatorTableData = d.operatorMatrix.map((row) => {
    const flatRow = { operator: row.operator, geography: row.geography };
    d.operatorWeeks.forEach((week, i) => {
      flatRow[`w${week}`] = row.availability[i];
    });
    return flatRow;
  });

  const operatorOptions = [
    ...new Set(operatorTableData.map((row) => row.operator)),
  ].map((op) => ({ label: op, value: op }));

  const geographyOptions = [
    ...new Set(
      (operatorFilters.operator.length > 0
        ? operatorTableData.filter((row) =>
            operatorFilters.operator.includes(row.operator)
          )
        : operatorTableData
      ).map((row) => row.geography)
    ),
  ].map((geo) => ({ label: geo, value: geo }));

  const hasActiveFilters =
    operatorFilters.operator.length > 0 || operatorFilters.geography.length > 0;

  const handleFilterChange = (field, value) => {
    setOperatorFilters((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "operator") {
        const validGeos = new Set(
          operatorTableData
            .filter((row) => value.length === 0 || value.includes(row.operator))
            .map((row) => row.geography)
        );
        next.geography = prev.geography.filter((g) => validGeos.has(g));
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setOperatorFilters({ operator: [], geography: [] });
  };

  const filteredOperatorTableData = operatorTableData.filter((row) => {
    const opMatch =
      operatorFilters.operator.length === 0 ||
      operatorFilters.operator.includes(row.operator);
    const geoMatch =
      operatorFilters.geography.length === 0 ||
      operatorFilters.geography.includes(row.geography);
    return opMatch && geoMatch;
  });

  const operatorColumns = [
    {
      field: "operator",
      header: "Operator",
      sortable: false,
      style: { minWidth: "130px", fontWeight: 500 },
    },
    {
      field: "geography",
      header: "Geography",
      sortable: false,
      style: { minWidth: "110px" },
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
    <div>
      {/* ── Page header ── */}
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h4 className="m-md-0 font-semibold" style={{ color: B.brand }}>
            Game Launch Analysis
          </h4>
        </div>

        {/* Provider / Game selectors */}
        <div className="d-flex gap-2 align-items-center">
          <Dropdown
            optionLabel="label"
            optionValue="value"
            filter
            placeholder="Select Provider"
            value={provider}
            onChange={(e) => handleProviderChange(e.value)}
            options={providerOptions}
            className="w-12rem"
          />
          <Dropdown
            optionLabel="label"
            optionValue="value"
            filter
            placeholder="Select Game"
            value={game}
            onChange={(e) => setGame(e.value)}
            options={gameOptions}
            className="w-12rem"
          />
        </div>
      </div>

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
      <ChartCard title="Game Availability" subtitle="Game adoption vs provider distribution footprint per week">
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
        {/* Filter bar */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <MultiSelect
              value={operatorFilters.operator}
              options={operatorOptions}
              onChange={(e) => handleFilterChange("operator", e.value ?? [])}
              placeholder="Select Operators"
              filter
              maxSelectedLabels={2}
              selectedItemsLabel={getSelectedLabel(operatorFilters.operator)}
              display="comma"
              className="w-12rem"
            />
            <MultiSelect
              value={operatorFilters.geography}
              options={geographyOptions}
              onChange={(e) => handleFilterChange("geography", e.value ?? [])}
              placeholder="Select Geographies"
              filter
              maxSelectedLabels={2}
              selectedItemsLabel={getSelectedLabel(operatorFilters.geography)}
              display="comma"
              className="w-12rem"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              style={{
                fontSize: 13,
                color: B.brand,
                background: "none",
                border: "none",
                padding: "6px 4px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                textDecoration: "underline",
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <ReusableLazyTable
          key={game}
          data={filteredOperatorTableData}
          loading={false}
          columns={operatorColumns}
          scrollHeight="400px"
          hasMore={false}
        />
      </ChartCard>
    </div>
  );
};

export default GameLaunchAnalysisPage;