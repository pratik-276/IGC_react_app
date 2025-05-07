import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
} from "recharts";
import dayjs from "dayjs";

const GameTrendChart = ({ data }) => {
  // Format the input data to include a "date" string like "Apr 2025"
  const formattedData = (data || []).map((item) => ({
    ...item,
    date: dayjs(`${item.year}-${item.month}-01`).format("MMM YYYY"),
  }));

  const CustomTick = ({ x, y, payload }) => (
    <Text
      x={x}
      y={y}
      dy={15}
      textAnchor="middle"
      fill="#666"
      angle={0}
      fontSize={12}
    >
      {payload?.value}
    </Text>
  );

  return (
    <div style={{ width: "100%", height: 180, backgroundColor: "transparent" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tick={<CustomTick />} />
          <YAxis
            tickFormatter={(tick) => `${tick}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />

          <Line
            type="linear"
            dataKey="rank"
            stroke="#5865F2"
            fill="none"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GameTrendChart;
