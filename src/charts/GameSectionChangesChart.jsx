import React, { useEffect } from "react";

const GanttChart = ({ trackingDetails }) => {
  useEffect(() => {
    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        window.google.charts.load("current", { packages: ["gantt"] });
        window.google.charts.setOnLoadCallback(drawChart);
      }
    };

    const drawChart = () => {
      const data = new window.google.visualization.DataTable();
      data.addColumn("string", "Task ID");
      data.addColumn("string", "Task Name");
      data.addColumn("string", "Resource");
      data.addColumn("date", "Start Date");
      data.addColumn("date", "End Date");
      data.addColumn("number", "Duration");
      data.addColumn("number", "Percent Complete");
      data.addColumn("string", "Dependencies");

      const transformedData = trackingDetails.daywise_data.map((item, index) => {
        const startDate = new Date(item.created_date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1); // Each task lasts one day

        return [
          `task_${index}`, // Unique ID for each task
          `${item.section_name} [${item.section_position}]`, // Task Name
          item.section_name, // Resource
          startDate, // Start Date
          endDate, // End Date
          null, // Duration
          100, // Percent Complete
          null, // Dependencies
        ];
      });

      data.addRows(transformedData);

      const options = {
        height: 600,
        gantt: {
          trackHeight: 30,
          // Make the chart more visually appealing
          defaultStartDate: new Date(trackingDetails.daywise_data[trackingDetails.daywise_data.length - 1].created_date),
        },
        hAxis: {
          format: 'dd-MM-yyyy', // Set the date format for the x-axis
          gridlines: { count: -1 }, // Show all dates
        },
      };

      const chart = new window.google.visualization.Gantt(document.getElementById("chart_div"));
      chart.draw(data, options);
    };

    if (window.google && window.google.charts) {
      loadGoogleCharts();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = loadGoogleCharts;
      document.body.appendChild(script);
    }
  }, [trackingDetails]);

  return (
    <>
      <div className="tracker-details-head mb-5">
        <h5 className="m-0">Game Section Changes</h5>
      </div>
      <div>
        <div id="chart_div" style={{ width: "100%", height: "600px" }}></div>
      </div>
    </>
  );
};

export default GanttChart;
