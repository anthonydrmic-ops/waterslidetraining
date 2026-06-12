"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

const ZONES = [
  { label: "Launch Area", color: "#ef4444", items: ["Platform condition", "Non-slip surface", "Handrails secure"], y: 20 },
  { label: "Upper Flume", color: "#f97316", items: ["Joint seals intact", "Water flow rate", "Surface smoothness"], y: 100 },
  { label: "Mid Section", color: "#eab308", items: ["Support stability", "Flume alignment", "No debris"], y: 180 },
  { label: "Run-out / Exit", color: "#22c55e", items: ["Deceleration clear", "Splash padding", "Exit path open"], y: 260 },
  { label: "Catch Pool", color: "#1F7A8C", items: ["Water depth correct", "Drain covers secure", "Water clarity OK"], y: 340 },
];

// Where the inspector stands for each zone — points sitting on the slide
// silhouette beside each checkpoint.
const STOPS: [number, number][] = [
  [80, 48],
  [109, 128],
  [108, 208],
  [93, 288],
  [89, 368],
];

const WALK_MS = 950;
const TALK_MS = 2300;

const cardVariant = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.08 + i * 0.14, ease: EASE },
  }),
};

/** The inspector: hi-vis vest, clipboard in hand, ready to talk checks. */
function Inspector({ talking, approving }: { talking: boolean; approving: boolean }) {
  return (
    <g>
      {/* Speech bubble — dots while talking, a green tick on sign-off */}
      {(talking || approving) && (
        <g className="bubble-pop" key={approving ? "tick" : "talk"}>
          <rect x="6" y="-26" width="26" height="13" rx="6.5" fill="#ffffff" stroke={approving ? "#86efac" : "#d6d3d1"} strokeWidth="1" />
          <path d="M 11 -13.5 L 9 -9.5 L 15 -13.2 Z" fill="#ffffff" stroke={approving ? "#86efac" : "#d6d3d1"} strokeWidth="0.8" />
          {approving ? (
            <path
              d="M 14 -19.5 l 3.2 3.2 l 6.4 -6.6"
              stroke="#16a34a"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            [12.5, 19, 25.5].map((dx, i) => (
              <circle
                key={dx}
                className="talk-dot"
                style={{ animationDelay: `${i * 0.16}s` }}
                cx={dx}
                cy="-19.5"
                r="1.8"
                fill="#78716c"
              />
            ))
          )}
        </g>
      )}
      <g className="walk-bob">
        {/* Free arm — raised in a thumbs-up on sign-off */}
        {approving && (
          <g>
            <line x1="-2.6" y1="-4.5" x2="-6.2" y2="-10" stroke="#0B3A66" strokeWidth="2" strokeLinecap="round" />
            <circle cx="-6.6" cy="-11" r="1.8" fill="#e7b98a" stroke="#0B3A66" strokeWidth="0.9" />
            <line x1="-6.6" y1="-12.6" x2="-6.6" y2="-14.6" stroke="#e7b98a" strokeWidth="1.7" strokeLinecap="round" />
          </g>
        )}
        {/* Legs */}
        <line x1="-1.5" y1="1.5" x2="-2.5" y2="8" stroke="#0B3A66" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="1.5" y1="1.5" x2="2.5" y2="8" stroke="#0B3A66" strokeWidth="2.2" strokeLinecap="round" />
        {/* Hi-vis vest body */}
        <rect x="-3.2" y="-6.5" width="6.4" height="9" rx="2.6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        {/* Reflective stripe */}
        <line x1="-3.2" y1="-2.6" x2="3.2" y2="-2.6" stroke="#ffffff" strokeWidth="1.1" />
        {/* Arm holding the clipboard */}
        <line x1="2.6" y1="-4.5" x2="6" y2="-1.5" stroke="#0B3A66" strokeWidth="2" strokeLinecap="round" />
        {/* Clipboard */}
        <rect x="4.8" y="-4" width="5" height="6.6" rx="0.9" fill="#ffffff" stroke="#0B3A66" strokeWidth="1" />
        <line x1="5.9" y1="-2.2" x2="8.7" y2="-2.2" stroke="#a8a29e" strokeWidth="0.8" />
        <line x1="5.9" y1="-0.6" x2="8.7" y2="-0.6" stroke="#a8a29e" strokeWidth="0.8" />
        <line x1="5.9" y1="1" x2="7.6" y2="1" stroke="#a8a29e" strokeWidth="0.8" />
        {/* Head + helmet */}
        <circle cx="0" cy="-9.5" r="3.2" fill="#e7b98a" />
        <path d="M -3.4 -10.2 A 3.4 3.4 0 0 1 3.4 -10.2 Z" fill="#0B3A66" />
      </g>
    </g>
  );
}

