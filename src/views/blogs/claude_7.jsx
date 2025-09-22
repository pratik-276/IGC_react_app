import React, { useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';

const CLAUDE7 = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Data from the crash games publishing trends table (2013-2025)
  const yearlyData = {
    2013: 1,
    2014: 0,
    2015: 1,
    2016: 1,
    2017: 3,
    2018: 3,
    2019: 7,
    2020: 14,
    2021: 38,
    2022: 50,
    2023: 74,
    2024: 103,
    2025: 55
  };

  useEffect(() => {
    // Register Chart.js components
    Chart.Chart.register(
      Chart.BarController,
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.BarElement,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend
    );

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(yearlyData),
          datasets: [{
            label: 'Crash Games Released',
            data: Object.values(yearlyData),
            backgroundColor: '#37DBD1',
            borderColor: '#37DBD1',
            borderWidth: 1,
            borderRadius: 0,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              cornerRadius: 6,
              displayColors: false,
              callbacks: {
                title: function(context) {
                  return `Year ${context[0].label}`;
                },
                label: function(context) {
                  const year = context.label;
                  const value = context.parsed.y;
                  
                  return [
                    `Crash Games: ${value}`,
                    getYearInsight(year, value)
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
                font: { size: 14, weight: 'bold' },
                color: '#666'
              },
              grid: {
                display: false
              },
              ticks: {
                color: '#666',
                font: { size: 12 }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Crash Games Released',
                font: { size: 14, weight: 'bold' },
                color: '#666'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                drawBorder: false
              },
              beginAtZero: true,
              ticks: {
                color: '#666',
                font: { size: 12 }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
          }
        },
        plugins: [{
          afterDatasetsDraw: function(chart) {
            const ctx = chart.ctx;
            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0);

            meta.data.forEach((bar, index) => {
              const value = dataset.data[index];
              if (value > 0) {
                const position = bar.getCenterPoint();
                
                ctx.fillStyle = '#2c3e50';
                ctx.font = 'bold 11px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                // Position label above bar
                ctx.fillText(value.toString(), position.x, bar.y - 5);
              }
            });
          }
        }]
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Helper function for tooltip
  const getYearInsight = (year, value) => {
    if (year == 2013) return "First crash game released";
    if (year == 2024) return "Peak year for crash games";
    if (year == 2021) return "Breakthrough year - mainstream adoption";
    if (value == 0) return "No crash games released";
    if (value >= 50) return "High activity year";
    if (value >= 20) return "Growing adoption";
    return "Early development phase";
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="px-10 py-8 border-b border-gray-200" style={{ textAlign: 'center' }}>
        <h1 className="text-2xl font-semibold text-gray-800">
          Crash Games Publishing Trends by Year
        </h1>
      </div>

      {/* Chart */}
      <div className="px-10 py-5">
        <div className="relative h-96 bg-white">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE7;