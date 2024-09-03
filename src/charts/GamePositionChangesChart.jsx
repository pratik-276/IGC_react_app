

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import dayjs from 'dayjs';

Chart.register(...registerables);
Chart.register(annotationPlugin);

const MyChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const data = [
      { x: 4, y: 5, width: 4, height: 5, label: 4 },
      { x: 4, y: 10, width: 4, height: 5, label: 7 },
      { x: 8, y: 15, width: 4, height: 5, label: 12 },
      { x: 8, y: 25, width: 4, height: 5, label: 16 },
      { x: 12, y: 5, width: 4, height: 5, label: 8 },
      { x: 16, y: 0, width: 4, height: 5, label: 6 },
      { x: 20, y: 10, width: 4, height: 5, label: 12 }, 
      { x: 24, y: 20, width: 4, height: 5, label: 18 },
      { x: 24, y: 30, width: 4, height: 5, label: 9 },
    ];

    const rectangles = data.map(o => ({
      type: 'box',
      backgroundColor: 'rgba(0, 0, 254, 0.4)',
      xMin: o.x,
      yMin: o.y,
      xMax: o.x + o.width,
      yMax: o.y + o.height
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
      xValue: o.x + o.width / 2,
      yValue: o.y + o.height / 2
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
            suggestedMin: 0,
            suggestedMax: 32,
            ticks: {
              stepSize: 4
            }
          },
          y: {
            suggestedMin: 0,
            suggestedMax: 35,
            ticks: {
              stepSize: 5
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
