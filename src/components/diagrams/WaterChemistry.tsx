"use client";

export function WaterChemistry() {
  const params = [
    { label: "pH Level", low: "6.0", target: "7.2 - 7.8", high: "9.0", lowRisk: "Corrosive", highRisk: "Scaling", color: "#0891b2" },
    { label: "FAC (Indoor)", low: "0", target: "1.0 - 3.0 ppm", high: "5.0+", lowRisk: "Infection risk", highRisk: "Surface damage", color: "#22c55e" },
    { label: "FAC (Outdoor)", low: "0", target: "2.0 - 4.0 ppm", high: "5.0+", lowRisk: "Infection risk", highRisk: "Surface damage", color: "#16a34a" },
    { label: "LSI Index", low: "-2.0", target: "-0.3 to +0.3", high: "+2.0", lowRisk: "Dissolves surfaces", highRisk: "Heavy scaling", color: "#8b5cf6" },
  ];

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Water Chemistry Balance - Key Parameters
      </p>
      <svg viewBox="0 0 700 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="450" rx="12" fill="#fafaf9" />

        {params.map((param, i) => {
          const y = 30 + i * 100;
          const barX = 155;
          const barW = 420;

          return (
            <g key={i}>
              {/* Parameter label */}
              <rect x="20" y={y + 6} width="120" height="44" rx="12" fill={param.color} opacity="0.08" />
              <text x="80" y={y + 24} textAnchor="middle" fontSize="14" fontWeight="700" fill={param.color} fontFamily="system-ui">
                {param.label}
              </text>
              <text x="80" y={y + 41} textAnchor="middle" fontSize="10" fill={param.color} opacity="0.7" fontFamily="system-ui">
                Target: {param.target}
              </text>

              {/* Scale bar */}
              <rect x={barX} y={y + 10} width={barW} height="34" rx="17" fill="#f5f5f4" />

              {/* Danger zone left */}
              <rect x={barX} y={y + 10} width={barW * 0.25} height="34" rx="17" fill="#ef4444" opacity="0.08" />

              {/* Safe zone */}
              <rect x={barX + barW * 0.3} y={y + 10} width={barW * 0.4} height="34" rx="4" fill={param.color} opacity="0.1" />

              {/* Danger zone right */}
              <clipPath id={`clip-right-${i}`}>
                <rect x={barX + barW * 0.75} y={y + 10} width={barW * 0.25} height="34" rx="17" />
              </clipPath>
              <rect x={barX + barW * 0.75} y={y + 10} width={barW * 0.25} height="34" fill="#ef4444" opacity="0.08" clipPath={`url(#clip-right-${i})`} />

              {/* Target zone highlight */}
              <rect x={barX + barW * 0.33} y={y + 13} width={barW * 0.34} height="28" rx="14" fill={param.color} opacity="0.15" stroke={param.color} strokeWidth="1.5" />
              <text x={barX + barW * 0.5} y={y + 32} textAnchor="middle" fontSize="11" fontWeight="600" fill={param.color} fontFamily="system-ui">
                SAFE RANGE
              </text>

              {/* Low value */}
              <text x={barX + 12} y={y + 32} fontSize="11" fontWeight="600" fill="#ef4444" fontFamily="system-ui">
                {param.low}
              </text>

              {/* High value */}
              <text x={barX + barW - 12} y={y + 32} textAnchor="end" fontSize="11" fontWeight="600" fill="#ef4444" fontFamily="system-ui">
                {param.high}
              </text>

              {/* Risk labels */}
              <text x={barX + barW * 0.12} y={y + 62} textAnchor="middle" fontSize="10" fill="#ef4444" fontFamily="system-ui">
                {param.lowRisk}
              </text>
              <text x={barX + barW * 0.88} y={y + 62} textAnchor="middle" fontSize="10" fill="#ef4444" fontFamily="system-ui">
                {param.highRisk}
              </text>
            </g>
          );
        })}

        {/* Footer */}
        <rect x="160" y="418" width="380" height="24" rx="12" fill="#8b5cf6" opacity="0.06" />
        <text x="350" y="435" textAnchor="middle" fontSize="11" fill="#78716c" fontFamily="system-ui">
          LSI (Langelier Saturation Index) = tendency to scale or corrode
        </text>
      </svg>
    </div>
  );
}
