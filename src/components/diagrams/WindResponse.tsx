"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;
const STAGE_MS = 4200;

const STAGES = [
  {
    tone: "#1F7A8C",
    label: "Monitor continuously",
    detail: "An anemometer at the highest dispatch platform - wind at the tower is stronger than wind on the deck.",
  },
  {
    tone: "#d97706",
    label: "Winds rising toward the limit",
    detail: "Brief operators and watch ride behaviour - expect slower, less predictable riders on open flumes.",
  },
  {
    tone: "#d97706",
    label: "Gusts near the limit",
    detail: "Restrict the exposed rides first - tall open flumes and light riders are affected most. Gusts move riders, not averages.",
  },
  {
    tone: "#dc2626",
    label: "Sustained wind above the manufacturer's limit",
    detail: "Close the affected slides. The figure in the operations manual governs - not judgement on the day.",
  },
  {
    tone: "#dc2626",
    label: "Lightning or storm front",
    detail: "Clear pools and towers immediately. This overrides everything else.",
  },
];

// Weather parameters per stage - the canvas lerps between them so the sky
// changes like weather, not like a slideshow.
const WEATHER = [
  { count: 16, speed: 55, dark: 0, rain: 0, storm: false },
  { count: 34, speed: 130, dark: 0.02, rain: 0, storm: false },
  { count: 60, speed: 270, dark: 0.07, rain: 0, storm: false },
  { count: 95, speed: 440, dark: 0.15, rain: 0.3, storm: false },
  { count: 115, speed: 580, dark: 0.27, rain: 1, storm: true },
];

const MAX_WIND = 120;
const MAX_RAIN = 110;

