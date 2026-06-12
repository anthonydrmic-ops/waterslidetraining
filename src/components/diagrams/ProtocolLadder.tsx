"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

type Tone = "info" | "warn" | "danger" | "success";

const TONE_COLOR: Record<Tone, string> = {
  info: "#1F7A8C",
  warn: "#d97706",
  danger: "#dc2626",
  success: "#16a34a",
};

interface Step {
  tone: Tone;
  label: string;
  detail: string;
}

interface LadderData {
  title: string;
  footer?: string;
  steps: Step[];
}

const LADDERS: Record<string, LadderData> = {
  "scenario-noncompliant": {
    title: "The Escalation Ladder - Same Steps Every Time",
    footer: "Queue pressure never changes the ladder - guests are safer waiting than behind a non-compliant rider.",
    steps: [
      {
        tone: "info",
        label: "First non-compliance",
        detail: "Clear, firm instruction with the reason: \"Feet first - this prevents head and spinal injuries.\"",
      },
      {
        tone: "success",
        label: "They comply",
        detail: "Proceed with dispatch. Stay alert for the rest of the group.",
      },
      {
        tone: "warn",
        label: "Second non-compliance in the group",
        detail: "Halt dispatch for the whole group until every member complies.",
      },
      {
        tone: "danger",
        label: "Continued non-compliance",
        detail: "Remove the group from the ride. Contact your supervisor if confrontation escalates.",
      },
      {
        tone: "danger",
        label: "Aggressive or threatening behaviour",
        detail: "Activate security protocols. Do not engage in argument.",
      },
    ],
  },
  "scenario-blockage": {
    title: "Blockage Protocol - The Order Matters",
    footer: "Rescue happens through access panels by trained personnel - never by sending another person down.",
    steps: [
      {
        tone: "danger",
        label: "STOP all dispatch",
        detail: "Signal the top operator immediately. The second rider may have already impacted.",
      },
      {
        tone: "danger",
        label: "Never send anyone in to check",
        detail: "A rescue rider entering the flume becomes a second impact on the stopped rider.",
      },
      {
        tone: "info",
        label: "Communicate",
        detail: "Attempt verbal contact at the entry and exit points.",
      },
      {
        tone: "info",
        label: "Use viewing windows and access panels",
        detail: "The safe way to locate and check on the rider.",
      },
      {
        tone: "warn",
        label: "Activate rescue protocol",
        detail: "If the rider does not emerge within the emergency timeframe.",
      },
      {
        tone: "warn",
        label: "Treat as a potential injury event",
        detail: "Prepare first aid response for both riders.",
      },
    ],
  },
  "scenario-throughput": {
    title: "Holding the Line on the Hottest Day",
    footer: "Peak attendance is the highest-risk period precisely because the pressure to cut corners peaks with it.",
    steps: [
      {
        tone: "info",
        label: "45-minute queues, frustrated guests",
        detail: "A management problem - never a reason to compromise a safety control.",
      },
      {
        tone: "warn",
        label: "Surface unwaxed for 4 months",
        detail: "Slower, less predictable riders. Intervals should INCREASE, not decrease.",
      },
      {
        tone: "info",
        label: "Supervisor asks for shorter intervals",
        detail: "Respond with your current risk assessment, not automatic compliance.",
      },
      {
        tone: "warn",
        label: "Fatigue or distraction setting in",
        detail: "Request rotation. Don't push through with slowed reactions.",
      },
      {
        tone: "success",
        label: "Document the pressure",
        detail: "Any pressure to compromise safety controls goes on the record.",
      },
    ],
  },
  "wind-response": {
    title: "Staged Wind Response",
    footer: "Your slide's wind limit lives in its operations manual - know the number before the wind arrives.",
    steps: [
      {
        tone: "info",
        label: "Monitor continuously",
        detail: "An anemometer at the highest dispatch platform - wind at the tower is stronger than wind on the deck.",
      },
      {
        tone: "warn",
        label: "Winds rising toward the limit",
        detail: "Brief operators and watch ride behaviour - expect slower, less predictable riders on open flumes.",
      },
      {
        tone: "warn",
        label: "Gusts near the limit",
        detail: "Restrict the exposed rides first - tall open flumes and light riders are affected most. Gusts move riders, not averages.",
      },
      {
        tone: "danger",
        label: "Sustained wind above the manufacturer's limit",
        detail: "Close the affected slides. The figure in the operations manual governs - not judgement on the day.",
      },
      {
        tone: "danger",
        label: "Lightning or storm front",
        detail: "Clear pools and towers immediately. This overrides everything else.",
      },
    ],
  },
  "post-incident-steps": {
    title: "After the Incident - In This Order",
    footer: "Facts only, recorded immediately - never speculation, interpretation or blame.",
    steps: [
      {
        tone: "danger",
        label: "Preserve the scene",
        detail: "Move or clean nothing unless required for medical treatment. The scene is evidence.",
      },
      {
        tone: "info",
        label: "Photograph early",
        detail: "Scene, damage, equipment readings, flow rate, conditions - as soon as practical.",
      },
      {
        tone: "info",
        label: "Document immediately",
        detail: "Time, exact location, people involved, factual description, conditions, actions taken.",
      },
      {
        tone: "info",
        label: "Capture witnesses",
        detail: "Names and contact details before they leave the area.",
      },
      {
        tone: "success",
        label: "Debrief and support",
        detail: "Supervisor-led and blame-free. Stress and guilt are normal - offer employee assistance.",
      },
    ],
  },
};

