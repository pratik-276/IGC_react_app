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
  // Extract unique dates from trackingDetails
  const dates = [...new Set(trackingDetails?.daywise_data?.map(row => row.created_date))];
  // console.log(dates);

  // Get the maximum game_position for each date
  const dateWiseData = dates.map(date =>
    Math.min(
      ...trackingDetails?.daywise_data
        .filter(d => d.created_date === date)
        .map(d => d.overall_game_nonvisible_position)
    )
  );
  // console.log(dateWiseData);

  // Prepare the chart data
  const chartData = dates.map((d, index) => {
    return {
      date: new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(d)),
      game_position: dateWiseData[index]
    };
  }).reverse();
  // console.log(chartData);

  const data =
    trackingDetails?.daywise_data
      ?.map(({ created_date, game_position }) => ({
        date: dayjs(created_date).format("MMM DD"),
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
      <div className="mb-5">
        {/* <h5 className="m-0">Average Position Changes</h5> */}
        <h5 className="font-semibold pl-2">Daily Treand</h5>
      </div>
      <div
        style={{ width: "100%", height: 300, backgroundColor: "transparent" }}
      >
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
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
