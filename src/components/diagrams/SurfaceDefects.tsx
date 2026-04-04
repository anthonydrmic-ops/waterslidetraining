"use client";

export function SurfaceDefects() {
  const defects = [
    {
      label: "Smooth Surface",
      status: "Normal",
      color: "#22c55e",
      desc: "Gelcoat intact, consistent friction",
      visual: (x: number, y: number) => (
        <g>
          <rect x={x} y={y} width="140" height="70" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
          <line x1={x + 14} y1={y + 22} x2={x + 126} y2={y + 22} stroke="#86efac" strokeWidth="2.5" />
          <line x1={x + 14} y1={y + 35} x2={x + 126} y2={y + 35} stroke="#86efac" strokeWidth="2.5" />
          <line x1={x + 14} y1={y + 48} x2={x + 126} y2={y + 48} stroke="#86efac" strokeWidth="2.5" />
        </g>
      ),
    },
    {
      label: "Roughening",
      status: "Monitor",
      color: "#eab308",
      desc: "UV degradation, more friction",
      visual: (x: number, y: number) => (
        <g>
          <rect x={x} y={y} width="140" height="70" rx="8" fill="#fefce8" stroke="#fde68a" strokeWidth="1" />
          <path d={`M${x + 14} ${y + 22} Q${x + 40} ${y + 16} ${x + 70} ${y + 22} Q${x + 100} ${y + 28} ${x + 126} ${y + 22}`} stroke="#facc15" strokeWidth="2.5" fill="none" />
          <path d={`M${x + 14} ${y + 36} Q${x + 45} ${y + 30} ${x + 70} ${y + 36} Q${x + 95} ${y + 42} ${x + 126} ${y + 36}`} stroke="#facc15" strokeWidth="2.5" fill="none" />
          <path d={`M${x + 14} ${y + 50} Q${x + 35} ${y + 44} ${x + 60} ${y + 50} Q${x + 90} ${y + 56} ${x + 126} ${y + 50}`} stroke="#facc15" strokeWidth="2.5" fill="none" />
        </g>
      ),
    },
    {
      label: "Gelcoat Peeling",
      status: "Action Req.",
      color: "#f97316",
      desc: "Exposed fibreglass, abrasion risk",
      visual: (x: number, y: number) => (
        <g>
          <rect x={x} y={y} width="140" height="70" rx="8" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <rect x={x + 14} y={y + 14} width="45" height="35" rx="3" fill="#fdba74" opacity="0.3" />
          <path d={`M${x + 14} ${y + 14} Q${x + 28} ${y + 22} ${x + 40} ${y + 14} L${x + 59} ${y + 14} L${x + 52} ${y + 28} Q${x + 38} ${y + 22} ${x + 28} ${y + 28} Q${x + 18} ${y + 34} ${x + 14} ${y + 28} Z`} fill="#fb923c" opacity="0.4" />
          <line x1={x + 70} y1={y + 22} x2={x + 126} y2={y + 22} stroke="#fdba74" strokeWidth="2.5" />
          <line x1={x + 70} y1={y + 36} x2={x + 118} y2={y + 36} stroke="#fdba74" strokeWidth="2.5" />
          <line x1={x + 70} y1={y + 50} x2={x + 126} y2={y + 50} stroke="#fdba74" strokeWidth="2.5" />
        </g>
      ),
    },
    {
      label: "Cracking",
      status: "Shut Down",
      color: "#ef4444",
      desc: "Structural risk, close immediately",
      visual: (x: number, y: number) => (
        <g>
          <rect x={x} y={y} width="140" height="70" rx="8" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
          <line x1={x + 35} y1={y + 10} x2={x + 50} y2={y + 28} stroke="#ef4444" strokeWidth="2.5" />
          <line x1={x + 50} y1={y + 28} x2={x + 44} y2={y + 42} stroke="#ef4444" strokeWidth="2.5" />
          <line x1={x + 44} y1={y + 42} x2={x + 55} y2={y + 60} stroke="#ef4444" strokeWidth="2.5" />
          <line x1={x + 50} y1={y + 28} x2={x + 62} y2={y + 34} stroke="#ef4444" strokeWidth="2" />
          <line x1={x + 80} y1={y + 16} x2={x + 100} y2={y + 54} stroke="#ef4444" strokeWidth="2.5" />
          <line x1={x + 100} y1={y + 54} x2={x + 108} y2={y + 58} stroke="#ef4444" strokeWidth="2" />
        </g>
      ),
    },
  ];

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Surface Condition Severity Scale
      </p>
      <svg viewBox="0 0 700 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="220" rx="12" fill="#fafaf9" />

        {/* Severity arrow */}
        <line x1="40" y1="195" x2="660" y2="195" stroke="#e7e5e4" strokeWidth="2" />
        <path d="M655 189 L668 195 L655 201" fill="#d6d3d1" />
        <text x="350" y="213" textAnchor="middle" fontSize="10" fill="#a8a29e" fontFamily="system-ui" fontWeight="500" letterSpacing="0.1em">
          INCREASING SEVERITY
        </text>

        {defects.map((defect, i) => {
          const x = 22 + i * 168;
          return (
            <g key={i}>
              {defect.visual(x, 10)}
              {/* Status pill */}
              <rect x={x} y={90} width="140" height="24" rx="12" fill={defect.color} opacity="0.12" />
              <text x={x + 70} y={106} textAnchor="middle" fontSize="11" fontWeight="600" fill={defect.color} fontFamily="system-ui">
                {defect.status}
              </text>
              {/* Label */}
              <text x={x + 70} y={132} textAnchor="middle" fontSize="13" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {defect.label}
              </text>
              {/* Description */}
              <text x={x + 70} y={150} textAnchor="middle" fontSize="10" fill="#a8a29e" fontFamily="system-ui">
                {defect.desc}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
