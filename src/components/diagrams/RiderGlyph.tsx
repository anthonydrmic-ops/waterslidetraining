"use client";

/**
 * A small pictogram of a rider in the taught position - lying back, feet
 * first, arms crossed - facing the direction of travel (+x), drawn around the
 * origin. White underlay strokes keep it legible on any flume colour.
 * Replaces the abstract circles wherever a dot represented a person.
 */
export function RiderGlyph({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <g transform={scale === 1 ? undefined : `scale(${scale})`} aria-hidden>
      {/* White underlay for contrast */}
      <g stroke="#ffffff" strokeWidth="4.8" strokeLinecap="round" fill="none">
        <path d="M -6 -2.5 Q -2 0.5 3 0.5" />
        <path d="M 3 0.5 L 10.5 -2.5" />
        <path d="M -4.5 -1.5 L -1 -3.5" />
      </g>
      <circle cx="-8.5" cy="-5" r="4.6" fill="#ffffff" />
      {/* Figure */}
      <g stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none">
        {/* Torso, reclined */}
        <path d="M -6 -2.5 Q -2 0.5 3 0.5" />
        {/* Legs extended, feet first and slightly raised */}
        <path d="M 3 0.5 L 10.5 -2.5" />
        {/* Arms crossed over the chest */}
        <path d="M -4.5 -1.5 L -1 -3.5" />
      </g>
      {/* Head */}
      <circle cx="-8.5" cy="-5" r="3.5" fill={color} />
    </g>
  );
}
