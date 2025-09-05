import React from 'react';

const CLAUDE2 = () => {
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

  // SVG dimensions and margins
  const width = 900;
  const height = 400; // Reduced from 600 to 400 (2/3 of original)
  const margin = { top: 60, right: 120, bottom: 80, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scales
  const maxKenoPercentage = Math.max(...providerData.map(d => d.kenoPercentage));
  const maxKenoGames = Math.max(...providerData.map(d => d.kenoGames));
  const maxTotalGames = Math.max(...providerData.map(d => d.totalGames));

  const xScale = (value) => (value / maxKenoPercentage) * chartWidth;
  const yScale = (value) => chartHeight - (value / maxKenoGames) * chartHeight;
  const sizeScale = (value) => Math.sqrt(value / maxTotalGames) * 40 + 5; // Min size 5, max ~45

  // Color scale based on Keno percentage
  const getColor = (percentage) => {
    if (percentage >= 20) return '#ff4444'; // High focus - Red
    if (percentage >= 10) return '#ff8844'; // Medium-high - Orange
    if (percentage >= 5) return '#ffcc44'; // Medium - Yellow
    if (percentage >= 2) return '#44cc88'; // Low-medium - Green
    return '#4488cc'; // Low - Blue
  };

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

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Keno Game Providers Analysis</h2>
        <p className="text-gray-600">
          Bubble size = Total Games Published | X-axis = % Keno Games | Y-axis = Total Keno Games
        </p>
      </div>

      <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} x={margin.left} y={margin.top} fill="url(#grid)" />

          {/* X-axis */}
          <g transform={`translate(${margin.left}, ${height - margin.bottom})`}>
            <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#333" strokeWidth="2"/>
            {[0, 10, 20, 30, 40, 50].map(tick => (
              <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
                <line y1="0" y2="6" stroke="#333" strokeWidth="1"/>
                <text y="20" textAnchor="middle" className="text-sm fill-gray-600">{tick}%</text>
              </g>
            ))}
            <text x={chartWidth / 2} y="50" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
              % Keno Games by Provider
            </text>
          </g>

          {/* Y-axis */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#333" strokeWidth="2"/>
            {[0, 2, 4, 6, 8, 10, 12].map(tick => (
              <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
                <line x1="-6" x2="0" stroke="#333" strokeWidth="1"/>
                <text x="-12" y="4" textAnchor="end" className="text-sm fill-gray-600">{tick}</text>
              </g>
            ))}
            <text x="-45" y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90, -45, ${chartHeight / 2})`} 
                  className="text-sm font-semibold fill-gray-700">
              Total Keno Games
            </text>
          </g>

          {/* Data points */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {providerData.map((provider, i) => (
              <circle
                key={provider.provider}
                cx={xScale(provider.kenoPercentage)}
                cy={yScale(provider.kenoGames)}
                r={sizeScale(provider.totalGames)}
                fill={getColor(provider.kenoPercentage)}
                fillOpacity="0.7"
                stroke={getColor(provider.kenoPercentage)}
                strokeWidth="2"
                className="cursor-pointer hover:fillOpacity-0.9 transition-all duration-200"
                onMouseEnter={(e) => handleMouseEnter(e, provider)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </g>

          {/* Labels for providers with strategic positioning */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {providerData.map((provider, i) => {
              const x = xScale(provider.kenoPercentage);
              const y = yScale(provider.kenoGames);
              const radius = sizeScale(provider.totalGames);
              
              // Show labels for:
              // 1. Top volume providers (>= 3 Keno games)
              // 2. High focus providers (>= 5% Keno focus)
              // 3. Major publishers (>= 300 total games)
              const shouldShowLabel = provider.kenoGames >= 3 || 
                                    provider.kenoPercentage >= 5 || 
                                    provider.totalGames >= 300;
              
              if (!shouldShowLabel) return null;
              
              // Determine label position to avoid overlaps
              let labelY = y - radius - 8;
              let labelX = x;
              let textAnchor = "middle";
              
              // Adjust position for edge cases
              if (y - radius - 8 < 15) { // Too close to top
                labelY = y + radius + 15;
              }
              if (x < 60) { // Too close to left
                labelX = x + radius + 5;
                textAnchor = "start";
              }
              if (x > chartWidth - 60) { // Too close to right
                labelX = x - radius - 5;
                textAnchor = "end";
              }
              
              // Shorten long names
              let displayName = provider.provider;
              if (displayName.length > 15) {
                displayName = displayName.substring(0, 13) + '...';
              }
              
              return (
                <g key={`label-${provider.provider}`}>
                  {/* Label background for readability */}
                  <rect
                    x={textAnchor === "middle" ? labelX - displayName.length * 3 : 
                      textAnchor === "start" ? labelX - 2 : labelX - displayName.length * 6 + 2}
                    y={labelY - 10}
                    width={displayName.length * 6}
                    height="14"
                    fill="rgba(255, 255, 255, 0.8)"
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth="0.5"
                    rx="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={textAnchor}
                    className="text-xs font-medium fill-gray-800 pointer-events-none"
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
            className="absolute bg-gray-800 text-white p-3 rounded-lg shadow-lg pointer-events-none z-10"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              transform: tooltip.x > width - 200 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="font-semibold">{tooltip.provider.provider}</div>
            <div className="text-sm">
              <div>Total Games: {tooltip.provider.totalGames}</div>
              <div>Keno Games: {tooltip.provider.kenoGames}</div>
              <div>Keno %: {tooltip.provider.kenoPercentage}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Legend & Insights</h3>
        <div className="flex flex-wrap gap-6">
          {/* Color Legend */}
          <div className="flex-1 min-w-64">
            <h4 className="font-medium text-gray-700 mb-2">Keno Focus Level (Color)</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">≥20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs">10-19%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs">5-9%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">2-4%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">&lt;2%</span>
              </div>
            </div>
          </div>
          
          {/* Size Legend */}
          <div className="flex-1 min-w-48">
            <h4 className="font-medium text-gray-700 mb-2">Portfolio Size (Bubble)</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-xs">Small (&lt;50)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span className="text-xs">Medium (50-200)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                <span className="text-xs">Large (200+)</span>
              </div>
            </div>
          </div>
          
          {/* Key Insights */}
          <div className="flex-1 min-w-80">
            <h4 className="font-medium text-gray-700 mb-2">Strategic Insights</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
              <span>• <strong>Pixiu Gaming:</strong> Keno specialist (50%)</span>
              <span>• <strong>Caleta Gaming:</strong> Volume leader (8 games)</span>
              <span>• <strong>Major providers:</strong> Low % but steady volume</span>
              <span>• <strong>Small specialists:</strong> High % differentiation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLAUDE2;