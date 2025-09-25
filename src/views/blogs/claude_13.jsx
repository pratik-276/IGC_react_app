import React from 'react';

// Add Google Fonts import for Poppins
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const CLAUDE13 = () => {
  const metrics = [
    {
      title: 'RTP',
      value: '95.35%',
      percentile: 33.51,
      performance: 'AVERAGE - Below Market',
      performanceClass: 'average',
      takeaway: 'Lower returns than 66% of games. Players may seek higher RTP alternatives for better value.'
    },
    {
      title: 'Max Win',
      value: '5,000x',
      percentile: 57.86,
      performance: 'GOOD - Above Average',
      performanceClass: 'good',
      takeaway: 'Solid win potential that outperforms 58% of games. Appeals to players seeking decent volatility.'
    },
    {
      title: 'Min Bet',
      value: '$0.20',
      percentile: 56.90,
      performance: 'GOOD - Accessible Entry',
      performanceClass: 'good',
      takeaway: 'Reasonable entry point for most players. More accessible than 57% of games in the market.'
    },
    {
      title: 'Max Bet',
      value: '$100',
      percentile: 56.19,
      performance: 'GOOD - Moderate High-End',
      performanceClass: 'good',
      takeaway: 'Decent high-roller appeal. Higher betting limits than 56% of games, suitable for mid-tier players.'
    }
  ];

  const styles = {
    container: {
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '30px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Poppins, sans-serif'
    },
    title: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '8px',
      fontFamily: 'Poppins, sans-serif'
    },
    subtitle: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#7f8c8d',
      marginBottom: '30px',
      fontFamily: 'Poppins, sans-serif'
    },
    chartContainer: {
      height: '350px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '20px'
    },
    metricContainer: {
      height: '147.5px',
      border: '1px solid #e0e0e0',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'Poppins, sans-serif'
    },
    metricHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    metricTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#2c3e50',
      fontFamily: 'Poppins, sans-serif'
    },
    metricValue: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#917AFD',
      fontFamily: 'Poppins, sans-serif'
    },
    bulletContainer: {
      height: '20px',
      backgroundColor: '#f0f0f0',
      position: 'relative',
      marginBottom: '10px'
    },
    bulletBar: {
      height: '20px',
      backgroundColor: '#917AFD',
      transition: 'width 0.8s ease-in-out'
    },
    performanceIndicator: {
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '5px',
      fontFamily: 'Poppins, sans-serif'
    },
    excellent: {
      color: '#16a085'
    },
    good: {
      color: '#27ae60'
    },
    average: {
      color: '#f39c12'
    },
    poor: {
      color: '#e74c3c'
    },
    takeaway: {
      fontSize: '11px',
      color: '#5d6d7e',
      lineHeight: '1.3',
      fontFamily: 'Poppins, sans-serif'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Wild West Gold Megaways</div>
      <div style={styles.subtitle}>Percentile Analysis</div>
      
      <div style={styles.chartContainer}>
        {metrics.map((metric, index) => (
          <div key={index} style={styles.metricContainer}>
            <div style={styles.metricHeader}>
              <span style={styles.metricTitle}>{metric.title}</span>
              <span style={styles.metricValue}>{metric.value}</span>
            </div>
            
            <div style={styles.bulletContainer}>
              <div 
                style={{
                  ...styles.bulletBar,
                  width: `${metric.percentile}%`
                }}
              />
            </div>
            
            <div 
              style={{
                ...styles.performanceIndicator,
                ...styles[metric.performanceClass]
              }}
            >
              {metric.performance}
            </div>
            
            <div style={styles.takeaway}>
              <strong>Player Takeaway:</strong> {metric.takeaway}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CLAUDE13;