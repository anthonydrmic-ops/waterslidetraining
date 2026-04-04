"use client";

export function DispatchFlow() {
  const steps = [
    { label: "Rider Briefing", sub: "Rules, position, signals", icon: "1", color: "#0891b2" },
    { label: "Clear Check", sub: "Catch pool clear?", icon: "2", color: "#0891b2" },
    { label: "Dispatch", sub: "Clear verbal command", icon: "3", color: "#22c55e" },
    { label: "Interval", sub: "Min spacing enforced", icon: "4", color: "#eab308" },
    { label: "Next Rider", sub: "Repeat from step 1", icon: "5", color: "#0891b2" },
  ];

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Dispatch Sequence - Operational Flow
      </p>
      <svg viewBox="0 0 720 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="720" height="280" rx="12" fill="#fafaf9" />

        {steps.map((step, i) => {
          const x = 18 + i * 140;
          const centerY = 100;
          return (
            <g key={i}>
              {/* Card */}
              <rect x={x} y={centerY - 50} width="125" height="105" rx="12" fill="white" stroke={step.color} strokeWidth="1.5" opacity="0.8" />
              <rect x={x} y={centerY - 50} width="125" height="105" rx="12" fill={step.color} opacity="0.04" />

              {/* Number circle */}
              <circle cx={x + 62} cy={centerY - 18} r="18" fill={step.color} opacity="0.12" />
              <text x={x + 62} y={centerY - 12} textAnchor="middle" fontSize="16" fontWeight="700" fill={step.color} fontFamily="system-ui">
                {step.icon}
              </text>

              {/* Label */}
              <text x={x + 62} y={centerY + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {step.label}
              </text>

              {/* Sub text */}
              <text x={x + 62} y={centerY + 36} textAnchor="middle" fontSize="10" fill="#a8a29e" fontFamily="system-ui">
                {step.sub}
              </text>

              {/* Arrow to next */}
              {i < steps.length - 1 && (
                <g>
                  <line x1={x + 128} y1={centerY + 2} x2={x + 137} y2={centerY + 2} stroke="#d6d3d1" strokeWidth="2" />
                  <path d={`M${x + 135} ${centerY - 3} L${x + 142} ${centerY + 2} L${x + 135} ${centerY + 7}`} fill="#d6d3d1" />
                </g>
              )}
            </g>
          );
        })}

        {/* Timing callout */}
        <rect x="185" y="200" width="350" height="55" rx="12" fill="#fefce8" stroke="#fde68a" strokeWidth="1" />
        <text x="360" y="222" textAnchor="middle" fontSize="13" fontWeight="600" fill="#a16207" fontFamily="system-ui">
          Minimum Dispatch Interval
        </text>
        <text x="360" y="242" textAnchor="middle" fontSize="11" fill="#ca8a04" fontFamily="system-ui">
          Based on slide length, type, and visibility - never rush
        </text>

        {/* Arrow from timing to step 4 */}
        <line x1="360" y1="200" x2="360" y2="165" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>
    </div>
  );
}
