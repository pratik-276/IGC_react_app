import React, { useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';

const CLAUDE1 = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Register Chart.js components
    Chart.Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.BarElement,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend
    );

    // Data for selected casino sections
    const sectionData = {
      labels: [
        'Slots', 'Popular Games', 'Table Games', 'Jackpots', 'New Games', 
        'Live Casino', 'Megaways', 'Crash Games', 'Scratch Games', 
        'Bingo', 'Keno'
      ],
      datasets: [{
        label: 'Percentage of Total Sections',
        data: [8.1, 7.4, 5.8, 5.0, 3.5, 3.3, 2.7, 2.5, 1.9, 0.6, 0.6],
        backgroundColor: '#917AFD',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
      }]
    };

    const config = {
      type: 'bar',
      data: sectionData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#667eea',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const percentage = context.parsed.y;
                return `${context.label}: ${percentage}% of all sections`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 14,
                family: 'Arial'
              },
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 12,
                family: 'Arial'
              },
              callback: function(value) {
                return value + '%';
              }
            },
            title: {
              display: true,
              text: 'Percentage of Total Sections (%)',
              color: '#374151',
              font: {
                size: 14,
                weight: 'bold',
                family: 'Arial'
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    };

    // Create the chart
    chartInstance.current = new Chart.Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      margin: 0,
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        height: '400px'
      }}>
        <div style={{
          background: '#8B5CF6',
          color: 'white',
          padding: '20px 30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '300'
          }}>
            Casino Section Distribution Chart
          </h1>
          <p style={{
            margin: '8px 0 0 0',
            opacity: 0.9,
            fontSize: '14px'
          }}>
            Note: The "Other" section contributing to 52.5% of all sections has been excluded from this illustration
          </p>
        </div>
        
        <div style={{
          padding: '20px',
          position: 'relative',
          height: 'calc(100% - 120px)'
        }}>
          <canvas ref={chartRef} id="sectionChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE1;