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
  const data =
    trackingDetails?.daywise_data
      .map(({ created_date, game_position }) => ({
        date: dayjs(created_date).format("DD-MMM-YYYY"),
        game_position: game_position,
      }))
      .reverse() || [];

  const maxPosition = Math.max(
    ...(data.map((item) => item.game_position) || [0])
  );

  const nextMultipleOfTen = Math.ceil(maxPosition / 10) * 10;
  const yTicks = Array.from(
    { length: nextMultipleOfTen / 10 + 1 },
    (_, i) => i * 10
  );

  const CustomTick = ({ x, y, payload }) => (
    <Text
      x={x}
      y={y}
      dy={15}
      textAnchor="middle"
      fill="#666"
      angle={-20}
      fontSize={13}
    >
      {payload?.value}
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
              ticks={yTicks}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="game_position"
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
