import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import * as Chart from 'chart.js/auto';

const CLAUDE2 = () => {
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

    // Data for regional Keno adoption (regions with meaningful Keno presence)
    const kenoData = {
      labels: ['Africa', 'Eastern Europe', 'Western Europe', 'North America', 'Southeast Asia', 'South Asia', 'Latin America'],
      datasets: [{
        label: 'Percentage of Casinos with Keno',
        data: [18.4, 14.3, 4.9, 4.9, 3.2, 1.8, 1.0],
        backgroundColor: '#37DBD1',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        borderRadius: 0,
        borderSkipped: false,
      }]
    };

    const config = {
      type: 'bar',
      data: kenoData,
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
                return `${context.label}: ${percentage}% of casinos have Keno sections`;
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
            max: 20,
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
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
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
            Regional Keno Adoption
          </h1>
          <p style={{
            margin: '6px 0 0 0',
            opacity: 0.9,
            fontSize: '13px',
            fontFamily: 'Syne, sans-serif'
          }}>
            Note: Regions with negligible presence of Keno sections are excluded from this list
          </p>
        </div>
        
        <div style={{
          padding: '15px',
          position: 'relative',
          height: 'calc(100% - 100px)'
        }}>
          <canvas ref={chartRef} id="kenoChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE2;
