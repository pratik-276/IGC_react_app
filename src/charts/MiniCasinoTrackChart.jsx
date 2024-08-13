import React from "react";
import ReactApexChart from "react-apexcharts";

const MiniCasinoTrackChart = () => {
  const options = {
    chart: {
      width: 370,
      height: 46,
      type: "area",
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
      background: "transparent", 
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1.5, 
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [50, 100, 100, 100],
      },
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: false,
      },
      axisBorder: {
        show: false, // Hide axis border
      },
      axisTicks: {
        show: false, // Hide axis ticks
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false, // Hide axis border
      },
      axisTicks: {
        show: false, // Hide axis ticks
      },
    },
  };

  const series = [
    {
      name: "Data",
      data: [
        { x: new Date("2024-01-01").getTime(), y: 20 },
        { x: new Date("2024-02-01").getTime(), y: 40 },
        { x: new Date("2024-03-01").getTime(), y: 30 },
        { x: new Date("2024-04-01").getTime(), y: 50 },
        { x: new Date("2024-05-01").getTime(), y: 60 },
        { x: new Date("2024-05-01").getTime(), y: 40 },
        { x: new Date("2024-05-01").getTime(), y: 20 },
        { x: new Date("2024-05-01").getTime(), y: 70 },
      ],
    },
  ];

  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={46}
        width={370}
        className="apex-charts"
      />
    </>
  );
};

export default MiniCasinoTrackChart;
