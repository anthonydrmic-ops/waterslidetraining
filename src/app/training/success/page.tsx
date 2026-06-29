"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Copy,
  Check,
  Users,
  ArrowRight,
  Spinner,
  ShieldCheck,
} from "@phosphor-icons/react";

interface Result {
  pending: boolean;
  joinCode?: string;
  totalSeats?: number;
  usedSeats?: number;
}

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [result, setResult] = useState<Result | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  // Poll the result endpoint until the webhook has provisioned the licence.
  useEffect(() => {
    if (!sessionId) {
      setTimedOut(true);
      return;
    }
    let tries = 0;
    let active = true;
    const tick = async () => {
      tries++;
      try {
        const res = await fetch(`/api/checkout/result?session_id=${encodeURIComponent(sessionId)}`);
        const data = (await res.json()) as Result;
        if (!active) return;
        if (data && !data.pending) {
          setResult(data);
          return;
        }
      } catch {
        /* keep polling */
      }
      if (tries >= 20) {
        setTimedOut(true);
        return;
      }
      setTimeout(tick, 1500);
    };
    tick();
    return () => {
      active = false;
    };
  }, [sessionId]);

  const joinCode = result?.joinCode || "";
  const shareLink =
    typeof window !== "undefined" && joinCode
      ? `${window.location.origin}/training/join?code=${joinCode}`
      : "";

  const copy = useCallback(async (text: string, which: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative flex items-center justify-center px-6 py-16">
      <div className="noise-overlay" />
      <div className="relative w-full max-w-lg">
        <div className="card-shell">
          <div className="card-core p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} weight="fill" className="text-emerald-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-stone-900 mb-2">
              Payment successful
            </h1>

            {!result && !timedOut && (
              <div className="mt-6 flex flex-col items-center gap-3 text-stone-400">
                <Spinner size={22} className="animate-spin" />
                <p className="text-sm">Setting up your licence…</p>
              </div>
            )}

            {timedOut && !result && (
              <p className="text-stone-500 text-sm leading-relaxed mt-4 max-w-[42ch] mx-auto">
                Your payment went through. Your licence is being set up — check your{" "}
                <Link href="/dashboard" className="text-[var(--accent)] hover:underline">team dashboard</Link>{" "}
                in a moment for your team code, or contact{" "}
                <a href="mailto:info@restgroup.com.au" className="text-[var(--accent)] hover:underline">info@restgroup.com.au</a>.
              </p>
            )}

            {result && (
              <>
                <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-[44ch] mx-auto mb-6">
                  Thanks for your purchase. Share the team code below so your people can claim a
                  seat, and start the course yourself anytime.
                </p>

                {/* Seats */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-[var(--accent)] mb-5">
                  <Users size={14} weight="duotone" />
                  {(result.totalSeats ?? 0) - (result.usedSeats ?? 0)} of {result.totalSeats} seats available
                </div>

                {/* Team code */}
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-5 mb-3 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
                    Your team code
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold font-mono tracking-wider text-stone-900">{joinCode}</span>
                    <button
                      onClick={() => copy(joinCode, "code")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-100 active:scale-[0.97] transition-all"
                    >
                      {copied === "code" ? <Check size={14} weight="bold" className="text-emerald-500" /> : <Copy size={14} />}
                      {copied === "code" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Share link */}
                {shareLink && (
                  <button
                    onClick={() => copy(shareLink, "link")}
                    className="w-full inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-stone-200 text-left mb-6 hover:bg-stone-50 active:scale-[0.99] transition-all"
                  >
                    <span className="text-xs text-stone-500 truncate">{shareLink}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] shrink-0">
                      {copied === "link" ? <Check size={14} weight="bold" className="text-emerald-500" /> : <Copy size={14} />}
                      {copied === "link" ? "Copied" : "Copy link"}
                    </span>
                  </button>
                )}

                <div className="rounded-2xl bg-blue-50/60 border border-blue-100/70 p-4 text-left mb-7">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong className="text-stone-700">How to distribute seats:</strong> send the code (or link) to
                    your team. Each person signs in or creates an account, enters the code, and claims a seat —
                    until your seats run out. Manage everything from your team dashboard.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/training/join?code=${joinCode}`}
                    className="group w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[var(--cta)] text-white font-medium transition-all duration-500 hover:bg-[var(--cta-dark)] active:scale-[0.97] shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
                  >
                    <ShieldCheck size={18} weight="bold" />
                    Claim a seat &amp; start the course
                  </Link>
                  <Link
                    href="/dashboard"
                    className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
                  >
                    Go to team dashboard
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </div>

                <p className="text-[11px] text-stone-400 mt-6 leading-relaxed">
                  Tip: to manage your team, sign in (or create an account) with the same email you used at
                  checkout — you&apos;ll be set as the team admin automatically.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[var(--background)]" />}>
      <SuccessInner />
    </Suspense>
  );
}
