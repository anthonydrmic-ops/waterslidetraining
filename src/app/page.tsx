"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Certificate,
  ArrowRight,
  CheckCircle,
  Lightning,
  Eye,
  Wrench,
  Drop,
  Warning,
  FirstAid,
  Exam,
  Blueprint,
  ListChecks,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { modules, getTotalLessons } from "@/data/training-modules";
import { getProgress, getCompletionPercentage } from "@/lib/progress-store";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  blueprint: Blueprint,
  clipboard: ListChecks,
  waves: Drop,
  controls: Lightning,
  magnifier: Eye,
  droplet: Drop,
  shield: ShieldCheck,
  siren: FirstAid,
  certificate: Certificate,
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
  },
};

export default function HomePage() {
  const [progress, setProgress] = useState(getProgress());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress());
  }, []);

  const totalLessons = getTotalLessons();
  const completionPct = mounted ? getCompletionPercentage(totalLessons) : 0;
  const completedCount = mounted ? progress.completedLessons.length : 0;

  return (
    <div className="min-h-[100dvh] relative">
      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Floating Pill Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="nav-glass rounded-full px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-[0_2px_8px_rgba(13,115,119,0.3)]">
                <ShieldCheck size={19} weight="bold" className="text-white" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-stone-800">
                SlideGuard<span className="text-[var(--accent)]">Pro</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {mounted && progress.certified && (
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <Certificate size={14} weight="fill" />
                  Certified
                </div>
              )}
              <Link
                href="/train"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-white text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-stone-800 active:scale-[0.97]"
              >
                {completedCount > 0 ? "Continue" : "Start Training"}
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-[1px] group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <ArrowUpRight size={11} weight="bold" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero — Asymmetric Split */}
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-16 md:pb-24">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-[#fafaf9] to-teal-50/30" />
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-teal-100/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-stone-200/20 rounded-full blur-[80px]" />

        <div className="relative max-w-[1400px] mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start"
          >
            {/* Left — Content (7 cols for asymmetry) */}
            <div className="lg:col-span-7 lg:pr-8">
              <motion.div variants={fadeUp}>
                <div className="eyebrow bg-teal-50 border border-teal-200/50 text-[var(--accent)] mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  OEM-Aligned Training Platform
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tighter leading-[1.05] text-stone-900 mb-6"
              >
                Waterslide Operator
                <br />
                <span className="text-[var(--accent)]">Competency System</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg text-stone-500 leading-relaxed max-w-[52ch] mb-10"
              >
                Standards-aligned, incident-informed, scenario-based training
                grounded in ProSlide and Waterplay OEM manuals. Defensible
                evidence of operational competency.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/train"
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-stone-900 text-white font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-stone-800 active:scale-[0.97] shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                >
                  {completedCount > 0 ? "Continue Training" : "Begin Training"}
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </Link>
                {mounted && completedCount > 0 && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-stone-200/80 text-sm font-medium text-stone-500 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {completionPct}% Complete
                  </div>
                )}
              </motion.div>

              {/* Credential pills */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <CredentialPill
                  icon={<Wrench size={14} weight="bold" className="text-[var(--accent)]" />}
                  label="OEM-Aligned"
                />
                <CredentialPill
                  icon={<Warning size={14} weight="bold" className="text-amber-600" />}
                  label="Incident-Informed"
                />
                <CredentialPill
                  icon={<Exam size={14} weight="bold" className="text-emerald-700" />}
                  label="Competency Certified"
                />
              </motion.div>
            </div>

            {/* Right — Stats Bento (5 cols) */}
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <div className="card-shell">
                <div className="card-core p-7 md:p-8">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-7">
                    <StatBlock label="Modules" value="9" sub="Standards-aligned" />
                    <StatBlock label="Lessons" value={totalLessons.toString()} sub="OEM-sourced" />
                    <StatBlock label="Scenarios" value="4" sub="Real incidents" />
                    <StatBlock label="Assessment" value="10" sub="Pass to certify" />
                  </div>

                  {mounted && completedCount > 0 && (
                    <div className="mt-7 pt-6 border-t border-stone-100">
                      <div className="flex items-center justify-between text-sm mb-2.5">
                        <span className="text-stone-400 text-xs font-medium uppercase tracking-wider">Progress</span>
                        <span className="font-mono font-semibold text-stone-600 text-sm">
                          {completedCount}/{totalLessons}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[var(--accent)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPct}%` }}
                          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Micro-interaction: breathing accent line */}
                  <div className="mt-6 flex items-center gap-3 pt-5 border-t border-stone-100">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                      <ShieldCheck size={16} weight="duotone" className="text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-700">Defensible Training</p>
                      <p className="text-[11px] text-stone-400">AS 3533 + EN 1069 aligned</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modules Grid — Asymmetric Bento */}
      <section className="section-pad bg-white border-t border-stone-200/50">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="mb-14"
          >
            <div className="eyebrow bg-stone-100 border border-stone-200/60 text-stone-500 mb-6">
              Curriculum
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-stone-900 mb-3">
              Training Modules
            </h2>
            <p className="text-stone-400 text-base md:text-lg max-w-[55ch] leading-relaxed">
              Nine modules grounded in ProSlide and Waterplay OEM documentation,
              industry standards, and real incident data.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {modules.map((mod, i) => {
              const Icon = iconMap[mod.icon] || ShieldCheck;
              const moduleLessons = mod.lessons.map((l) => l.id);
              const completed = mounted
                ? moduleLessons.filter((id) =>
                    progress.completedLessons.includes(id)
                  ).length
                : 0;
              const total = moduleLessons.length;
              const isComplete = completed === total && total > 0;

              // Make first module span 2 cols on large screens
              const isFeature = i === 0;

              return (
                <motion.div
                  key={mod.id}
                  variants={fadeUp}
                  className={isFeature ? "md:col-span-2 lg:col-span-2" : ""}
                >
                  <Link href={`/train/${mod.id}`}>
                    <div className="group h-full card-shell hover:border-stone-300/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <div className={`card-core h-full ${isFeature ? "p-7 md:p-8" : "p-6"}`}>
                        <div className="flex items-start justify-between mb-5">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
                            style={{ backgroundColor: mod.color + "10" }}
                          >
                            <Icon
                              size={22}
                              weight="duotone"
                              style={{ color: mod.color }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            {isComplete ? (
                              <CheckCircle
                                size={20}
                                weight="fill"
                                className="text-emerald-500"
                              />
                            ) : completed > 0 ? (
                              <span className="text-xs font-mono font-semibold text-stone-400 bg-stone-50 px-2 py-0.5 rounded-md">
                                {completed}/{total}
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-300">
                                {String(mod.number).padStart(2, "0")}
                              </span>
                            )}
                          </div>
                        </div>
                        <h3 className="text-[15px] font-semibold text-stone-800 mb-1.5 group-hover:text-[var(--accent)] transition-colors duration-300">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-stone-400 leading-relaxed line-clamp-2">
                          {mod.subtitle}
                        </p>

                        {isFeature && (
                          <p className="text-sm text-stone-400 leading-relaxed mt-3 max-w-[55ch]">
                            {mod.description}
                          </p>
                        )}

                        {mounted && completed > 0 && (
                          <div className="mt-5 h-1 rounded-full bg-stone-100 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: mod.color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(completed / total) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                            />
                          </div>
                        )}

                        {/* Hover arrow */}
                        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-stone-300 group-hover:text-[var(--accent)] transition-all duration-300">
                          <span>{total} lessons</span>
                          <ArrowRight
                            size={12}
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-stone-200/50 bg-stone-50/50">
        <div className="max-w-[1400px] mx-auto px-6 section-pad">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="mb-12"
          >
            <div className="eyebrow bg-white border border-stone-200/60 text-stone-500 mb-6">
              Why This Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-stone-900 mb-3">
              Built Different
            </h2>
            <p className="text-stone-400 text-base md:text-lg max-w-[55ch] leading-relaxed">
              Not generic slide training. A risk control product grounded in
              manufacturer documentation and real failure analysis.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            <motion.div variants={fadeUp}>
              <TrustCard
                icon={<Wrench size={22} weight="duotone" className="text-[var(--accent)]" />}
                title="OEM-Aligned Content"
                description="Every lesson references ProSlide Technology Inc. MA-10059 and Waterplay Solutions Corp. FRP manuals. Your training never contradicts manufacturer instructions."
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <TrustCard
                icon={<Warning size={22} weight="duotone" className="text-amber-600" />}
                title="Incident-Informed Scenarios"
                description="Training scenarios built from real failure patterns: late dispatch collisions, rider non-compliance, slide blockages, and throughput pressure situations."
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <TrustCard
                icon={<Exam size={22} weight="duotone" className="text-emerald-700" />}
                title="Defensible Certification"
                description="Assessment-based competency verification with 80% pass threshold. Provides councils, operators, and insurers with evidence of training completion."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/40 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <ShieldCheck size={14} weight="bold" className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-stone-700">
              SlideGuard<span className="text-[var(--accent)]">Pro</span>
            </span>
          </div>
          <p className="text-[11px] text-stone-400 text-center md:text-right max-w-[60ch] leading-relaxed">
            Content sourced from ProSlide Technology Inc. MA-10059 and Waterplay
            Solutions Corp. FRP Maintenance and Repair Manual. For authorised
            operator training use.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatBlock({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-stone-400 uppercase tracking-[0.15em] font-medium mb-1.5">
        {label}
      </p>
      <p className="text-3xl font-bold tracking-tighter text-stone-900 leading-none">
        {value}
      </p>
      <p className="text-[11px] text-stone-400 mt-1">{sub}</p>
    </div>
  );
}

function CredentialPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-stone-200/80 text-xs font-medium text-stone-600 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {icon}
      {label}
    </div>
  );
}

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-shell h-full">
      <div className="card-core p-7 h-full">
        <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-5">
          {icon}
        </div>
        <h3 className="text-[15px] font-semibold text-stone-800 mb-2">
          {title}
        </h3>
        <p className="text-sm text-stone-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
