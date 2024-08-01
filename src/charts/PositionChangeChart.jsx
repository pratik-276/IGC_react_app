import React from "react";
import ReactApexChart from "react-apexcharts";

const PositionChangeChart = () => {
  const series = [50, 50, 100];
  const options = {
    chart: {
      height: 320,
      type: "pie",
    },
    series: [50, 50, 100],
    labels: ["Gainers (3)", "Losers", "Neutral"],

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
