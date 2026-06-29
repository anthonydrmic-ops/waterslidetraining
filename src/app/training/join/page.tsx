"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Users, ArrowRight, ShieldCheck, SignIn as SignInIcon } from "@phosphor-icons/react";

function JoinInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = params.get("code");
    if (c) setCode(c.toUpperCase());
  }, [params]);

  const claim = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/train");
        return;
      }
      setError(data.error || "Could not claim a seat. Check the code and try again.");
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(`/training/join?code=${code}`)}`;

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative flex items-center justify-center px-6 py-16">
      <div className="noise-overlay" />
      <div className="relative w-full max-w-md">
        <div className="card-shell">
          <div className="card-core p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-5">
              <Users size={30} weight="duotone" className="text-[var(--accent)]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-stone-900 mb-2">Join your team</h1>
            <p className="text-stone-400 text-sm leading-relaxed max-w-[40ch] mx-auto mb-7">
              Enter the team code you were given to claim your seat on the SlideSure Waterslide Safety
              &amp; Competency Program.
            </p>

            {!isLoaded ? (
              <div className="h-12" />
            ) : !isSignedIn ? (
              <>
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 mb-5">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Team code</p>
                  <p className="text-xl font-bold font-mono tracking-wider text-stone-800">{code || "—"}</p>
                </div>
                <p className="text-sm text-stone-500 mb-4">Sign in or create an account to claim your seat.</p>
                <Link
                  href={signInHref}
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-500 shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
                >
                  <SignInIcon size={18} weight="bold" />
                  Sign in to claim your seat
                </Link>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="TEAM-XXXXX"
                  className="w-full px-4 py-3.5 rounded-xl border border-stone-200/80 bg-white text-center text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-shadow mb-3"
                />
                {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
                <button
                  onClick={claim}
                  disabled={loading || !code.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-500 shadow-[0_4px_16px_rgba(240,90,40,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck size={18} weight="bold" />
                  {loading ? "Claiming…" : "Claim my seat"}
                </button>
                <Link
                  href="/train"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Already enrolled? Go to training
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[var(--background)]" />}>
      <JoinInner />
    </Suspense>
  );
}
