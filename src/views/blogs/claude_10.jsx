import React, { useEffect, useRef } from 'react';
import * as Chart from 'chart.js/auto';

const CLAUDE10 = () => {
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

    // Data for regional Megaways adoption (regions with meaningful Crash presence)
    const crashData = {
      labels: ['Nordic', 'Western Europe','Latin America', 'Oceania', 'South Asia', 'MENA', 'North America', 'Central Asia & Eastern Europe', 'East Asia', 'Africa', 'Southeast Asia'],
      datasets: [{
        label: 'Percentage of Casinos with Crash',
        data: [39.6, 36.5, 35.5, 35.3, 34.1, 33.3, 29.5, 27.6, 22.2, 12.8, 10.3],
        backgroundColor: '#37DBD1',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
      }]
    };

    const config = {
      type: 'bar',
      data: crashData,
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
                return `${context.label}: ${percentage}% of casinos have Megaways sections`;
              }
            }
          }
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 20
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
                size: 12,
                family: 'Syne, sans-serif'
              },
              maxRotation: 35,
              minRotation: 35
            }
          },
          y: {
            beginAtZero: true,
            max: 45,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: {
                size: 11,
                family: 'Syne, sans-serif'
              },
              callback: function(value) {
                return value + '%';
              }
            },
            title: {
              display: true,
              text: '% Casinos',
              color: '#374151',
              font: {
                size: 13,
                weight: 'bold',
                family: 'Syne, sans-serif'
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
      fontFamily: 'Syne, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      margin: 0,
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '0px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        height: '400px'
      }}>
        <div style={{
          background: '#37DBD1',
          color: '#000',
          padding: '15px 25px',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: '300',
            fontFamily: 'Syne, sans-serif'
          }}>
            Regional Megaways Adoption
          </h1>
          <p style={{
            margin: '6px 0 0 0',
            opacity: 0.9,
            fontSize: '13px',
            fontFamily: 'Syne, sans-serif'
          }}>
            Note: Regions with negligible presence of Megawas sections are excluded from this list
          </p>
        </div>
        
        <div style={{
          padding: '15px',
          position: 'relative',
          height: 'calc(100% - 100px)'
        }}>
          <canvas ref={chartRef} id="crashChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE10;