import React, { useState } from "react";
import PageHeader from "../../../component/PageHeader";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  AreaChart, Area,
  BarChart, Bar,

  XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  Label,
} from "recharts";
import { GAME_DATA, GAME_NAMES, getGameStats } from "./gameData";

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  primary: "#3f51b5",
  secondary: "#7986cb",
  accent: "#1a237e",
  pct: "#0097a7",
  newG: "#e91e63",
  popular: "#ff9800",
  slots: "#29b6f6",
  live: "#fdd835",
  other: "#90a4ae",
  provider: "#3f51b5",
  game: "#7986cb",
  grid: "#ececec",
  cardBg: "#ffffff",
  pageBg: "#f4f6fb",
  border: "#e3e6f0",
  text: "#1a237e",
  muted: "#7b7fa8",
};

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, pct }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${C.border}`,
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: "0 8px 32px rgba(63,81,181,0.13)",
      minWidth: 160,
    }}>
      <p style={{ margin: "0 0 7px", fontWeight: 700, color: C.text, fontSize: 11.5 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, margin: "3px 0" }}>
          <span style={{ color: p.color || p.fill, fontSize: 11.5 }}>{p.name}</span>
          <strong style={{ color: "#222", fontSize: 11.5 }}>
            {pct ? `${p.value}%` : p.value.toLocaleString()}
          </strong>
        </div>
      ))}
    </div>
  );
};

// ── Chart Card Wrapper ─────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, badge, children, style = {} }) => (
  <Card
    elevation={0}
    sx={{
      background: C.cardBg,
      border: `1.5px solid ${C.border}`,
      borderRadius: "16px !important",
      boxShadow: "0 4px 24px rgba(63,81,181,0.07)",
      ...style,
    }}
  >
    <CardContent sx={{ p: "22px 24px 16px !important" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <Typography variant="subtitle1" fontWeight={700} style={{ color: C.text, fontSize: 13.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" style={{ color: C.muted, fontSize: 11.5, marginTop: 2 }}>
              {subtitle}
            </Typography>
          )}
        </div>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              background: "rgba(63,81,181,0.08)",
              color: C.primary,
              fontWeight: 600,
              fontSize: 10.5,
              height: 22,
              border: `1px solid rgba(63,81,181,0.18)`,
            }}
          />
        )}
      </div>
      {children}
    </CardContent>
  </Card>
);

// ── Legend Row ─────────────────────────────────────────────────────────────────
const LegendRow = ({ items }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 12 }}>
    {items.map(([lbl, col]) => (
      <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
        <div style={{ width: 9, height: 9, borderRadius: 2, background: col }} />
        <span>{lbl}</span>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
const GameLaunchAnalysisPage = () => {
  const [game, setGame] = useState(GAME_NAMES[0]);
  const d = GAME_DATA[game];
  const { peakPresence, peakWeek, peakPct, latestRow, maxProvider, avgAvailPct } = getGameStats(game);

  const sharedAxisProps = {
    tick: { fill: C.muted, fontSize: 10.5 },
    axisLine: false,
    tickLine: false,
  };

  const sharedGridProps = {
    strokeDasharray: "3 3",
    stroke: C.grid,
    vertical: false,
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, minHeight: "100vh", borderRadius: 0 }}
    >
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <PageHeader
          title="Game Launch Analysis"
          // subtitle="Performance insights for casino game positioning"
          features={{ search: false, filters: false, download: false, chat: false }}
        />
        <Select
          size="small"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          sx={{
            minWidth: 220,
            background: "#fff",
            borderRadius: "10px",
            fontSize: 13.5,
            ".MuiOutlinedInput-notchedOutline": { borderColor: C.border },
          }}
        >
          {GAME_NAMES.map((g) => (
            <MenuItem key={g} value={g}>{g}</MenuItem>
          ))}
        </Select>
      </div>

      {/* ── STAT PILLS ───────────────────────────────────────────────────────── */}
      {/* <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Peak Game Presence" value={peakPresence} sub={`at W${peakWeek}`} color={C.primary} />
        <StatCard label="Peak Availability" value={`${peakPct}%`} sub="highest single week" color={C.pct} />
        <StatCard label="Avg Availability" value={`${avgAvailPct}%`} sub="across all weeks" color={C.secondary} />
        <StatCard label="Max Provider Reach" value={maxProvider} sub="operators in network" color={C.accent} />
      </div> */}

      {/* ── CHART 1  ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>

        {/* CHART 1 — Provider Availability */}
        <ChartCard
          title="Provider Availability"
          subtitle="Total providers carrying this game per week"
          badge="Market Presence"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={d.weekly} margin={{ top: 10, right: 16, left: 0, bottom: 28 }}>
              <defs>
                <linearGradient id="gPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.primary} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C.primary} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid {...sharedGridProps} />
              <XAxis dataKey="label" {...sharedAxisProps}>
                <Label value="Weeks Since Launch" offset={-18} position="insideBottom" style={{ fill: C.muted, fontSize: 10 }} />
              </XAxis>
              <YAxis {...sharedAxisProps} width={38}>
                <Label value="Provider's Presence" angle={-90} position="insideLeft" style={{ fill: C.muted, fontSize: 10, textAnchor: "middle" }} />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="providerPresence"
                name="Provider Presence"
                stroke={C.primary}
                strokeWidth={2.5}
                fill="url(#gPrimary)"
                dot={{ r: 3.5, fill: C.primary, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: C.primary }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* CHART 2 — Game Availability */}
      <div style={{ marginBottom: 20 }}>
        <ChartCard
          title="Game Availability"
          subtitle="Game adoption vs provider's total distribution footprint per week"
          badge="Comparative"
        >
          <LegendRow items={[
            ["Provider Presence", C.provider],
            ["Game Presence", C.game],
          ]} />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.weekly} margin={{ top: 4, right: 16, left: 0, bottom: 28 }} barSize={14} barCategoryGap="28%">
              <CartesianGrid {...sharedGridProps} />
              <XAxis dataKey="label" {...sharedAxisProps}>
                <Label value="Weeks Since Launch" offset={-18} position="insideBottom" style={{ fill: C.muted, fontSize: 10 }} />
              </XAxis>
              <YAxis {...sharedAxisProps} width={38} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="providerPresence" name="Provider Presence" fill={C.provider} radius={[3, 3, 0, 0]} />
              <Bar dataKey="gamePresence" name="Game Presence" fill={C.game} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>


      {/* ── CHART 3 — Total Casinos Across Sections (Stacked BarChart) ───────── */}
      <div style={{ marginBottom: 20 }}>
        <ChartCard
          title="Total Casinos Across Sections"
          subtitle="Absolute casino counts per placement section over time"
          badge="Section Totals"
        >
          <LegendRow items={[
            ["New Games", C.newG],
            ["Popular", C.popular],
            ["Slots", C.slots],
            ["Live Casino", C.live],
            ["Other", C.other],
          ]} />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={d.sectionMapping} margin={{ top: 4, right: 16, left: 0, bottom: 28 }} barSize={28} barCategoryGap="35%">
              <CartesianGrid {...sharedGridProps} />
              <XAxis dataKey="label" {...sharedAxisProps}>
                <Label value="Weeks Since Launch" offset={-18} position="insideBottom" style={{ fill: C.muted, fontSize: 10 }} />
              </XAxis>
              <YAxis {...sharedAxisProps} tickFormatter={v => `${v}`} width={38} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="newGames" name="New Games" stackId="s" fill={C.newG} />
              <Bar dataKey="popular" name="Popular" stackId="s" fill={C.popular} />
              <Bar dataKey="slots" name="Slots" stackId="s" fill={C.slots} />
              <Bar dataKey="liveCasino" name="Live Casino" stackId="s" fill={C.live} />
              <Bar dataKey="other" name="Other" stackId="s" fill={C.other} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      {/* OPERATOR MATRIX TABLE — per-operator weekly availability */}
      <ChartCard
        title="Game's Availability on Operators"
        subtitle="Per-operator weekly availability from launch week"
        badge="Operator View"
      >
        <div style={{
          overflowX: "auto",
          maxHeight: 340,
          overflowY: "auto",
          borderRadius: 8,
          border: `1px solid ${C.border}`,
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, minWidth: 520 }}>
            <thead>
              <tr style={{ position: "sticky", top: 0, zIndex: 2, background: "#26215C" }}>
                <th style={{ textAlign: "left", padding: "9px 14px", color: "#CECBF6", fontWeight: 500, fontSize: 11, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  Operator
                </th>
                <th style={{ textAlign: "left", padding: "9px 14px", color: "#CECBF6", fontWeight: 500, fontSize: 11, whiteSpace: "nowrap" }}>
                  Geography
                </th>
                {d.operatorWeeks.map(w => (
                  <th key={w} style={{ textAlign: "center", padding: "9px 6px", color: "#CECBF6", fontWeight: 500, fontSize: 11, minWidth: 34, whiteSpace: "nowrap" }}>
                    {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.operatorMatrix.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: `1px solid ${C.border}`,
                    background: i % 2 === 0 ? "#ffffff" : "#f7f8fd",
                  }}
                >
                  <td style={{ padding: "7px 14px", color: "#534AB7", fontWeight: 600, fontSize: 11.5, whiteSpace: "nowrap" }}>
                    {row.operator}
                  </td>
                  <td style={{ padding: "7px 14px", color: C.muted, fontSize: 11.5, whiteSpace: "nowrap" }}>
                    {row.geography}
                  </td>
                  {row.availability.map((v, j) => (
                    <td key={j} style={{ textAlign: "center", padding: "6px 4px" }}>
                      {v === 1 ? (
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#C0DD97", color: "#27500A",
                          fontSize: 11, fontWeight: 600,
                        }}>✓</span>
                      ) : v === 0 ? (
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#FAECE7", color: "#993C1D",
                          fontSize: 13,
                        }}>●</span>
                      ) : (
                        <span style={{
                          display: "inline-block",
                          width: 14, height: 2, borderRadius: 1,
                          background: "#EF9F27", verticalAlign: "middle",
                        }} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ marginTop: 12, display: "flex", gap: 18, fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", background: "#C0DD97", color: "#27500A", fontSize: 10, fontWeight: 600 }}>✓</span>
            Found / live
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", background: "#FAECE7", color: "#993C1D", fontSize: 12 }}>●</span>
            Not found
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-block", width: 14, height: 2, borderRadius: 1, background: "#EF9F27" }} />
            Not searched
          </span>
        </div>
      </ChartCard>
    </Paper>
  );
};

export default GameLaunchAnalysisPage;