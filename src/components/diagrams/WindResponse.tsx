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
    label: "Lightning or storm front (the flash to bang rule)",
    detail: "Clear pools and towers immediately - a flash-to-bang count of 30 seconds or less means the storm is inside 10 km. This overrides everything else.",
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
    // Cloud bank — soft puffs across the top that thicken and drift with the wind
    const clouds = Array.from({ length: 7 }, (_, i) => ({
      x: (i / 7) + Math.random() * 0.12,
      y: 4 + Math.random() * 28,
      r: 38 + Math.random() * 46,
      mul: 0.5 + Math.random() * 0.8,
      a: 0.5 + Math.random() * 0.5,
    }));
    let cloudDrift = 0;

    const cur = { count: 0, speed: 55, dark: 0, rain: 0 };
    let gustT = Math.random() * 50;
    let flash = 0;
    let nextBolt = 0;
    let bolt: {
      pts: [number, number][];
      branches: [number, number][][];
      ttl: number;
      maxTtl: number;
      restruck: boolean;
    } | null = null;
    let last = performance.now();

    const makeBolt = () => {
      const pts: [number, number][] = [];
      let x = W * (0.15 + Math.random() * 0.7);
      let y = -4;
      pts.push([x, y]);
      while (y < H * (0.5 + Math.random() * 0.3)) {
        y += H * (0.045 + Math.random() * 0.05);
        x += (Math.random() - 0.5) * 34;
        pts.push([x, y]);
      }
      // Forks — short branches peeling off the trunk partway down
      const branches: [number, number][][] = [];
      const nb = 1 + Math.floor(Math.random() * 2);
      for (let b = 0; b < nb; b++) {
        const start = 1 + Math.floor(Math.random() * Math.max(1, pts.length - 3));
        let [bx, by] = pts[start];
        const dir = Math.random() < 0.5 ? -1 : 1;
        const bpts: [number, number][] = [[bx, by]];
        const segs = 2 + Math.floor(Math.random() * 3);
        for (let s = 0; s < segs; s++) {
          bx += dir * (8 + Math.random() * 18);
          by += H * (0.03 + Math.random() * 0.04);
          bpts.push([bx, by]);
        }
        branches.push(bpts);
      }
      return { pts, branches, ttl: 0.34, maxTtl: 0.34, restruck: false };
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

      // Cloud bank — gathers as the weather builds, drifts with the wind
      if (cur.dark > 0.008) {
        cloudDrift += cur.speed * 0.05 * dt;
        for (const c of clouds) {
          const px = ((c.x * (W + 240) + cloudDrift * c.mul) % (W + 240)) - 120;
          const ca = Math.min(0.4, cur.dark * 2.6) * c.a;
          const g = ctx.createRadialGradient(px, c.y, 0, px, c.y, c.r);
          g.addColorStop(0, `rgba(30, 41, 59, ${ca})`);
          g.addColorStop(1, "rgba(30, 41, 59, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(px, c.y, c.r * 1.7, c.r * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }
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

      // Rain — driven hard sideways by the wind. Two weights: a heavier
      // foreground sheet over a finer background drizzle, for depth.
      if (cur.rain > 0.02) {
        const rn = Math.min(MAX_RAIN, Math.round(cur.rain * MAX_RAIN));
        const rv = 520 + cur.speed * 0.4;
        const lightStyle = `rgba(148, 175, 200, ${0.12 + cur.rain * 0.11})`;
        const heavyStyle = `rgba(170, 196, 220, ${0.2 + cur.rain * 0.16})`;
        for (let i = 0; i < rn; i++) {
          const p = rain[i];
          p.y += (rv * dt * p.mul) / H;
          p.x += rv * 0.45 * dt * p.mul * (gust * 0.8);
          if (p.y > 1.02) {
            p.y = -0.04;
            p.x = Math.random() * W - W * 0.15;
          }
          if (p.x > W + 20) p.x -= W * 1.2;
          const heavy = i % 3 === 0;
          ctx.strokeStyle = heavy ? heavyStyle : lightStyle;
          ctx.lineWidth = heavy ? 1.4 : 0.85;
          const len = heavy ? 19 : 13;
          const ry = p.y * H;
          ctx.beginPath();
          ctx.moveTo(p.x, ry);
          ctx.lineTo(p.x - (len * 0.45) * gust, ry - len);
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
      if (bolt) {
        bolt.ttl -= dt;
        // Re-strike: real strikes flicker — the channel re-illuminates once
        if (!bolt.restruck && bolt.ttl < bolt.maxTtl * 0.4 && Math.random() < 0.12) {
          bolt.restruck = true;
          bolt.ttl = bolt.maxTtl * 0.85;
          flash = Math.max(flash, 0.7);
        }
        if (bolt.ttl <= 0) bolt = null;
      }
      if (flash > 0.01) {
        // Whole-sky flash plus a hot burst radiating from the strike point
        ctx.fillStyle = `rgba(205, 225, 255, ${flash * 0.28})`;
        ctx.fillRect(0, 0, W, H);
        if (bolt) {
          const fx = bolt.pts[0][0];
          const g = ctx.createRadialGradient(fx, H * 0.1, 0, fx, H * 0.1, H * 0.95);
          g.addColorStop(0, `rgba(225, 238, 255, ${flash * 0.4})`);
          g.addColorStop(1, "rgba(225, 238, 255, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
        flash *= Math.exp(-dt * 9);
      }
      if (bolt) {
        // Per-frame flicker keeps the channel alive rather than just fading
        const flick = 0.65 + 0.35 * Math.random();
        const ba = Math.min(1, (bolt.ttl / bolt.maxTtl) * 1.7) * flick;
        const trunk = bolt.pts;
        const branches = bolt.branches;
        const drawPath = (p: [number, number][]) => {
          ctx.beginPath();
          p.forEach(([bx, by], j) => (j === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by)));
          ctx.stroke();
        };
        ctx.save();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        // Wide soft glow
        ctx.shadowColor = "rgba(150, 190, 255, 0.95)";
        ctx.shadowBlur = 28;
        ctx.strokeStyle = `rgba(140, 180, 255, ${0.35 * ba})`;
        ctx.lineWidth = 7;
        drawPath(trunk);
        ctx.lineWidth = 4.5;
        branches.forEach(drawPath);
        // Bright channel
        ctx.shadowBlur = 18;
        ctx.strokeStyle = `rgba(200, 224, 255, ${0.9 * ba})`;
        ctx.lineWidth = 2.6;
        drawPath(trunk);
        ctx.lineWidth = 1.6;
        branches.forEach(drawPath);
        // White-hot core
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * ba})`;
        ctx.lineWidth = 1.3;
        drawPath(trunk);
        ctx.lineWidth = 0.7;
        branches.forEach(drawPath);
        ctx.restore();
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

      <p className="relative text-[11px] uppercase tracking-widest text-[#1F7A8C] font-bold mb-4 text-center">
        Staged Weather Response
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
