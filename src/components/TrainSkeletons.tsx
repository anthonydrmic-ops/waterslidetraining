"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";

/**
 * Full-screen branded loader. Held in place until a page's data has fully
 * resolved, so dynamic content (resume banner, badges, scores) animates in once
 * rather than popping in piecemeal after the page has already painted.
 */
export function TrainPageLoader({ label = "Preparing your training" }: { label?: string }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative flex flex-col items-center justify-center overflow-hidden">
      <div className="noise-overlay" />
      {/* Soft brand glow behind the mark */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 42%, rgba(31,122,140,0.07), transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="relative flex flex-col items-center"
      >
        {/* Logo inside a softly-shadowed tile */}
        <div className="w-16 h-16 mb-8 rounded-2xl bg-white shadow-[0_10px_30px_rgba(11,58,102,0.10)] flex items-center justify-center">
          <img
            src="/rest-group-logo.png"
            alt="REST Group"
            width={38}
            height={38}
            className="rounded-lg"
          />
        </div>

        {/* Slim indeterminate progress sweep */}
        <div className="w-48 h-[3px] rounded-full bg-stone-200/60 overflow-hidden">
          <motion.div
            className="h-full w-1/3 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--teal), var(--cta), transparent)",
            }}
            animate={{ x: ["-150%", "330%"] }}
            transition={{ duration: 1.25, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          />
        </div>

        <motion.p
          className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.p>
      </motion.div>
    </div>
  );
}

/** Shared floating-nav shell so skeletons match the real chrome exactly. */
function NavShell({ label, maxWidth }: { label: string; maxWidth: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-5">
      <div className={`${maxWidth} mx-auto`}>
        <div className="nav-glass rounded-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/train"
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-[0.95] transition-all duration-300"
            >
              <ArrowLeft size={14} weight="bold" className="text-stone-500" />
            </Link>
            <div className="flex items-center gap-2.5">
              <img
                src="/rest-group-logo.png"
                alt="REST Group"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-sm font-semibold tracking-tight text-stone-700">
                {label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/** Centered single-card skeleton — used by the module-complete page. */
export function CenteredCardSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative flex items-center justify-center">
      <div className="noise-overlay" />
      <div className="relative w-full max-w-lg mx-auto px-6 py-16">
        <div className="card-shell">
          <div className="card-core p-8 md:p-12 flex flex-col items-center">
            <div className="skeleton w-16 h-16 rounded-full mb-6" />
            <div className="skeleton h-5 w-40 rounded-full mb-5" />
            <div className="skeleton h-8 w-3/4 rounded-lg mb-3" />
            <div className="skeleton h-4 w-2/3 rounded mb-2" />
            <div className="skeleton h-4 w-1/2 rounded mb-8" />
            <div className="skeleton w-44 h-28 rounded-2xl mb-8" />
            <div className="skeleton h-13 w-full rounded-full mb-3" style={{ height: "3.25rem" }} />
            <div className="skeleton h-11 w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Certificate page skeleton — header, large certificate ghost, action buttons. */
export function CertifiedSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative">
      <div className="noise-overlay" />
      <NavShell label="Course Complete" maxWidth="max-w-3xl" />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="skeleton w-20 h-20 rounded-full mb-6" />
          <div className="skeleton h-5 w-36 rounded-full mb-5" />
          <div className="skeleton h-9 w-2/3 rounded-lg mb-3" />
          <div className="skeleton h-4 w-3/4 rounded mb-1.5" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
        {/* Certificate card */}
        <div className="card-shell mb-8">
          <div className="card-core p-2">
            <div className="rounded-[calc(1.25rem-2px)] bg-white p-8 md:p-12 flex flex-col items-center">
              <div className="skeleton w-20 h-20 rounded-2xl mb-6" />
              <div className="skeleton h-3 w-40 rounded-full mb-3" />
              <div className="skeleton h-7 w-44 rounded-lg mb-2" />
              <div className="skeleton h-3 w-56 rounded mb-8" />
              <div className="w-full border-t border-b border-stone-100 py-7 mb-7 flex flex-col items-center">
                <div className="skeleton h-3 w-28 rounded mb-2" />
                <div className="skeleton h-6 w-52 rounded-lg mb-3" />
                <div className="skeleton h-3 w-3/4 rounded" />
              </div>
              <div className="flex gap-10">
                <div className="skeleton h-10 w-24 rounded-lg" />
                <div className="skeleton h-10 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <div className="skeleton h-12 w-64 rounded-full" />
          <div className="skeleton h-13 w-full rounded-full" style={{ height: "3.25rem" }} />
        </div>
      </div>
    </div>
  );
}