export function InspectionZones() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const wx = useMotionValue(STOPS[0][0]);
  const wy = useMotionValue(STOPS[0][1]);
  const wo = useMotionValue(0);
  const [activeZone, setActiveZone] = useState(-1);
  const [talking, setTalking] = useState(false);
  const [approving, setApproving] = useState(false);

  // The inspection round: drop in at the launch platform, walk the line,
  // pause at each zone to run its checks (card highlights, bubble talks),
  // then move on. Fade out at the pool and start the round again.
  useEffect(() => {
    if (reduce || !inView) return;
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(setTimeout(res, ms));
      });

    (async () => {
      await wait(700);
      while (alive) {
        wx.set(STOPS[0][0]);
        wy.set(STOPS[0][1]);
        animate(wo, 1, { duration: 0.35 });
        for (let i = 0; i < STOPS.length; i++) {
          if (i > 0) {
            setTalking(false);
            setActiveZone(-1);
            animate(wx, STOPS[i][0], { duration: WALK_MS / 1000, ease: "easeInOut" });
            animate(wy, STOPS[i][1], { duration: WALK_MS / 1000, ease: "easeInOut" });
            await wait(WALK_MS);
            if (!alive) return;
          }
          setActiveZone(i);
          setTalking(true);
          await wait(TALK_MS);
          if (!alive) return;
        }
        // Sign-off: checks done — thumbs up, big green tick
        setTalking(false);
        setApproving(true);
        await wait(1600);
        if (!alive) return;
        setApproving(false);
        setActiveZone(-1);
        animate(wo, 0, { duration: 0.4 });
        await wait(650);
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      [wx, wy, wo].forEach((v) => v.stop());
      setTalking(false);
      setApproving(false);
      setActiveZone(-1);
    };
  }, [reduce, inView, wx, wy, wo]);

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Pre-Opening Inspection Zones - Walking the Line
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

        {ZONES.map((zone, i) => {
          const isActive = activeZone === i;
          return (
            <g key={i}>
              <motion.g variants={cardVariant} custom={i}>
                {/* Connector */}
                <line x1="112" y1={zone.y + 30} x2="148" y2={zone.y + 30} stroke={zone.color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

                {/* Zone card */}
                <rect x="148" y={zone.y} width="530" height="62" rx="10" fill="white" stroke={zone.color} strokeWidth="1" opacity="0.25" />
                <rect x="148" y={zone.y} width="530" height="62" rx="10" fill={zone.color} opacity="0.03" />

                {/* Active highlight — lit while the inspector runs this zone */}
                <motion.rect
                  x="148"
                  y={zone.y}
                  width="530"
                  height="62"
                  rx="10"
                  fill={zone.color}
                  fillOpacity="0.05"
                  stroke={zone.color}
                  strokeWidth="1.6"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />

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
              </motion.g>
            </g>
          );
        })}

        {/* The inspector walking the line */}
        {reduce ? (
          <g transform={`translate(${STOPS[0][0]} ${STOPS[0][1]})`}>
            <Inspector talking={false} approving={false} />
          </g>
        ) : (
          <motion.g style={{ x: wx, y: wy, opacity: wo }}>
            <Inspector talking={talking} approving={approving} />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
