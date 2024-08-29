import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
} from "recharts";


const generateDateLabels = () => {
  const year = 2024;
  const month = "Dec";
  return Array.from({ length: 30 }, (_, i) => `${i + 1}-${month}-${year}`);
};

// Generate data with the formatted dates
const data = generateDateLabels().map((date) => ({
  date,
  uv: Math.random() * 250,
}));

const CustomTick = ({ x, y, payload }) => ( 
  <Text x={x} y={y} dy={10} textAnchor="middle" fill="#666" angle={-45}>
    {payload.value}
  </Text>
);

const GameSectionChangesChart = ({ trackingDetails }) => {
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
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="5 5" vertical={false} />
            <XAxis
              dataKey="date"
              tick={<CustomTick />}
              interval={0} 
            />
            <YAxis
              tickFormatter={(tick) => `${tick}`}
              ticks={[150]}
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
