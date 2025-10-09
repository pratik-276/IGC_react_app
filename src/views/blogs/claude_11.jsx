import React from 'react';

const CLAUDE11 = () => {
  // Data from Megaways Providers Analysis (Code A)
  const providerData = [
    { provider: "Blueprint Gaming", totalGames: 522, megawaysGames: 114, megawaysPercentage: 21.84 },
    { provider: "Pragmatic Play", totalGames: 1354, megawaysGames: 91, megawaysPercentage: 6.72 },
    { provider: "Red Tiger", totalGames: 546, megawaysGames: 73, megawaysPercentage: 13.37 },
    { provider: "Big Time Gaming", totalGames: 132, megawaysGames: 65, megawaysPercentage: 49.24 },
    { provider: "iSoftBet", totalGames: 242, megawaysGames: 63, megawaysPercentage: 26.03 },
    { provider: "Iron Dog Studio", totalGames: 169, megawaysGames: 51, megawaysPercentage: 30.18 },
    { provider: "StakeLogic", totalGames: 234, megawaysGames: 22, megawaysPercentage: 9.4 },
    { provider: "Playtech", totalGames: 922, megawaysGames: 19, megawaysPercentage: 2.06 },
    { provider: "Inspired Gaming", totalGames: 255, megawaysGames: 19, megawaysPercentage: 7.45 },
    { provider: "NetEnt", totalGames: 407, megawaysGames: 16, megawaysPercentage: 3.93 },
    { provider: "IGT", totalGames: 496, megawaysGames: 15, megawaysPercentage: 3.02 },
    { provider: "Skywind Group", totalGames: 276, megawaysGames: 14, megawaysPercentage: 5.07 },
    { provider: "Kalamba Games", totalGames: 207, megawaysGames: 13, megawaysPercentage: 6.28 },
    { provider: "1X2gaming", totalGames: 191, megawaysGames: 12, megawaysPercentage: 6.28 },
    { provider: "Microgaming", totalGames: 400, megawaysGames: 12, megawaysPercentage: 3.0 },
    { provider: "Evolution Gaming", totalGames: 768, megawaysGames: 12, megawaysPercentage: 1.56 },
    { provider: "Reel Play", totalGames: 93, megawaysGames: 11, megawaysPercentage: 11.83 },
    { provider: "White Hat Gaming", totalGames: 47, megawaysGames: 11, megawaysPercentage: 23.4 },
    { provider: "MGA Games", totalGames: 89, megawaysGames: 11, megawaysPercentage: 12.36 },
    { provider: "White Hat Studios", totalGames: 31, megawaysGames: 10, megawaysPercentage: 32.26 }
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

  // Color scale based on Megaways percentage
  const getColor = (percentage) => {
    if (percentage >= 30) return '#ef4444'; // High Red
    if (percentage >= 20) return '#f97316'; // Orange
    if (percentage >= 10) return '#eab308'; // Yellow
    if (percentage >= 5) return '#22c55e'; // Green
    return '#3b82f6'; // Blue (low % focus)
  };

  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      height: '800px', 
      width: '100%',
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
          fontFamily: 'sans-serif'
        }}>
          Megaways Providers Analysis
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          margin: '0',
          fontFamily: 'sans-serif'
        }}>
          Bubble size = Total Games | X-axis = % Megaways Games | Y-axis = Total Megaways Games
        </p>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <svg width="800" height="500" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="700" height="400" x="80" y="40" fill="url(#grid)" />

          {/* X-axis */}
          <g>
            <line x1="80" y1="440" x2="780" y2="440" stroke="#374151" strokeWidth="2"/>
            {[0, 10, 20, 30, 40, 50].map(tick => {
              const x = 80 + (tick / 50) * 700;
              return (
                <g key={tick}>
                  <line x1={x} y1="440" x2={x} y2="446" stroke="#374151" strokeWidth="1"/>
                  <text x={x} y="460" textAnchor="middle" fontSize="12" fill="#6b7280" fontFamily="sans-serif">
                    {tick}%
                  </text>
                </g>
              );
            })}
            <text x="430" y="485" textAnchor="middle" fontSize="14" fontWeight="600" fill="#374151" fontFamily="sans-serif">
              % Megaways Games by Provider
            </text>
          </g>

          {/* Y-axis */}
          <g>
            <line x1="80" y1="40" x2="80" y2="440" stroke="#374151" strokeWidth="2"/>
            {[0, 20, 40, 60, 80, 100, 120].map(tick => {
              const y = 440 - (tick / 120) * 400;
              return (
                <g key={tick}>
                  <line x1="74" y1={y} x2="80" y2={y} stroke="#374151" strokeWidth="1"/>
                  <text x="70" y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280" fontFamily="sans-serif">
                    {tick}
                  </text>
                </g>
              );
            })}
            <text x="30" y="240" textAnchor="middle" fontSize="14" fontWeight="600" fill="#374151"
                  transform="rotate(-90, 30, 240)" fontFamily="sans-serif">
              Total Megaways Games
            </text>
          </g>

          {/* Data points */}
          <g>
            {providerData.map((provider) => {
              const x = 80 + (provider.megawaysPercentage / 50) * 700;
              const y = 440 - (provider.megawaysGames / 120) * 400;
              const radius = Math.sqrt(provider.totalGames / 1354) * 40 + 3;

              return (
                <circle
                  key={provider.provider}
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={getColor(provider.megawaysPercentage)}
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

          {/* Labels */}
          <g>
            {providerData.map((provider) => {
              const shouldShowLabel = provider.megawaysGames >= 20 || provider.megawaysPercentage >= 20;
              if (!shouldShowLabel) return null;

              const x = 80 + (provider.megawaysPercentage / 50) * 700;
              const y = 440 - (provider.megawaysGames / 120) * 400;
              const radius = Math.sqrt(provider.totalGames / 1354) * 40 + 3;

              let labelY = y - radius - 8;
              let displayName = provider.provider;
              if (displayName.length > 15) {
                displayName = displayName.substring(0, 13) + '...';
              }

              return (
                <text
                  key={`label-${provider.provider}`}
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1f2937"
                  fontFamily="sans-serif"
                >
                  {displayName}
                </text>
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
              pointerEvents: 'none',
              fontSize: '14px',
              zIndex: 10,
              fontFamily: 'sans-serif',
              transform: tooltip.x > 600 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {tooltip.provider.provider}
            </div>
            <div>Total Games: {tooltip.provider.totalGames}</div>
            <div>Megaways Games: {tooltip.provider.megawaysGames}</div>
            <div>Megaways %: {tooltip.provider.megawaysPercentage}%</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '10px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '8px 0 16px 0' }}>
          Megaways Focus Level (Bubble Color)
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ef4444', border: '2px solid #000000' }}></div>
            <span>≥30% Very High Focus</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#f97316', border: '2px solid #000000' }}></div>
            <span>20-29% High Focus</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#eab308', border: '2px solid #000000' }}></div>
            <span>10-19% Medium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#22c55e', border: '2px solid #000000' }}></div>
            <span>5-9% Low-Medium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid #000000' }}></div>
            <span>&lt;5% Low Focus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE11;
