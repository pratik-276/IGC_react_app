import React, { useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';

const CLAUDE12 = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Data from the Megaways games publishing trends table (2015-2025)
  const yearlyData = {
    2015: 1,
    2016: 4,
    2017: 2,
    2018: 14,
    2019: 52,
    2020: 66,
    2021: 102,
    2022: 78,
    2023: 109,
    2024: 85,
    2025: 36
  };

  useEffect(() => {
    // Import Google Fonts - Syne
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

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
            label: 'Megaways Games Released',
            data: Object.values(yearlyData),
            backgroundColor: '#37DBD1',
            borderColor: '#37DBD1',
            borderWidth: 0,
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
                    `Megaways Games: ${value}`,
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
                font: { size: 14, weight: 'bold', family: 'Syne, sans-serif' },
                color: '#000000'
              },
              grid: {
                display: false
              },
              ticks: {
                color: '#000000',
                font: { size: 12, family: 'Syne, sans-serif' }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Megaways Games Released',
                font: { size: 14, weight: 'bold', family: 'Syne, sans-serif' },
                color: '#000000'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                drawBorder: false
              },
              beginAtZero: true,
              ticks: {
                color: '#000000',
                font: { size: 12, family: 'Syne, sans-serif' }
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
                
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 11px Syne, sans-serif';
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
    if (year == 2015) return "First Megaways game released";
    if (year == 2023) return "Peak year for Megaways games";
    if (year == 2021) return "Breakthrough year - mainstream adoption";
    if (value == 0) return "No Megaways games released";
    if (value >= 100) return "High activity year";
    if (value >= 50) return "Growing adoption";
    return "Early development phase";
  };

  return (
    <div 
      className="bg-white shadow-lg overflow-hidden" 
      style={{ 
        fontFamily: 'Syne, sans-serif',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        borderRadius: '0px'
      }}
    >
      {/* Header */}
      <div 
        className="px-10 py-6"
        style={{ 
          backgroundColor: '#37DBD1',
          textAlign: 'center',
          color: 'black'
        }}
      >
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Megaways Games Publishing Trends by Year
        </h1>
        <p className="text-sm opacity-90" style={{ fontFamily: 'Syne, sans-serif' }}>
          Note: Years that had negligible megaways game releases are excluded from this chart.
        </p>
      </div>

      {/* Chart */}
      <div className="px-10 py-8">
        <div className="relative h-96 bg-white">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE12;