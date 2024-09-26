

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';

Chart.register(...registerables);
Chart.register(annotationPlugin);

const MyChart = ({ trackingDetails }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // const data = [
    //   { x: 4, y: 5, width: 4, height: 5, label: 4 },
    //   { x: 4, y: 10, width: 4, height: 5, label: 7 },
    //   { x: 8, y: 15, width: 4, height: 5, label: 12 },
    //   { x: 8, y: 25, width: 4, height: 5, label: 16 },
    //   { x: 12, y: 5, width: 4, height: 5, label: 8 },
    //   { x: 16, y: 0, width: 4, height: 5, label: 6 },
    //   { x: 20, y: 10, width: 4, height: 5, label: 12 }, 
    //   { x: 24, y: 20, width: 4, height: 5, label: 18 },
    //   { x: 24, y: 30, width: 4, height: 5, label: 9 },
    // ];
    
    let xValue = 1;
    const data = trackingDetails?.daywise_data.map(
      ({ created_date, section_position, section_name, game_position }) => ({
        x_label: dayjs(created_date).format("MMM DD"),
        x: xValue++,
        width: 1,
        height: 1,
        y: section_position,
        y_label: section_name + ' - ' + section_position,
        label: game_position,
      })
    );
    console.log(data);

    const rectangles = data.map(o => ({
      type: 'box',
      backgroundColor: 'rgba(0, 0, 254, 0.4)',
      xMin: o.x - 2,
      yMin: o.y - 2,
      xMax: o.x + o.width - 2,
      yMax: o.y + o.height - 2
    }));

    const labels = data.map(o => ({
      type: 'label',
      content: o.label,  
      color: 'white',
      font: {
        size: 16    
      },
      position: {
        x: 'center',
        y: 'center'
      },
      xValue: o.x + o.width / 2 - 2,
      yValue: o.y + o.height / 2 - 2
    }));

    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'scatter',
      options: {
        plugins: {
          annotation: {
            annotations: rectangles.concat(labels)
          }
        },
        scales: {
          x: {
            position: 'bottom',
            reverse: true,
            suggestedMin: 0,
            ticks: {
              stepSize: 1,
              callback: (value, index) => {
                const customXLabels = data.map(item => item.x_label);
                return customXLabels[value] || '';  // Replace default label with custom one
              },
            }
          },
          y: {
            suggestedMin: 0,
            reverse: true,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                const customXLabels = data.map(item => item.y_label);
                return customXLabels[value] || '';  // Replace default label with custom one
              },
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        Chart.getChart(chartRef.current).destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default MyChart;
