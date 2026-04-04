"use client";

export function DefectRecognition() {
  const defects = [
    {
      label: "Hairline Crack",
      severity: "Monitor",
      sevColor: "#eab308",
      desc: "Surface only, no structural risk yet",
      action: "Log in register, check each inspection",
      response: "Next scheduled inspection",
    },
    {
      label: "Structural Crack",
      severity: "Shut Down",
      sevColor: "#ef4444",
      desc: "Through-wall, water may penetrate",
      action: "Close slide, report, document",
      response: "Immediate",
    },
    {
      label: "Delamination",
      severity: "Action Required",
      sevColor: "#f97316",
      desc: "Layers separating, tap to detect",
      action: "Report to maintenance, monitor",
      response: "Within 24 hours",
    },
    {
      label: "Joint Lip / Gap",
      severity: "Shut Down",
      sevColor: "#ef4444",
      desc: "Misalignment at flume joints",
      action: "Close slide, report, document",
      response: "Immediate",
    },
    {
      label: "Discoloration",
      severity: "Monitor",
      sevColor: "#eab308",
      desc: "Chemical exposure or UV damage",
      action: "Log in register, check each inspection",
      response: "Next scheduled inspection",
    },
    {
      label: "Puncture",
      severity: "Shut Down",
      sevColor: "#ef4444",
      desc: "Through-wall hole, water ingress",
      action: "Close slide, report, document",
      response: "Immediate",
    },
  ];

  return (
    <div className="w-full">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Defect Recognition Quick Reference
      </p>
      <svg viewBox="0 0 720 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="720" height="380" rx="12" fill="#fafaf9" />

        {defects.map((defect, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 15 + col * 235;
          const y = 15 + row * 185;

          return (
            <g key={i}>
              {/* Card */}
              <rect x={x} y={y} width="220" height="170" rx="12" fill="white" stroke="#e7e5e4" strokeWidth="1" />

              {/* Visual area */}
              <rect x={x + 12} y={y + 12} width="56" height="56" rx="8" fill={defect.sevColor} opacity="0.06" stroke={defect.sevColor} strokeWidth="1" />

              {/* Defect visuals */}
              {i === 0 && (
                <g transform={`translate(${x + 12}, ${y + 12})`}>
                  <line x1="20" y1="10" x2="26" y2="22" stroke={defect.sevColor} strokeWidth="1.5" />
                  <line x1="26" y1="22" x2="23" y2="34" stroke={defect.sevColor} strokeWidth="1.5" />
                  <line x1="23" y1="34" x2="30" y2="46" stroke={defect.sevColor} strokeWidth="1.5" />
                </g>
              )}
              {i === 1 && (
                <g transform={`translate(${x + 12}, ${y + 12})`}>
                  <line x1="14" y1="8" x2="28" y2="22" stroke={defect.sevColor} strokeWidth="2.5" />
                  <line x1="28" y1="22" x2="22" y2="35" stroke={defect.sevColor} strokeWidth="2.5" />
                  <line x1="22" y1="35" x2="36" y2="48" stroke={defect.sevColor} strokeWidth="2.5" />
                  <line x1="28" y1="22" x2="42" y2="28" stroke={defect.sevColor} strokeWidth="2" />
                  <circle cx="14" cy="8" r="3" fill={defect.sevColor} opacity="0.3" />
                  <circle cx="36" cy="48" r="3" fill={defect.sevColor} opacity="0.3" />
                </g>
              )}
              {i === 2 && (
                <g transform={`translate(${x + 12}, ${y + 12})`}>
                  <rect x="6" y="14" width="44" height="12" rx="2" fill={defect.sevColor} opacity="0.15" />
                  <rect x="10" y="30" width="36" height="10" rx="2" fill={defect.sevColor} opacity="0.1" />
                  <path d="M8 17 Q20 12 32 17 Q44 22 52 17" stroke={defect.sevColor} strokeWidth="1.5" fill="none" />
                  <path d="M12 33 Q24 28 36 33 Q44 38 48 33" stroke={defect.sevColor} strokeWidth="1" fill="none" strokeDasharray="3 2" />
                </g>
              )}
              {i === 3 && (
                <g transform={`translate(${x + 12}, ${y + 12})`}>
                  <rect x="4" y="18" width="22" height="20" rx="2" fill="#d6d3d1" opacity="0.4" />
                  <rect x="32" y="16" width="22" height="24" rx="2" fill="#d6d3d1" opacity="0.4" />
                  <line x1="26" y1="16" x2="32" y2="16" stroke={defect.sevColor} strokeWidth="1.5" />
                  <line x1="26" y1="26" x2="32" y2="26" stroke={defect.sevColor} strokeWidth="1.5" />
                  <line x1="26" y1="36" x2="32" y2="36" stroke={defect.sevColor} strokeWidth="1.5" />
                </g>
              )}
              {i === 4 && (
                <g transform={`translate(${x + 12}, ${y + 12})`}>
                  <circle cx="20" cy="28" r="14" fill={defect.sevColor} opacity="0.12" />
                  <circle cx="38" cy="20" r="10" fill={defect.sevColor} opacity="0.08" />
                  <circle cx="40" cy="38" r="8" fill={defect.sevColor} opacity="0.15" />
                </g>
              )}
              {i === 5 && (
                <g transform={`translate(${x + 12}, ${y + 12})`}>
                  <circle cx="28" cy="28" r="9" fill="none" stroke={defect.sevColor} strokeWidth="2.5" />
                  <circle cx="28" cy="28" r="3" fill={defect.sevColor} />
                  <line x1="28" y1="19" x2="28" y2="10" stroke={defect.sevColor} strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="28" y1="37" x2="28" y2="46" stroke={defect.sevColor} strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="19" y1="28" x2="10" y2="28" stroke={defect.sevColor} strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="37" y1="28" x2="46" y2="28" stroke={defect.sevColor} strokeWidth="1" strokeDasharray="2 2" />
                </g>
              )}

              {/* Label */}
              <text x={x + 80} y={y + 28} fontSize="14" fontWeight="700" fill="#44403c" fontFamily="system-ui">
                {defect.label}
              </text>

              {/* Severity pill */}
              <rect x={x + 78} y={y + 36} width={defect.severity.length * 8 + 16} height="20" rx="10" fill={defect.sevColor} opacity="0.1" />
              <text x={x + 86} y={y + 50} fontSize="10" fontWeight="600" fill={defect.sevColor} fontFamily="system-ui">
                {defect.severity}
              </text>

              {/* Description */}
              <text x={x + 80} y={y + 68} fontSize="10" fill="#a8a29e" fontFamily="system-ui">
                {defect.desc}
              </text>

              {/* Divider */}
              <line x1={x + 15} y1={y + 82} x2={x + 205} y2={y + 82} stroke="#f5f5f4" strokeWidth="1" />

              {/* Action */}
              <text x={x + 15} y={y + 102} fontSize="10" fontWeight="600" fill="#78716c" fontFamily="system-ui">
                ACTION:
              </text>
              <text x={x + 72} y={y + 102} fontSize="10" fill="#78716c" fontFamily="system-ui">
                {defect.action}
              </text>

              {/* Response */}
              <text x={x + 15} y={y + 122} fontSize="10" fontWeight="600" fill="#78716c" fontFamily="system-ui">
                RESPONSE:
              </text>
              <text x={x + 85} y={y + 122} fontSize="10" fill="#78716c" fontFamily="system-ui">
                {defect.response}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
