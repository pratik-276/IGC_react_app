import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const B = {
  brand:     "#392F6C",
  brandPale: "#EDE9F8",
  amber:     "#F9A825",
  green:     "#2E7D32",
  greenBg:   "#E8F5E9",
  red:       "#B71C1C",
  redBg:     "#FDECEA",
  divider:   "#E3E0F0",
  textMuted: "#7B6BC0",
};

const AvailBadge = ({ value }) => {
  if (value === 1)
    return (
      <Box sx={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 24, height: 24, borderRadius: "50%",
        bgcolor: B.greenBg, color: B.green,
        fontSize: 13, fontWeight: 700, lineHeight: 1,
      }}>✓</Box>
    );
  if (value === 0)
    return (
      <Box sx={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 24, height: 24, borderRadius: "50%",
        bgcolor: B.redBg, color: B.red,
        fontSize: 14, fontWeight: 700, lineHeight: 1,
      }}>✕</Box>
    );
  return (
    <Box sx={{
      display: "inline-block",
      width: 20, height: 3,
      bgcolor: B.amber,
      borderRadius: "2px",
      verticalAlign: "middle",
    }} />
  );
};

const LEGEND_ITEMS = [
  [1,    "Found / live"],
  [0,    "Not found"],
  [null, "Not searched"],
];

const OperatorMatrix = ({ data, weeks }) => (
  <>
    <Box sx={{
      overflowX: "auto", overflowY: "auto", maxHeight: 400,
      border: `1px solid ${B.divider}`, borderRadius: 1,
    }}>
      <table style={{ width: "max-content", minWidth: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ position: "sticky", top: 0, zIndex: 4 }}>
            <th style={{ position: "sticky", left: 0, zIndex: 5, minWidth: 140, background: B.brand, color: "#fff", fontWeight: 500, fontSize: 12, textAlign: "left", padding: "10px 14px", whiteSpace: "nowrap", borderRight: "1px solid rgba(255,255,255,0.18)" }}>
              Operator
            </th>
            <th style={{ position: "sticky", left: 140, zIndex: 5, minWidth: 130, background: B.brand, color: "#fff", fontWeight: 500, fontSize: 12, textAlign: "left", padding: "10px 14px", whiteSpace: "nowrap", borderRight: "2px solid rgba(255,255,255,0.28)" }}>
              Geography
            </th>
            {weeks.map(w => (
              <th key={w} style={{ background: B.brand, color: "#fff", fontWeight: 500, fontSize: 12, textAlign: "center", padding: "10px 8px", minWidth: 42, whiteSpace: "nowrap", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
                W{w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={{ background: i % 2 === 0 ? "#ffffff" : "#F7F5FC" }}
              onMouseEnter={e => e.currentTarget.style.background = B.brandPale}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#ffffff" : "#F7F5FC"}
            >
              <td style={{ position: "sticky", left: 0, zIndex: 1, background: "inherit", padding: "8px 14px", color: B.brand, fontWeight: 500, whiteSpace: "nowrap", borderRight: `1px solid ${B.divider}`, borderBottom: `1px solid ${B.divider}`, minWidth: 140 }}>
                {row.operator}
              </td>
              <td style={{ position: "sticky", left: 140, zIndex: 1, background: "inherit", padding: "8px 14px", color: B.textMuted, whiteSpace: "nowrap", borderRight: `2px solid ${B.divider}`, borderBottom: `1px solid ${B.divider}`, minWidth: 130 }}>
                {row.geography}
              </td>
              {row.availability.map((v, j) => (
                <td key={j} style={{ textAlign: "center", padding: "7px 4px", borderRight: `1px solid ${B.divider}`, borderBottom: `1px solid ${B.divider}`, minWidth: 42 }}>
                  <AvailBadge value={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>

    <Stack direction="row" flexWrap="wrap" gap={2.5} mt={1.5} pt={1.5} sx={{ borderTop: `1px solid ${B.divider}` }}>
      {LEGEND_ITEMS.map(([val, label], i) => (
        <Stack key={i} direction="row" alignItems="center" gap={0.8}>
          <AvailBadge value={val} />
          <Typography variant="caption" sx={{ color: B.textMuted }}>{label}</Typography>
        </Stack>
      ))}
    </Stack>
  </>
);

export default OperatorMatrix;