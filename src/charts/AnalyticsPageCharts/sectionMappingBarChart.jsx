import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Spin } from "antd";

// Format month like "May 2025"
const formatMonth = (monthString) => {
  const date = new Date(monthString + "-01");
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

// Transform data into chart format
const transformData = (rawData) => {
  const grouped = {};

  rawData.forEach(({ month, section_type, percentage }) => {
    const key = formatMonth(month);
    const typeKey = section_type.trim(); // Use name as-is

    if (!grouped[key]) {
      grouped[key] = { month: key };
    }

    grouped[key][typeKey] = percentage;
  });

  return Object.values(grouped);
};


const extractUniqueSectionTypes = (data) => {
  const sectionTypeMap = {};
  data.forEach(({ section_type }) => {
    const trimmed = section_type.trim();
    if (!sectionTypeMap[trimmed]) {
      sectionTypeMap[trimmed] = trimmed;
    }
  });
  return sectionTypeMap;
};

const colors = [
  "#FFA500", // Orange
  "#FF6347", // Tomato
  "#1E90FF", // Dodger Blue
  "#32CD32", // Lime Green
  "#8A2BE2", // Blue Violet
  "#FF1493", // Deep Pink
  "#00CED1", // Dark Turquoise
  "#A52A2A", // Brown
];

const SectionMappingBarChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Spin size="default" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999"
        }}
      >
        No data available
      </div>
    );
  }

  const chartData = transformData(data);
  const sectionTypeMap = extractUniqueSectionTypes(data);
  const sectionTypes = Object.keys(sectionTypeMap);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend verticalAlign="bottom" height={36} />
          {sectionTypes.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colors[index % colors.length]}
              name={sectionTypeMap[key]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectionMappingBarChart;
