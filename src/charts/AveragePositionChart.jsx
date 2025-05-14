import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Text,
} from "recharts";
import dayjs from "dayjs";

const AveragePositionChart = ({ trackingDetails }) => {
  const dates = [...new Set(trackingDetails?.daywise_data?.map(row => row.created_date))];
  // console.log(dates);

  const dateWiseData = dates.map(date =>
    Math.min(
      ...trackingDetails?.daywise_data
        .filter(d => d.created_date === date)
        .map(d => d.overall_game_nonvisible_position)
    )
  );
  // console.log(dateWiseData);

  const chartData = dates.map((d, index) => {
    const dayData = trackingDetails?.daywise_data?.find(data => data.created_date === d);
    return {
      date: new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(d)),
      game_position: dateWiseData[index],
      section_name: dayData?.section_name,
      sectional_game_position: dayData?.game_position,
      sectional_position: dayData?.section_position,
    };
  }).reverse();
  // console.log("chartData", chartData);

  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     const { game_position, section_name, sectional_game_position, sectional_position } = payload[0].payload;

  //     return (
  //       <div className="custom-tooltip " style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "6px" }}>
  //         <h5 style={{ fontSize: "16px", margin: "0" }}>{label}</h5>
  //         <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Overall Position:</strong> {game_position}</p>
  //         <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Section Name:</strong> {section_name || "N/A"}</p>
  //         <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Sectional Game Position:</strong> {sectional_game_position || "N/A"}</p>
  //         <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Sectional Position:</strong> {sectional_position || "N/A"}</p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { game_position } = payload[0].payload;

      const normalizedLabel = dayjs(label, "MMM D").format("MMM DD");
      // console.log("Normalized label:", normalizedLabel);

      const dayData = trackingDetails?.daywise_data?.filter((data) => {
        const formattedDate = dayjs(data.created_date).format("MMM DD");
        return formattedDate === normalizedLabel;
      });

      const lowestRecord = dayData.reduce((minRecord, currentRecord) => {
        return currentRecord.overall_game_nonvisible_position < minRecord.overall_game_nonvisible_position
          ? currentRecord
          : minRecord;
      }, dayData[0]);

      // console.log("Lowest Record for the day:", lowestRecord);

      return (
        <div className="custom-tooltip" style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "6px" }}>
          <h5 style={{ fontSize: "16px", margin: "0" }}>{normalizedLabel}</h5>
          <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Overall Position:</strong> {lowestRecord.overall_game_nonvisible_position}</p>
          <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Section Name:</strong> {lowestRecord.section_name || "N/A"}</p>
          <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Sectional Game Position:</strong> {lowestRecord.game_position || "N/A"}</p>
          <p style={{ fontSize: "14px", margin: "2px 0" }}><strong>Sectional Position:</strong> {lowestRecord.section_position || "N/A"}</p>
        </div>
      );
    }
    return null;
  };





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


  const minPos = Math.min(...chartData.map(item => item.game_position));
  const maxPos = Math.max(...chartData.map(item => item.game_position));
  // console.log(minPos, maxPos);

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
    <>
      <div className="mb-5">
        {/* <h5 className="m-0">Average Position Changes</h5> */}
        <h5 className="font-semibold pl-2">Daily Trend</h5>
      </div>
      <div
        style={{ width: "100%", height: 180, backgroundColor: "transparent" }}
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
            <XAxis dataKey="date" axisLine={false} interval={3} tick={<CustomTick />} reversed />
            <YAxis
              tickFormatter={(tick) => `${tick}`}
              axisLine={false}
              tickLine={false}
              interval={0}
              domain={[minPos, maxPos]}
              reversed
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="linear"
              dataKey="game_position"
              stroke="#5865F2"
              fill="none"
              strokeWidth={2}
            />
            <ReferenceLine y={minPos} stroke="#00FFFF" strokeWidth={2} strokeDasharray="5 5" />
            <ReferenceLine y={maxPos} stroke="#DA70D6" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AveragePositionChart;
