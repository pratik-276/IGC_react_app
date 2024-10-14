import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import dayjs from "dayjs";

Chart.register(...registerables);
Chart.register(annotationPlugin);

const MyChart = ({ trackingDetails }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let xValue = 1;
    const data = trackingDetails?.daywise_data.map(
      ({ created_date, section_position, section_name, game_position }) => ({
        x_label: dayjs(created_date).format("MMM DD"),
        x: xValue++,
        width: 1,
        height: 1,
        y: section_position,
        y_label: section_name + " - " + section_position,
        label: game_position,
      })
    );
    console.log(data);

    // const uniqueYLabels = [...new Set(data.map((o) => o.y_label))];
    const uniqueYLabels = ["Table Games - 11"];
    const indices = uniqueYLabels.map((_, index) => index + 1);
    console.log("indices", indices);
    // const indices = uniqueYLabels.map(label => parseInt(label.split('-')[1].trim(), 10));
    // const uniqueYLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const rectangles = data.map((o) => ({
      type: "box",
      backgroundColor: "rgba(0, 0, 254, 0.4)",
      xMin: o.x - 2,
      yMin: o.y - 2,
      xMax: o.x + o.width - 2,
      yMax: o.y + o.height - 2,
    }));

    const labels = data.map((o) => ({
      type: "label",
      content: o.label,
      color: "white",
      font: {
        size: 16,
      },
      position: {
        x: "center",
        y: "center",
      },
      xValue: o.x + o.width / 2 - 2,
      yValue: o.y + o.height / 2 - 2,
    }));

    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "scatter",
      options: {
        plugins: {
          annotation: {
            annotations: rectangles.concat(labels),
          },
        },
        scales: {
          x: {
            position: "bottom",
            reverse: true,
            suggestedMin: 0,
            ticks: {
              stepSize: 1,
              align: "center",
              callback: (value, index) => {
                const customXLabels = data.map((item) => item.x_label);
                return customXLabels[value] || "";
              },
              labelOffset: 40,
            },
          },

          y: {
            suggestedMin: 1,
            reverse: true,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                // Calculate the label based on the reverse order
                return indices[indices.length - 1 - value] || "";
              },
              labelOffset: 30,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        Chart.getChart(chartRef.current).destroy();
      }
    };
  }, [trackingDetails]);

  return (
    <div>
      <div className="tracker-details-head mb-5">
        <h5 className="m-0">Game Position Changes</h5>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MyChart;
