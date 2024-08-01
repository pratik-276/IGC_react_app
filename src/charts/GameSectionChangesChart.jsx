import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateDateLabels = () => {
  const month = "Dec";
  const days = Array.from({ length: 30 }, (_, i) => `${month} ${i + 1}`);
  return days;
};

const data = generateDateLabels().map((date, index) => ({
  date,
  uv: Math.random() * 250,
}));

const GameSectionChangesChart = () => {
  return (
    <>
      <div className="tracker-details-head mb-5">
        <h5 className="m-0">Game Section Changes</h5>
      </div>
      <div
        style={{ width: "100%", height: 300, backgroundColor: "transparent" }}
      >
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(tick) => `${tick}`}
              ticks={[0, 50, 100, 150, 200, 250]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#5865F2"
              fill="none"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default GameSectionChangesChart;
