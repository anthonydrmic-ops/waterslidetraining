"use client";

/**
 * A small pictogram of a rider in the taught position - lying back, feet
 * first, arms crossed - facing the direction of travel (+x), drawn around the
 * origin. Skin-tone head under a coloured cap, solid limbs with a bent knee,
 * so it reads as a person rather than a mark. White underlay strokes keep it
 * legible on any flume colour.
 *
 * `animated` adds water effects (spray off the heels, wake streaks past the
 * head, a slight body bob) - all CSS keyframes, so they run in production and
 * are silenced by the global reduced-motion block.
 */
export function RiderGlyph({
  color,
  scale = 1,
  animated = false,
}: {
  color: string;
  scale?: number;
  animated?: boolean;
}) {
  return (
    <g transform={scale === 1 ? undefined : `scale(${scale})`} aria-hidden>
      {/* Water effects */}
      {animated && (
        <g>
          {/* Spray kicking forward off the heels */}
          <circle className="rider-spray" cx="12" cy="0.4" r="1.1" fill="#ffffff" opacity="0" />
          <circle
            className="rider-spray"
            style={{ animationDelay: "0.22s" }}
            cx="13"
            cy="-1.2"
            r="0.85"
            fill="#ffffff"
            opacity="0"
          />
          <circle
            className="rider-spray"
            style={{ animationDelay: "0.42s" }}
            cx="11.2"
            cy="-2.4"
            r="0.7"
            fill="#ffffff"
            opacity="0"
          />
          {/* Wake streaks trailing behind */}
          <path
            className="rider-wake"
            d="M -13.5 -2 Q -16.5 -2.6 -19 -1.8"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
          <path
            className="rider-wake"
            style={{ animationDelay: "0.35s" }}
            d="M -13 1 Q -16.5 1.5 -19.5 0.8"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
        </g>
      )}

      <g className={animated ? "rider-bob" : undefined}>
        {/* White underlay for contrast */}
        <g stroke="#ffffff" fill="none" strokeLinecap="round">
          <path d="M -6.5 -3 L 1 0.3" strokeWidth="7.4" />
          <path d="M 1 0.2 L 5.5 -2.4" strokeWidth="6.2" />
          <path d="M 5.5 -2.4 L 10.4 -0.6" strokeWidth="5" />
        </g>
        <circle cx="-9" cy="-5.6" r="4.8" fill="#ffffff" />

        {/* Torso, reclined */}
        <path d="M -6.5 -3 L 1 0.3" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Thigh raised to a bent knee */}
        <path d="M 1 0.2 L 5.5 -2.4" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Calf reaching forward, heels leading */}
        <path d="M 5.5 -2.4 L 10.4 -0.6" stroke={color} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Foot */}
        <path d="M 10.4 -0.6 L 11.7 -2" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Arms crossed over the chest */}
        <path d="M -5.4 -4 L -1.8 -1" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <path d="M -5.6 -1 L -1.6 -3.8" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" fill="none" />

        {/* Head - skin tone under a coloured swim cap */}
        <circle cx="-9" cy="-5.6" r="3.5" fill="#e7b98a" />
        <path d="M -12.5 -6.1 A 3.5 3.5 0 0 1 -5.5 -6.1 Z" fill={color} />
      </g>
    </g>
  );
}
