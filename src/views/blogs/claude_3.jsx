import React from 'react';

const CLAUDE3 = () => {
  // Data from the previous analysis
  const providerData = [
    { provider: "Pixiu Gaming", totalGames: 22, kenoGames: 11, kenoPercentage: 50.00 },
    { provider: "TV Bet", totalGames: 12, kenoGames: 3, kenoPercentage: 25.00 },
    { provider: "Concept Gaming", totalGames: 11, kenoGames: 1, kenoPercentage: 9.09 },
    { provider: "Bragg Gaming", totalGames: 13, kenoGames: 1, kenoPercentage: 7.69 },
    { provider: "Gromada Games", totalGames: 13, kenoGames: 1, kenoPercentage: 7.69 },
    { provider: "Galaxsys", totalGames: 40, kenoGames: 3, kenoPercentage: 7.50 },
    { provider: "Spribe", totalGames: 28, kenoGames: 2, kenoPercentage: 7.14 },
    { provider: "NeoGames", totalGames: 51, kenoGames: 3, kenoPercentage: 5.88 },
    { provider: "Caleta Gaming", totalGames: 146, kenoGames: 8, kenoPercentage: 5.48 },
    { provider: "Kiron Interactive", totalGames: 37, kenoGames: 2, kenoPercentage: 5.41 },
    { provider: "Pascal Gaming", totalGames: 65, kenoGames: 3, kenoPercentage: 4.62 },
    { provider: "7777 Gaming", totalGames: 128, kenoGames: 5, kenoPercentage: 3.91 },
    { provider: "Bwin.Party", totalGames: 28, kenoGames: 1, kenoPercentage: 3.57 },
    { provider: "InOut Games", totalGames: 31, kenoGames: 1, kenoPercentage: 3.23 },
    { provider: "Nsoft", totalGames: 32, kenoGames: 1, kenoPercentage: 3.13 },
    { provider: "Expanse Studios", totalGames: 66, kenoGames: 2, kenoPercentage: 3.03 },
    { provider: "Realistic", totalGames: 66, kenoGames: 2, kenoPercentage: 3.03 },
    { provider: "TaDa Gaming", totalGames: 105, kenoGames: 3, kenoPercentage: 2.86 },
    { provider: "Smartsoft Gaming", totalGames: 106, kenoGames: 3, kenoPercentage: 2.83 },
    { provider: "ZeusPlay", totalGames: 36, kenoGames: 1, kenoPercentage: 2.78 },
    { provider: "PlayPearls", totalGames: 36, kenoGames: 1, kenoPercentage: 2.78 },
    { provider: "Mascot Gaming", totalGames: 151, kenoGames: 4, kenoPercentage: 2.65 },
    { provider: "1X2gaming", totalGames: 191, kenoGames: 5, kenoPercentage: 2.62 },
    { provider: "InBet Games", totalGames: 280, kenoGames: 7, kenoPercentage: 2.50 },
    { provider: "Atomic Slot Lab", totalGames: 42, kenoGames: 1, kenoPercentage: 2.38 },
    { provider: "G.Games", totalGames: 97, kenoGames: 2, kenoPercentage: 2.06 },
    { provider: "Turbo Games", totalGames: 50, kenoGames: 1, kenoPercentage: 2.00 },
    { provider: "Funky Games", totalGames: 102, kenoGames: 2, kenoPercentage: 1.96 },
    { provider: "Woohoo", totalGames: 53, kenoGames: 1, kenoPercentage: 1.89 },
    { provider: "Genii", totalGames: 140, kenoGames: 2, kenoPercentage: 1.43 },
    { provider: "Air Dice", totalGames: 74, kenoGames: 1, kenoPercentage: 1.35 },
    { provider: "Aristocrat", totalGames: 78, kenoGames: 1, kenoPercentage: 1.28 },
    { provider: "Wizard Games", totalGames: 164, kenoGames: 2, kenoPercentage: 1.22 },
    { provider: "OneTouch", totalGames: 82, kenoGames: 1, kenoPercentage: 1.22 },
    { provider: "Amusnet", totalGames: 333, kenoGames: 4, kenoPercentage: 1.20 },
    { provider: "Lightning Box", totalGames: 90, kenoGames: 1, kenoPercentage: 1.11 },
    { provider: "AGT Software", totalGames: 94, kenoGames: 1, kenoPercentage: 1.06 },
    { provider: "Playtech Origins", totalGames: 105, kenoGames: 1, kenoPercentage: 0.95 },
    { provider: "Tom Horn Gaming", totalGames: 112, kenoGames: 1, kenoPercentage: 0.89 },
    { provider: "Spinoro", totalGames: 117, kenoGames: 1, kenoPercentage: 0.85 },
    { provider: "Rival Gaming", totalGames: 121, kenoGames: 1, kenoPercentage: 0.83 },
    { provider: "Skywind Group", totalGames: 276, kenoGames: 2, kenoPercentage: 0.72 },
    { provider: "High 5 Games", totalGames: 330, kenoGames: 2, kenoPercentage: 0.61 },
    { provider: "Evoplay", totalGames: 362, kenoGames: 2, kenoPercentage: 0.55 },
    { provider: "RTG", totalGames: 197, kenoGames: 1, kenoPercentage: 0.51 },
    { provider: "IGT", totalGames: 496, kenoGames: 2, kenoPercentage: 0.40 },
    { provider: "NYX Gaming Group", totalGames: 284, kenoGames: 1, kenoPercentage: 0.35 },
    { provider: "PariPlay", totalGames: 292, kenoGames: 1, kenoPercentage: 0.34 },
    { provider: "Play'n Go", totalGames: 667, kenoGames: 2, kenoPercentage: 0.30 },
    { provider: "KA Gaming", totalGames: 681, kenoGames: 1, kenoPercentage: 0.15 },
    { provider: "Playtech", totalGames: 922, kenoGames: 1, kenoPercentage: 0.11 }
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

  // Color scale based on Keno percentage - matching your image
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
          fontFamily: 'Syne, sans-serif'
        }}>
          Keno Game Providers Analysis
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          margin: '0',
          fontFamily: 'Syne, sans-serif'
        }}>
          Bubble size = Total Games | X-axis = % Keno Games | Y-axis = Total Keno Games
        </p>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '0px' }}>
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
                  <text x={x} y="460" textAnchor="middle" fontSize="12" fontFamily="Arial" fill="#6b7280">
                    {tick}%
                  </text>
                </g>
              );
            })}
            <text x="430" y="485" textAnchor="middle" fontSize="14" fontFamily="Arial" fontWeight="600" fill="#374151">
              % Keno Games by Provider
            </text>
          </g>

          {/* Y-axis */}
          <g>
            <line x1="80" y1="40" x2="80" y2="440" stroke="#374151" strokeWidth="2"/>
            {[0, 2, 4, 6, 8, 10, 12].map(tick => {
              const y = 440 - (tick / 12) * 400;
              return (
                <g key={tick}>
                  <line x1="74" y1={y} x2="80" y2={y} stroke="#374151" strokeWidth="1"/>
                  <text x="70" y={y + 4} textAnchor="end" fontSize="12" fontFamily="Arial" fill="#6b7280">
                    {tick}
                  </text>
                </g>
              );
            })}
            <text x="30" y="240" textAnchor="middle" fontSize="14" fontFamily="Arial" fontWeight="600" fill="#374151"
                  transform="rotate(-90, 30, 240)">
              Total Keno Games
            </text>
          </g>

          {/* Data points */}
          <g>
            {providerData.map((provider, i) => {
              const x = 80 + (provider.kenoPercentage / 50) * 700;
              const y = 440 - (provider.kenoGames / 12) * 400;
              const radius = Math.sqrt(provider.totalGames / 922) * 40 + 3; // Scale based on max (Playtech: 922)
              
              return (
                <circle
                  key={provider.provider}
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={getColor(provider.kenoPercentage)}
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
              const shouldShowLabel = provider.kenoGames >= 4 || provider.kenoPercentage >= 7;
              
              if (!shouldShowLabel) return null;
              
              const x = 80 + (provider.kenoPercentage / 50) * 700;
              const y = 440 - (provider.kenoGames / 12) * 400;
              const radius = Math.sqrt(provider.totalGames / 922) * 40 + 3;
              
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
              transform: tooltip.x > 600 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {tooltip.provider.provider}
            </div>
            <div>Total Games: {tooltip.provider.totalGames}</div>
            <div>Keno Games: {tooltip.provider.kenoGames}</div>
            <div>Keno %: {tooltip.provider.kenoPercentage}%</div>
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
          Keno Focus Level (Bubble Color)
        </h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '32px',
          flexWrap: 'wrap'
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

export default CLAUDE3;