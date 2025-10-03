import React from 'react';

const CLAUDE6 = () => {
  // Crash Games Provider Data
  const providerData = [
    { provider: "KA Gaming", totalGames: 610, crashGames: 15, crashPercentage: 2.46 },
    { provider: "Onlyplay", totalGames: 129, crashGames: 11, crashPercentage: 8.53 },
    { provider: "Evoplay", totalGames: 260, crashGames: 10, crashPercentage: 3.85 },
    { provider: "Popok Gaming", totalGames: 70, crashGames: 10, crashPercentage: 14.29 },
    { provider: "Darwin Gaming", totalGames: 44, crashGames: 10, crashPercentage: 22.73 },
    { provider: "Smartsoft Gaming", totalGames: 72, crashGames: 9, crashPercentage: 12.50 },
    { provider: "Pascal Gaming", totalGames: 52, crashGames: 9, crashPercentage: 17.31 },
    { provider: "Mascot Gaming", totalGames: 116, crashGames: 8, crashPercentage: 6.90 },
    { provider: "Turbo Games", totalGames: 43, crashGames: 8, crashPercentage: 18.60 },
    { provider: "Play'n Go", totalGames: 447, crashGames: 7, crashPercentage: 1.57 },
    { provider: "BGAMING", totalGames: 208, crashGames: 7, crashPercentage: 3.37 },
    { provider: "Gaming Corps", totalGames: 73, crashGames: 7, crashPercentage: 9.59 },
    { provider: "iMoon", totalGames: 10, crashGames: 7, crashPercentage: 70.00 },
    { provider: "Spinmatic", totalGames: 94, crashGames: 7, crashPercentage: 7.45 },
    { provider: "Playtech Origins", totalGames: 84, crashGames: 6, crashPercentage: 7.14 },
    { provider: "InOut Games", totalGames: 16, crashGames: 6, crashPercentage: 37.50 },
    { provider: "Skywind Group", totalGames: 183, crashGames: 5, crashPercentage: 2.73 },
    { provider: "Caleta Gaming", totalGames: 121, crashGames: 5, crashPercentage: 4.13 },
    { provider: "Elbet", totalGames: 6, crashGames: 5, crashPercentage: 83.33 },
    { provider: "Galaxsys", totalGames: 29, crashGames: 4, crashPercentage: 13.79 },
    { provider: "Buck Stakes Entertainment", totalGames: 12, crashGames: 4, crashPercentage: 33.33 },
    { provider: "Atlas-V", totalGames: 10, crashGames: 4, crashPercentage: 40.00 },
    { provider: "100HP Gaming", totalGames: 5, crashGames: 4, crashPercentage: 80.00 },
    { provider: "Spribe", totalGames: 11, crashGames: 3, crashPercentage: 27.27 },
    { provider: "Pragmatic Play", totalGames: 643, crashGames: 3, crashPercentage: 0.47 },
    { provider: "Split The Pot", totalGames: 7, crashGames: 3, crashPercentage: 42.86 },
    { provider: "Jogo Global", totalGames: 3, crashGames: 3, crashPercentage: 100.00 },
    { provider: "FunFair", totalGames: 4, crashGames: 3, crashPercentage: 75.00 },
    { provider: "Ethereal Gaming", totalGames: 5, crashGames: 3, crashPercentage: 60.00 }
  ];

  // Tooltip state
  const [tooltip, setTooltip] = React.useState(null);

  const handleMouseEnter = (event, provider) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      provider
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // Color scale based on Crash percentage
  const getColor = (percentage) => {
    if (percentage >= 20) return '#ef4444'; // Red
    if (percentage >= 10) return '#f97316'; // Orange  
    if (percentage >= 5) return '#eab308'; // Yellow
    if (percentage >= 2) return '#22c55e'; // Green
    return '#3b82f6'; // Blue
  };

  return (
    <div style={{ 
      fontFamily: 'Syne, sans-serif', 
      height: '800px', 
      width: '800px',
      backgroundColor: '#ffffff',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 8px 0',
          fontFamily: 'Syne, sans-serif'
        }}>
          Crash Game Providers Analysis
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          margin: '0',
          fontFamily: 'Syne, sans-serif'
        }}>
          Bubble size = Total Games | X-axis = % Crash Games | Y-axis = Total Crash Games
        </p>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '0px' }}>
        <svg width="760" height="500" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="660" height="380" x="80" y="40" fill="url(#grid)" />

          {/* X-axis */}
          <g>
            <line x1="80" y1="420" x2="740" y2="420" stroke="#374151" strokeWidth="2"/>
            {[0, 20, 40, 60, 80, 100].map(tick => {
              const x = 80 + (tick / 100) * 660;
              return (
                <g key={tick}>
                  <line x1={x} y1="420" x2={x} y2="426" stroke="#374151" strokeWidth="1"/>
                  <text x={x} y="440" textAnchor="middle" fontSize="12" fontFamily="Arial" fill="#6b7280">
                    {tick}%
                  </text>
                </g>
              );
            })}
            <text x="410" y="465" textAnchor="middle" fontSize="14" fontFamily="Arial" fontWeight="600" fill="#374151">
              % Crash Games by Provider
            </text>
          </g>

          {/* Y-axis */}
          <g>
            <line x1="80" y1="40" x2="80" y2="420" stroke="#374151" strokeWidth="2"/>
            {[0, 3, 6, 9, 12, 15].map(tick => {
              const y = 420 - (tick / 15) * 380;
              return (
                <g key={tick}>
                  <line x1="74" y1={y} x2="80" y2={y} stroke="#374151" strokeWidth="1"/>
                  <text x="70" y={y + 4} textAnchor="end" fontSize="12" fontFamily="Arial" fill="#6b7280">
                    {tick}
                  </text>
                </g>
              );
            })}
            <text x="30" y="230" textAnchor="middle" fontSize="14" fontFamily="Arial" fontWeight="600" fill="#374151"
                  transform="rotate(-90, 30, 230)">
              Total Crash Games
            </text>
          </g>

          {/* Data points */}
          <g>
            {providerData.map((provider, i) => {
              const x = 80 + (provider.crashPercentage / 100) * 660;
              const y = 420 - (provider.crashGames / 15) * 380;
              const radius = Math.sqrt(provider.totalGames / 643) * 35 + 4; // Scale based on max (Pragmatic Play: 643)
              
              return (
                <circle
                  key={provider.provider}
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={getColor(provider.crashPercentage)}
                  fillOpacity="0.8"
                  stroke="#000000"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => handleMouseEnter(e, provider)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </g>

          {/* Labels for key providers */}
          <g>
            {providerData.map((provider, i) => {
              // Only show labels for providers with significant presence
              const shouldShowLabel = provider.crashGames >= 7 || provider.crashPercentage >= 15;
              
              if (!shouldShowLabel) return null;
              
              const x = 80 + (provider.crashPercentage / 100) * 660;
              const y = 420 - (provider.crashGames / 15) * 380;
              const radius = Math.sqrt(provider.totalGames / 643) * 35 + 4;
              
              let labelY = y - radius - 8;
              let labelX = x;
              
              // Adjust for edge cases
              if (labelY < 50) labelY = y + radius + 15;
              
              let displayName = provider.provider;
              if (displayName.length > 15) {
                displayName = displayName.substring(0, 13) + '...';
              }
              
              return (
                <g key={`label-${provider.provider}`}>
                  <rect
                    x={labelX - displayName.length * 3}
                    y={labelY - 10}
                    width={displayName.length * 6}
                    height="14"
                    fill="rgba(255, 255, 255, 0.9)"
                    stroke="rgba(0, 0, 0, 0.2)"
                    strokeWidth="0.5"
                    rx="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="Arial"
                    fontWeight="600"
                    fill="#1f2937"
                  >
                    {displayName}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              backgroundColor: '#1f2937',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              pointerEvents: 'none',
              zIndex: 10,
              fontFamily: 'Syne, sans-serif',
              fontSize: '14px',
              transform: tooltip.x > 500 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {tooltip.provider.provider}
            </div>
            <div>Total Games: {tooltip.provider.totalGames}</div>
            <div>Crash Games: {tooltip.provider.crashGames}</div>
            <div>Crash %: {tooltip.provider.crashPercentage}%</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '-10px', 
        paddingTop: '0px', 
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1f2937',
          margin: '8px 0 16px 0',
          fontFamily: 'Syne, sans-serif'
        }}>
          Crash Focus Level (Bubble Color)
        </h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '24px',
          flexWrap: 'nowrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: '#ef4444',
              border: '2px solid #000000'
            }}></div>
            <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Syne, sans-serif' }}>
              ≥20% High Focus
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: '#f97316',
              border: '2px solid #000000'
            }}></div>
            <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Syne, sans-serif' }}>
              10-19% Medium-High
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: '#eab308',
              border: '2px solid #000000'
            }}></div>
            <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Syne, sans-serif' }}>
              5-9% Medium
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: '#22c55e',
              border: '2px solid #000000'
            }}></div>
            <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Syne, sans-serif' }}>
              2-4% Low-Medium
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              backgroundColor: '#3b82f6',
              border: '2px solid #000000'
            }}></div>
            <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Syne, sans-serif' }}>
              &lt;2% Low Focus
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE6;