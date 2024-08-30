// import React, { useEffect } from "react";

// const GameSectionChangesChart = () => {
//   const data = [
//     [
//       "Task ID",
//       "Task Name",
//       "Start Date",
//       "End Date",
//       "Duration",
//       "Percent Complete",
//       "Dependencies",
//     ],
//     [
//       "Research",
//       "Find sources",
//       new Date(2015, 0, 1),
//       new Date(2015, 0, 5),
//       null,
//       100,
//       null,
//     ],
//     [
//       "Write",
//       "Write paper",
//       null,
//       new Date(2015, 0, 9),
//       3 * 24 * 60 * 60 * 1000,
//       25,
//       "Research,Outline",
//     ],
//     [
//       "Cite",
//       "Create bibliography",
//       null,
//       new Date(2015, 0, 7),
//       1 * 24 * 60 * 60 * 1000,
//       20,
//       "Research",
//     ],
//     [
//       "Complete",
//       "Hand in paper",
//       null,
//       new Date(2015, 0, 10),
//       1 * 24 * 60 * 60 * 1000,
//       0,
//       "Cite,Write",
//     ],
//     [
//       "Outline",
//       "Outline paper",
//       null,
//       new Date(2015, 0, 6),
//       1 * 24 * 60 * 60 * 1000,
//       100,
//       "Research",
//     ],
//   ];

//   const options = {
//     height: 300,
//     gantt: {
//       trackHeight: 30,
//       barHeight: 20,
//       barCornerRadius: 5,
//       innerGridHorizLine: {
//         stroke: "#e0e0e0", // Color of horizontal grid lines
//         strokeWidth: 1,
//       },
//       innerGridVertLine: {
//         stroke: "#e0e0e0", // Color of vertical grid lines
//         strokeWidth: 1,
//       },
//       criticalPathEnabled: false, // Optional: Hide the critical path
//     },
//     hAxis: {
//       title: "Date",
//       format: "MMM dd, yyyy",
//       gridlines: {
//         color: "#e0e0e0", // Color of gridlines
//         count: 10, // Number of gridlines
//       },
//       textStyle: {
//         color: "#333", // Color of the axis labels
//       },
//     },
//     vAxis: {
//       title: "Tasks",
//       gridlines: {
//         color: "#e0e0e0", // Color of gridlines
//         count: 5, // Number of gridlines
//       },
//       textStyle: {
//         color: "#333", // Color of the axis labels
//       },
//     },
//   };

//   useEffect(() => {
//     // Load the Google Charts library and draw the chart
//     if (window.google && window.google.charts) {
//       window.google.charts.load("current", { packages: ["gantt"] });
//       window.google.charts.setOnLoadCallback(() => {
//         const chart = new window.google.visualization.Gantt(
//           document.getElementById("chart_div")
//         );
//         chart.draw(window.google.visualization.arrayToDataTable(data), options);
//       });
//     } else {
//       console.error("Google Charts library is not loaded.");
//     }
//   }, []);

//   return (
//     <div>
//       <div id="chart_div" style={{ width: "100%", height: "300px" }}></div>
//     </div>
//   );
// };

// export default GameSectionChangesChart;

// import React from "react";
// import Chart from "react-apexcharts";

// const GameSectionChangesChart = () => {
//   const options = {
//     chart: {
//       type: "rangeBar",
//     },
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         rangeBarGroupRows: true,
//       },
//     },
//     xaxis: {
//       type: "datetime",
//     },
//     yaxis: {
//       labels: {
//         formatter: (value) => `Task ${value + 1}`,
//       },
//     },
//     fill: {
//       colors: ["#00E396", "#FEB019"],
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//     },
//   };

//   const series = [
//     {
//       name: "Task 1",
//       data: [
//         {
//           x: "Task 1",
//           y: [
//             new Date("2024-01-01").getTime(),
//             new Date("2024-01-10").getTime(),
//           ],
//         },
//       ],
//     },
//   ];

//   return (
//     <div>
//       <h2>Range Bar Chart Example</h2>
//       <Chart options={options} series={series} type="rangeBar" height={400} />
//     </div>
//   );
// };

// export default GameSectionChangesChart;

import React, { useEffect } from "react";
import anychart from "anychart";
import dayjs from "dayjs";

const GameSectionChangesChart = ({ trackingDetails }) => {
  const data =
    trackingDetails?.daywise_data.map((item) => [
      dayjs(item.created_date).format("YYYY-MM-DD"), // Date on X-axis in ISO format
      item.overall_game_position - 1, // Start value for range bar
      item.overall_game_position + 1, // End value for range bar
    ]) || [];

  useEffect(() => {
    if (data.length === 0) return;

    const chart = anychart.cartesian();

    const rangeBarSeries = chart.rangeBar(data);

    chart.xAxis().title("Date");
    chart.xAxis().labels().format("{%Value}");
    // chart.xAxis().format("MMM DD, YYYY"); // Format for the X-axis labels

    chart.yAxis().title("Overall Game Position");

    chart.container("container");

    chart.draw();
  }, [data]);

  return (
    <>
      <div className="tracker-details-head mb-5">
        <h5 className="m-0">Game Section Changes</h5>
      </div>
      <div id="container" style={{ width: "100%", height: "300px" }}></div>
    </>
  );
};

export default GameSectionChangesChart;
