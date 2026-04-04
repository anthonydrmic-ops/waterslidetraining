"use client";

export function InspectionZones() {
  const zones = [
    { label: "Launch Area", color: "#ef4444", items: ["Platform condition", "Non-slip surface", "Handrails secure"], y: 20 },
    { label: "Upper Flume", color: "#f97316", items: ["Joint seals intact", "Water flow rate", "Surface smoothness"], y: 100 },
    { label: "Mid Section", color: "#eab308", items: ["Support stability", "Flume alignment", "No debris"], y: 180 },
    { label: "Run-out / Exit", color: "#22c55e", items: ["Deceleration clear", "Splash padding", "Exit path open"], y: 260 },
    { label: "Catch Pool", color: "#0891b2", items: ["Water depth correct", "Drain covers secure", "Water clarity OK"], y: 340 },
  ];

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Pre-Opening Inspection Zones
      </p>
      <svg viewBox="0 0 700 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="700" height="420" rx="12" fill="#fafaf9" />

        {/* Slide silhouette */}
        <path
          d="M70 40 C90 40, 100 60, 105 100 C115 180, 108 220, 100 260 C92 300, 88 330, 90 360 L90 400"
          stroke="#e7e5e4"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />

        {zones.map((zone, i) => (
          <g key={i}>
            {/* Dot on slide */}
            <circle cx="95" cy={zone.y + 30} r="9" fill="white" stroke={zone.color} strokeWidth="2.5" />
            <circle cx="95" cy={zone.y + 30} r="3.5" fill={zone.color} />

            {/* Connector */}
            <line x1="108" y1={zone.y + 30} x2="148" y2={zone.y + 30} stroke={zone.color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

            {/* Zone card */}
            <rect x="148" y={zone.y} width="530" height="62" rx="10" fill="white" stroke={zone.color} strokeWidth="1" opacity="0.25" />
            <rect x="148" y={zone.y} width="530" height="62" rx="10" fill={zone.color} opacity="0.03" />

            {/* Zone number */}
            <rect x="160" y={zone.y + 13} width="36" height="36" rx="8" fill={zone.color} opacity="0.12" />
            <text x="178" y={zone.y + 37} textAnchor="middle" fontSize="16" fontWeight="700" fill={zone.color} fontFamily="system-ui">
              {i + 1}
            </text>

            {/* Zone label */}
            <text x="210" y={zone.y + 26} fontSize="14" fontWeight="700" fill="#44403c" fontFamily="system-ui">
              {zone.label}
            </text>

            {/* Checklist items */}
            {zone.items.map((item, j) => (
              <g key={j}>
                <circle cx={215 + j * 170} cy={zone.y + 46} r="3.5" fill="none" stroke={zone.color} strokeWidth="1.5" />
                <text x={224 + j * 170} y={zone.y + 50} fontSize="11" fill="#78716c" fontFamily="system-ui">
                  {item}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
