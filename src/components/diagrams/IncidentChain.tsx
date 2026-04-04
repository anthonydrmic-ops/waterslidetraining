"use client";

export function IncidentChain() {
  const links = [
    { label: "Hazard", desc: "Rough surface, worn joint, chemical imbalance", color: "#a8a29e" },
    { label: "No Detection", desc: "Missed in inspection, not reported", color: "#eab308" },
    { label: "Kept Open", desc: "Slide stays open despite defect", color: "#f97316" },
    { label: "Exposure", desc: "Rider encounters the hazard", color: "#ef4444" },
    { label: "Incident", desc: "Injury, near-miss, or failure", color: "#dc2626" },
  ];

  const breaks = [
    "Inspection catches it",
    "Operator reports it",
    "Dispatch stopped",
    "Emergency response",
  ];

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Incident Chain - Every Link is a Chance to Intervene
      </p>
      <svg viewBox="0 0 720 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="720" height="320" rx="12" fill="#fafaf9" />

        {/* Chain links */}
        {links.map((link, i) => {
          const x = 16 + i * 140;
          const y = 120;

          return (
            <g key={i}>
              <rect x={x} y={y} width="126" height="80" rx="12" fill="white" stroke={link.color} strokeWidth="2" />
              <rect x={x} y={y} width="126" height="80" rx="12" fill={link.color} opacity="0.04" />

              {/* Number */}
              <circle cx={x + 22} cy={y + 20} r="12" fill={link.color} opacity="0.15" />
              <text x={x + 22} y={y + 25} textAnchor="middle" fontSize="12" fontWeight="700" fill={link.color} fontFamily="system-ui">
                {i + 1}
              </text>

              {/* Label */}
              <text x={x + 40} y={y + 24} fontSize="12" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {link.label}
              </text>

              {/* Description */}
              <foreignObject x={x + 10} y={y + 36} width="106" height="38">
                <p style={{ fontSize: 10, color: "#a8a29e", lineHeight: 1.4, margin: 0, fontFamily: "system-ui" }}>
                  {link.desc}
                </p>
              </foreignObject>

              {/* Chain connector */}
              {i < links.length - 1 && (
                <g>
                  <line x1={x + 128} y1={y + 40} x2={x + 138} y2={y + 40} stroke={link.color} strokeWidth="3" />
                  <circle cx={x + 133} cy={y + 40} r="3" fill={link.color} opacity="0.3" />
                </g>
              )}
            </g>
          );
        })}

        {/* Break points */}
        {breaks.map((label, i) => {
          const x = 16 + i * 140 + 126 + 5;
          const y = 115;

          return (
            <g key={`break-${i}`}>
              <line x1={x} y1={y - 8} x2={x} y2={y - 42} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />

              <rect x={x - 55} y={y - 72} width="110" height="34" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
              <text x={x} y={y - 60} textAnchor="middle" fontSize="8" fontWeight="600" fill="#16a34a" fontFamily="system-ui" letterSpacing="0.05em">
                BREAK THE CHAIN
              </text>
              <text x={x} y={y - 47} textAnchor="middle" fontSize="9" fill="#16a34a" fontFamily="system-ui">
                {label}
              </text>

              {/* Scissors */}
              <circle cx={x} cy={y - 4} r="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
              <text x={x} y={y} textAnchor="middle" fontSize="10" fill="#22c55e" fontFamily="system-ui">
                x
              </text>
            </g>
          );
        })}

        {/* Bottom legend */}
        <rect x="130" y="230" width="460" height="70" rx="12" fill="white" stroke="#e7e5e4" strokeWidth="1" />
        <text x="360" y="254" textAnchor="middle" fontSize="13" fontWeight="600" fill="#44403c" fontFamily="system-ui">
          Your Role: Break the Chain at Every Opportunity
        </text>
        <text x="360" y="274" textAnchor="middle" fontSize="11" fill="#a8a29e" fontFamily="system-ui">
          Every inspection, observation, and decision is a chance to prevent an incident
        </text>
        <text x="360" y="292" textAnchor="middle" fontSize="10" fill="#22c55e" fontFamily="system-ui" fontWeight="500">
          The earlier you break it, the better the outcome
        </text>
      </svg>
    </div>
  );
}
