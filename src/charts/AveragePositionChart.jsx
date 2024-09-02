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
import dayjs from "dayjs";

const AveragePositionChart = ({ trackingDetails }) => {
  const data = trackingDetails?.daywise_data.map(
    ({ created_date, overall_game_position }) => ({
      date: dayjs(created_date).format("DD-MMM-YYYY"),
      overall_game_position: overall_game_position,
    })
  );

  const minY = trackingDetails?.daywise_data.map(
    (item) => item.overall_game_position
  );

  const CustomTick = ({ x, y, payload }) => (
    <Text x={x} y={y} dy={10} textAnchor="middle" fill="#666" angle={-45}>
      {payload.value}
    </Text>
  );

  return (
    <>
      <div className="tracker-details-head mb-5">
        <h5 className="m-0">Average Position Changes</h5>
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
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="5 5" vertical={false} />
            <XAxis dataKey="date" interval={0} tick={<CustomTick />} />
            <YAxis
              tickFormatter={(tick) => `${tick}`}
              ticks={minY}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="overall_game_position"
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

export default AveragePositionChart;