export function WindResponse() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), STAGE_MS);
    return () => clearInterval(id);
  }, [reduce, inView]);

  // The weather engine: wind streaks with wandering gust waves, rain at the
  // top stages, and forked lightning bolts with glow in the storm.
  useEffect(() => {
    if (reduce || !inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;
    let raf = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const wind = Array.from({ length: MAX_WIND }, () => ({
      x: Math.random() * 1200,
      y: Math.random(),
      mul: 0.55 + Math.random() * 0.9,
      w: 0.8 + Math.random() * 1.4,
      alpha: 0.14 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));
    const rain = Array.from({ length: MAX_RAIN }, () => ({
      x: Math.random() * 1200,
      y: Math.random(),
      mul: 0.7 + Math.random() * 0.6,
    }));

    const cur = { count: 0, speed: 55, dark: 0, rain: 0 };
    let gustT = Math.random() * 50;
    let flash = 0;
    let nextBolt = 0;
    let bolt: { pts: [number, number][]; ttl: number } | null = null;
    let last = performance.now();

    const makeBolt = () => {
      const pts: [number, number][] = [];
      let x = W * (0.15 + Math.random() * 0.7);
      let y = -4;
      pts.push([x, y]);
      while (y < H * (0.45 + Math.random() * 0.3)) {
        y += H * (0.05 + Math.random() * 0.06);
        x += (Math.random() - 0.5) * 36;
        pts.push([x, y]);
      }
      return { pts, ttl: 0.22 };
    };

    const tick = (now: number) => {
      if (!alive) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const target = WEATHER[stageRef.current];
      const k = 1 - Math.exp(-dt * 2.2);
      cur.count += (target.count - cur.count) * k;
      cur.speed += (target.speed - cur.speed) * k;
      cur.dark += (target.dark - cur.dark) * k;
      cur.rain += (target.rain - cur.rain) * k;

      // Gusts: two slow waves beating against each other, so the wind surges
      // and lulls instead of blowing at a constant rate.
      gustT += dt;
      const gust = 1 + 0.3 * Math.sin(gustT * 1.25) + 0.22 * Math.sin(gustT * 0.43 + 2.1);

      ctx.clearRect(0, 0, W, H);

      // Sky darkening
      if (cur.dark > 0.005) {
        ctx.fillStyle = `rgba(15, 23, 42, ${cur.dark})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Wind streaks
      const n = Math.min(MAX_WIND, Math.round(cur.count));
      const stormy = target.storm;
      for (let i = 0; i < n; i++) {
        const p = wind[i];
        const v = cur.speed * gust * p.mul;
        p.x += v * dt;
        const py = p.y * H + Math.sin(p.x * 0.006 + p.phase) * (4 + cur.speed * 0.012);
        const len = 14 + v * 0.14;
        if (p.x - len > W) {
          p.x = -len - Math.random() * W * 0.25;
          p.y = Math.random();
        }
        const a = p.alpha * (stormy ? 1.15 : 1);
        const grad = ctx.createLinearGradient(p.x - len, py, p.x, py);
        grad.addColorStop(0, "rgba(125, 138, 160, 0)");
        grad.addColorStop(0.7, `rgba(125, 138, 160, ${a * 0.6})`);
        grad.addColorStop(1, `rgba(148, 163, 184, ${a})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.w;
        ctx.beginPath();
        ctx.moveTo(p.x - len, py + len * 0.04);
        ctx.lineTo(p.x, py);
        ctx.stroke();
      }

      // Rain — driven hard sideways by the wind
      if (cur.rain > 0.02) {
        const rn = Math.min(MAX_RAIN, Math.round(cur.rain * MAX_RAIN));
        const rv = 520 + cur.speed * 0.4;
        ctx.strokeStyle = `rgba(148, 175, 200, ${0.16 + cur.rain * 0.14})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < rn; i++) {
          const p = rain[i];
          p.y += (rv * dt * p.mul) / H;
          p.x += rv * 0.45 * dt * p.mul * (gust * 0.8);
          if (p.y > 1.02) {
            p.y = -0.04;
            p.x = Math.random() * W - W * 0.15;
          }
          if (p.x > W + 20) p.x -= W * 1.2;
          const ry = p.y * H;
          ctx.beginPath();
          ctx.moveTo(p.x, ry);
          ctx.lineTo(p.x - 7 * gust, ry - 15);
          ctx.stroke();
        }
      }

      // Lightning
      if (target.storm) {
        if (now / 1000 > nextBolt) {
          bolt = makeBolt();
          flash = 1;
          nextBolt = now / 1000 + 1.8 + Math.random() * 2.4;
        }
      }
      if (flash > 0.01) {
        ctx.fillStyle = `rgba(241, 245, 249, ${flash * 0.28})`;
        ctx.fillRect(0, 0, W, H);
        flash *= Math.exp(-dt * 9);
      }
      if (bolt) {
        bolt.ttl -= dt;
        if (bolt.ttl <= 0) {
          bolt = null;
        } else {
          const ba = Math.min(1, bolt.ttl / 0.12);
          ctx.save();
          ctx.shadowColor = "rgba(226, 240, 255, 0.9)";
          ctx.shadowBlur = 16;
          ctx.strokeStyle = `rgba(235, 245, 255, ${0.9 * ba})`;
          ctx.lineWidth = 2.2;
          ctx.lineJoin = "round";
          ctx.beginPath();
          bolt.pts.forEach(([bx, by], j) => (j === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by)));
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(165, 200, 255, ${0.35 * ba})`;
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce, inView]);

  return (
    <motion.div
      ref={ref}
      className="w-full relative"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {/* Weather canvas — bleeds past the component bounds to fill the whole
          diagram panel (the wrapper's overflow-hidden clips it cleanly) */}
      {!reduce && (
        <canvas
          ref={canvasRef}
          className="absolute -inset-4 md:-inset-6 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] h-[calc(100%+2rem)] md:h-[calc(100%+3rem)] pointer-events-none"
          aria-hidden
        />
      )}

      <p className="relative text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        Staged Wind Response
      </p>

      {/* The five stages */}
      <div className="relative space-y-2">
        {STAGES.map((s, i) => {
          const isActive = !reduce && stage === i;
          return (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -12 },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.45, delay: 0.15 + i * 0.12, ease: EASE },
                },
              }}
              className="flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-500"
              style={{
                borderColor: isActive ? `${s.tone}66` : `${s.tone}2b`,
                background: isActive ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
                boxShadow: isActive ? `0 6px 24px ${s.tone}22` : undefined,
              }}
            >
              <span
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-bold transition-colors duration-500"
                style={{
                  borderColor: s.tone,
                  color: isActive ? "#ffffff" : s.tone,
                  background: isActive ? s.tone : "transparent",
                }}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold leading-tight" style={{ color: s.tone }}>
                  {s.label}
                </p>
                <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{s.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.5, delay: 0.9 } },
        }}
        className="relative text-[11px] text-stone-400 text-center mt-3 leading-snug"
      >
        Your slide&apos;s wind limit lives in its operations manual - know the number before the wind arrives.
      </motion.p>
    </motion.div>
  );
}
