import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const MiniCasinoTrackChart = () => {
  return (
    <LineChart
      width={500}
      height={300}
      data={[
        { x: 1, y: 0.9 },
        { x: 2, y: 2.5 },
        { x: 3, y: 2 },
        { x: 5, y: 8.5 },
      ]}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="x" hide />
      <YAxis hide />
      <Tooltip />
      <Line type="monotone" dataKey="y" stroke="#8884d8" />
    </LineChart>
  );
};

export default MiniCasinoTrackChart;