const stepVariant = {
  hidden: { opacity: 0, x: -12 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.15 + i * 0.14, ease: EASE },
  }),
};

function Ladder({ data }: { data: LadderData }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-4 text-center">
        {data.title}
      </p>
      <div className="relative">
        <motion.div
          aria-hidden
          variants={{
            hidden: { scaleY: 0 },
            show: { scaleY: 1, transition: { duration: 0.9, ease: EASE } },
          }}
          className="absolute left-[15px] top-4 bottom-4 w-px bg-stone-200 origin-top"
        />
        <div className="space-y-2">
          {data.steps.map((step, i) => {
            const color = TONE_COLOR[step.tone];
            return (
              <motion.div key={i} variants={stepVariant} custom={i} className="flex items-start gap-3">
                <div
                  className="relative z-10 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center shrink-0 text-[11px] font-bold"
                  style={{ borderColor: color, color }}
                >
                  {step.tone === "danger" && !reduce && (
                    <span
                      aria-hidden
                      className="ping-ring absolute inset-0 rounded-full border-2"
                      style={{ borderColor: color, animationDelay: `${1.4 + i * 0.4}s` }}
                    />
                  )}
                  {i + 1}
                </div>
                <div
                  className="flex-1 rounded-2xl border bg-white px-3.5 py-3"
                  style={{ borderColor: `${color}30` }}
                >
                  <p className="text-[12.5px] font-bold leading-tight" style={{ color }}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{step.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {data.footer && (
        <motion.p
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, delay: 0.3 + data.steps.length * 0.14 } },
          }}
          className="text-[11px] text-stone-400 text-center mt-3 leading-snug"
        >
          {data.footer}
        </motion.p>
      )}
    </motion.div>
  );
}

export function ScenarioNonCompliant() {
  return <Ladder data={LADDERS["scenario-noncompliant"]} />;
}
export function ScenarioBlockage() {
  return <Ladder data={LADDERS["scenario-blockage"]} />;
}
export function ScenarioThroughput() {
  return <Ladder data={LADDERS["scenario-throughput"]} />;
}
export function PostIncidentSteps() {
  return <Ladder data={LADDERS["post-incident-steps"]} />;
}
export function WindResponse() {
  return <Ladder data={LADDERS["wind-response"]} />;
}
