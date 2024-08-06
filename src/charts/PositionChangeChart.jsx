import React from "react";
import ReactApexChart from "react-apexcharts";

const PositionChangeChart = ({ gameTracking }) => {
  console.log("gameTracking", gameTracking);

  if (!gameTracking) {
    return <p>No data available</p>;
  }

  const neutral =
    gameTracking?.tracker_count?.count -
    gameTracking?.trackers_gaining_position?.count;

  const gainers =
    gameTracking?.tracker_count?.count -
    gameTracking?.trackers_gaining_position?.count;

  const losers =
    gameTracking?.tracker_count?.count -
    gameTracking?.trackers_losing_position?.count;

  const series = [gainers, losers, neutral];
  const options = {
    chart: {
      height: 320,
      type: "pie",
    },
    series: [gainers, losers, neutral],
    labels: [
      `Gainers (${gainers})`,
      `Losers (${losers})`,
      `Neutral (${neutral})`,
    ],

    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      verticalAlign: "middle",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <>
      <span>Position Changes</span>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height="320"
      />
    </>
  );
};

export default PositionChangeChart;
