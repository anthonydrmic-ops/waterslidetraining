"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Users,
  Buildings,
  User,
  Certificate,
  CheckCircle,
  Clock,
  SignIn as SignInIcon,
  SignOut as SignOutIcon,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const tiers = [
  {
    id: "individual",
    name: "Individual",
    icon: User,
    seatsLabel: "1 user",
    minSeats: 1,
    maxSeats: 1,
    regular: 149,
    launch: 99,
    description: "For independent operators and freelancers",
    popular: false,
  },
  {
    id: "team",
    name: "Team",
    icon: Users,
    seatsLabel: "2-10 users",
    minSeats: 2,
    maxSeats: 10,
    regular: 119,
    launch: 89,
    description: "For small parks and single-attraction teams",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    icon: Buildings,
    seatsLabel: "11-50 users",
    minSeats: 11,
    maxSeats: 50,
    regular: 99,
    launch: 79,
    description: "For multi-attraction facilities and chains",
    popular: false,
  },
];

// Launch pricing runs through the end of July 2026 (AEST).
const LAUNCH_END = new Date("2026-07-31T23:59:59+10:00").getTime();

const features = [
  "9 comprehensive training modules",
  "150+ knowledge assessment questions",
  "Interactive diagrams and visual aids",
  "Cumulative scoring with 80% pass threshold",
  "Downloadable PDF certificate on completion",
  "LinkedIn-ready social sharing assets",
  "Progress saved across sessions",
  "Admin dashboard for team tracking",
];

export default function TrainingPage() {
  return (
    <Suspense>
      <TrainingPageInner />
    </Suspense>
  );
}

function TrainingPageInner() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState("team");
  const [seats, setSeats] = useState(2); // team default (its min)
  const [launchActive, setLaunchActive] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [showSale, setShowSale] = useState(false);
  const [loading, setLoading] = useState(false);
  const [licensed, setLicensed] = useState<boolean | null>(null);
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const selectedTierObj = tiers.find((t) => t.id === selectedTier)!;
  const activePerSeat = launchActive ? selectedTierObj.launch : selectedTierObj.regular;

  const selectTier = (id: string) => {
    setSelectedTier(id);
    const t = tiers.find((x) => x.id === id)!;
    setSeats(t.minSeats);
  };

  // Live launch countdown to the end of July (AEST).
  useEffect(() => {
    setMounted(true);
    const update = () => {
      const diff = LAUNCH_END - Date.now();
      setLaunchActive(diff > 0);
      const s = Math.max(0, Math.floor(diff / 1000));
      setTimeLeft({
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const dismissSale = () => {
    setShowSale(false);
    try {
      sessionStorage.setItem("slidesure-sale-seen", "1");
    } catch {
      /* storage unavailable */
    }
  };

  // First-visit sale popup — only while the launch is on, once per session.
  useEffect(() => {
    if (!mounted || !launchActive || licensed === true) return;
    try {
      if (sessionStorage.getItem("slidesure-sale-seen")) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setShowSale(true), 1300);
    return () => clearTimeout(t);
  }, [mounted, launchActive, licensed]);

  useEffect(() => {
    if (!isLoaded) return;

    if (searchParams.get("purchased") === "true" && isSignedIn) {
      router.replace("/train");
      return;
    }

    if (isSignedIn) {
      fetch("/api/license")
        .then((res) => res.json())
        .then((data) => setLicensed(data.licensed))
        .catch(() => setLicensed(false));
    }
  }, [isLoaded, isSignedIn, searchParams, router]);

  const handlePurchase = async (tier: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: "waterslide-safety",
          tier,
          seats,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data);
        alert("Couldn't start checkout. Please try again, or contact info@restgroup.com.au.");
      }
    } catch (err) {
      console.error("Checkout exception:", err);
      alert("Couldn't connect to checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/training/slidesure");
      return;
    }
    const code = promo.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoMsg(null);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/train");
      } else {
        setPromoMsg(data.error || "That code isn't valid");
      }
    } catch {
      setPromoMsg("Something went wrong. Please try again.");
    } finally {
      setPromoLoading(false);
    }
  };

  const ctaLabel = () => {
    if (loading) return "Redirecting to secure checkout…";
    if (!isLoaded) return "Loading…";
    return "Continue to secure checkout";
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative">
      <div className="noise-overlay" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="nav-glass rounded-full px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/training"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-[0.95] transition-all duration-300"
              >
                <ArrowLeft size={14} weight="bold" className="text-stone-500" />
              </Link>
              <div className="flex items-center gap-2.5">
                <img src="/rest-group-logo.png" alt="REST Group" width={28} height={28} className="rounded-lg" />
                <span className="text-sm font-semibold tracking-tight text-stone-700">
                  Training Courses
                </span>
              </div>
            </div>
            {isLoaded && !isSignedIn && (
              <Link
                href="/sign-in?redirect_url=/training/slidesure"
                className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs font-medium hover:bg-stone-200 transition-all duration-300 flex items-center gap-1.5"
              >
                <SignInIcon size={12} weight="bold" />
                Sign In
              </Link>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 hidden sm:inline">{user?.primaryEmailAddress?.emailAddress}</span>
                {licensed && (
                  <Link
                    href="/train"
                    className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-all duration-300"
                  >
                    Go to Course
                  </Link>
                )}
                <button
                  onClick={() => signOut({ redirectUrl: "/training/slidesure" })}
                  className="px-3 py-2 rounded-full bg-stone-100 text-stone-500 text-xs font-medium hover:bg-stone-200 transition-all duration-300 flex items-center gap-1.5"
                >
                  <SignOutIcon size={12} weight="bold" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-28 pb-28 md:pb-16">
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Hero - compact with the title overlaid, so the plan info sits high
              on the page instead of being pushed below a tall image. */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="relative w-full h-[42vh] min-h-[240px] max-h-[440px] rounded-3xl overflow-hidden ring-1 ring-stone-200/60 shadow-[0_20px_50px_rgba(11,58,102,0.12)]">
              <Image
                src="/lesson-images/00-marketing-hero-v2.jpg"
                alt="Two riders on tubes racing down a multi-lane waterslide, colourful intertwined flumes towering behind them against a blue sky"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1140px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-black/70 via-black/20 to-transparent" />
              {mounted && launchActive && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--cta)] text-white text-[11px] font-semibold uppercase tracking-wider shadow-lg">
                  🔥 July launch offer
                </div>
              )}
              <div className="absolute top-0 right-0 p-6 md:p-8 text-right max-w-[72%] md:max-w-[58%]">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider mb-3">
                  REST Group Training
                </div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tighter text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] max-w-[24ch] ml-auto">
                  SlideSure - Waterslide Safety & Competency Program
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Already licensed banner */}
          {licensed && (
            <motion.div variants={fadeUp} className="mb-10">
              <Link href="/train">
                <div className="card-shell" style={{ background: "rgba(4, 120, 87, 0.04)", borderColor: "rgba(4, 120, 87, 0.1)" }}>
                  <div className="card-core p-6 flex items-center gap-4 hover:bg-emerald-50/30 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle size={24} weight="fill" className="text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-800">
                        You have access to this course
                      </p>
                      <p className="text-xs text-emerald-600/60 mt-0.5">
                        Click here to continue your training
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-emerald-400 shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Needs license banner */}
          {isSignedIn && licensed === false && searchParams.get("needs_license") === "true" && (
            <motion.div variants={fadeUp} className="mb-10">
              <div className="card-shell" style={{ background: "rgba(240, 90, 40, 0.04)", borderColor: "rgba(240, 90, 40, 0.1)" }}>
                <div className="card-core p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} weight="duotone" className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-orange-800">
                      Purchase required
                    </p>
                    <p className="text-xs text-orange-600/60 mt-0.5">
                      You&apos;re signed in but don&apos;t have a license yet. Choose a plan below to get started.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Course Card */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="card-shell">
              <div className="card-core p-6 md:p-7">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                          <ShieldCheck size={24} weight="duotone" className="text-[var(--accent)]" />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">
                            Available Now
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900">
                            Waterslide Safety & Competency Program
                          </h2>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:justify-end shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium whitespace-nowrap">
                          <Clock size={12} /> 8-12 hours
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium whitespace-nowrap">
                          <Certificate size={12} /> Certificate
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium whitespace-nowrap">
                          9 modules, 29 lessons
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-stone-400 leading-relaxed mb-5">
                      Comprehensive training covering system understanding, inspections,
                      surface management, operations, defect recognition, water quality,
                      incident prevention, and emergency response. Includes final
                      assessment with certification.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-stone-500">
                          <CheckCircle size={14} weight="fill" className="text-emerald-500 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing - hide if already licensed */}
          {licensed !== true && (
            <>
              {/* Launch offer + live countdown */}
              {mounted && launchActive && (
                <motion.div variants={fadeUp} className="mb-6">
                  <style>{`
                    @keyframes saleGlow { 0%,100%{box-shadow:0 0 0 0 rgba(240,90,40,0)} 50%{box-shadow:0 0 0 5px rgba(240,90,40,0.13)} }
                    @keyframes flameBob { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.18) rotate(-5deg)} }
                  `}</style>
                  <div
                    className="relative rounded-2xl border-2 border-[var(--cta)]/35 bg-[var(--cta)]/[0.06] px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
                    style={{ animation: "saleGlow 2.4s ease-in-out infinite" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-2xl inline-block"
                        style={{ animation: "flameBob 1.6s ease-in-out infinite", transformOrigin: "center bottom" }}
                      >
                        🔥
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--cta)] text-white text-[9px] font-bold uppercase tracking-wider">
                            Limited time
                          </span>
                          <p className="text-sm font-bold text-stone-800">July launch pricing</p>
                        </div>
                        <p className="text-xs text-stone-500">
                          Save up to <strong className="text-[var(--cta)]">$50/seat</strong> - founding price for all of July. Regular pricing returns 1 August.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {([["Days", timeLeft.d], ["Hrs", timeLeft.h], ["Min", timeLeft.m], ["Sec", timeLeft.s]] as const).map(([label, val]) => (
                        <div key={label} className="flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 min-w-[46px]">
                          <span className="text-base font-bold font-mono text-stone-900 tabular-nums">{String(val).padStart(2, "0")}</span>
                          <span className="text-[9px] uppercase tracking-wider text-stone-400">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeUp} className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-stone-900 text-center mb-2">
                  Choose Your Plan
                </h2>
                <p className="text-stone-400 text-sm text-center mb-8">
                  All plans include full course access and certification. Per-seat pricing - pick how many seats you need.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {tiers.map((tier) => {
                    const Icon = tier.icon;
                    const isSelected = selectedTier === tier.id;
                    const price = launchActive ? tier.launch : tier.regular;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => selectTier(tier.id)}
                        className={`card-shell text-left transition-all duration-300 ${
                          isSelected ? "ring-2 ring-[var(--cta)] ring-offset-2" : ""
                        }`}
                      >
                        <div className="card-core p-6 relative">
                          {tier.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--cta)] text-white text-[10px] font-semibold uppercase tracking-wider">
                              Most Popular
                            </div>
                          )}
                          <div className="flex items-center gap-3 mb-4 mt-1">
                            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                              <Icon size={20} weight="duotone" className="text-stone-500" />
                            </div>
                            <div>
                              <p className="font-bold text-stone-900">{tier.name}</p>
                              <p className="text-[11px] text-stone-400">{tier.seatsLabel}</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold tracking-tight text-stone-900">${price}</span>
                              <span className="text-sm text-stone-400">/seat</span>
                            </div>
                            {launchActive && tier.regular > tier.launch && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-sm text-stone-400">
                                  Normally <span className="line-through decoration-stone-400">${tier.regular}</span>
                                </span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  Save ${tier.regular - tier.launch}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 leading-relaxed">{tier.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Seat selector + total + CTA */}
              <motion.div variants={fadeUp} className="max-w-md mx-auto text-center">
                {selectedTierObj.maxSeats > 1 && (
                  <div className="mb-4 px-5 py-4 rounded-2xl border border-stone-200 bg-white text-left">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-700">How many seats?</p>
                        <p className="text-xs text-stone-400">Type, drag or step ({selectedTierObj.minSeats}-{selectedTierObj.maxSeats})</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSeats((s) => Math.max(selectedTierObj.minSeats, s - 1))}
                          disabled={seats <= selectedTierObj.minSeats}
                          className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 text-lg font-bold flex items-center justify-center hover:bg-stone-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          &minus;
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={selectedTierObj.minSeats}
                          max={selectedTierObj.maxSeats}
                          value={seats}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (Number.isNaN(v)) { setSeats(selectedTierObj.minSeats); return; }
                            setSeats(Math.max(selectedTierObj.minSeats, Math.min(selectedTierObj.maxSeats, v)));
                          }}
                          className="w-14 text-center text-lg font-bold font-mono text-stone-900 tabular-nums rounded-lg border border-stone-200 py-1 outline-none focus:ring-2 focus:ring-[var(--cta)]/30"
                        />
                        <button
                          type="button"
                          onClick={() => setSeats((s) => Math.min(selectedTierObj.maxSeats, s + 1))}
                          disabled={seats >= selectedTierObj.maxSeats}
                          className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 text-lg font-bold flex items-center justify-center hover:bg-stone-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={selectedTierObj.minSeats}
                      max={selectedTierObj.maxSeats}
                      value={seats}
                      onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--cta)] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-300 font-mono mt-1">
                      <span>{selectedTierObj.minSeats}</span>
                      <span>{selectedTierObj.maxSeats}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm text-stone-500">{seats} {seats === 1 ? "seat" : "seats"} &times; ${activePerSeat}</span>
                  <span className="text-2xl font-bold tracking-tight text-stone-900">
                    ${activePerSeat * seats}
                    <span className="text-sm font-normal text-stone-400"> AUD</span>
                  </span>
                </div>

                <button
                  onClick={() => handlePurchase(selectedTier)}
                  disabled={loading || !isLoaded}
                  className="w-full group inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full bg-[var(--cta)] text-white font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--cta-dark)] active:scale-[0.97] shadow-[0_4px_16px_rgba(240,90,40,0.25)] disabled:opacity-60"
                >
                  {ctaLabel()}
                  <ArrowRight size={16} weight="bold" className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>

                <p className="text-[11px] text-stone-400 mt-3">
                  No account needed to buy - you&apos;ll get a code to share seats with your team.
                  {isLoaded && !isSignedIn && (
                    <>
                      {" "}Already a member?{" "}
                      <Link href="/sign-in?redirect_url=/training/slidesure" className="text-[var(--accent)] hover:underline">Sign in</Link>
                    </>
                  )}
                </p>

                <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-3 rounded-2xl border border-stone-200 bg-stone-50">
                  <span className="text-sm font-semibold text-stone-700">Need more than 50 seats?</span>
                  <a href="mailto:info@restgroup.com.au?subject=Enterprise%20training%20enquiry" className="text-sm font-semibold text-[var(--accent)] hover:underline">
                    Contact us for enterprise pricing &rarr;
                  </a>
                </div>

                <p className="text-[11px] text-stone-400 mt-5 max-w-md mx-auto leading-relaxed">
                  By purchasing you agree to our{" "}
                  <a href="/terms" className="text-[var(--accent)] hover:underline">Terms &amp; Conditions</a>. The training
                  is provided by Comfy Chaos Pty Ltd and offered via REST Group; your payment is processed securely and may
                  appear as Comfy Chaos on your statement. This is a competency training program and statement of
                  completion - not a nationally accredited (RTO/VET) qualification or a statutory licence.
                </p>
              </motion.div>

              {/* Promo code redemption */}
              <motion.div variants={fadeUp} className="mt-10 max-w-sm mx-auto text-center">
                <p className="text-[11px] font-medium text-stone-400 mb-2.5">
                  Have a promo code?
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value);
                      setPromoMsg(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRedeem();
                    }}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2.5 rounded-full border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-300 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 transition-all duration-300"
                  />
                  <button
                    onClick={handleRedeem}
                    disabled={promoLoading || !promo.trim()}
                    className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 active:scale-[0.97] transition-all duration-300 disabled:opacity-40 shrink-0"
                  >
                    {promoLoading ? "..." : "Redeem"}
                  </button>
                </div>
                {promoMsg && (
                  <p className="text-[11px] text-red-500 mt-2">{promoMsg}</p>
                )}
              </motion.div>
            </>
          )}

        </motion.div>
      </div>

      {/* Mobile sticky buy bar - price + CTA follow on scroll */}
      {licensed !== true && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-white/90 backdrop-blur-md border-t border-stone-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900">${activePerSeat * seats}</span>
                {mounted && launchActive && selectedTierObj.regular > selectedTierObj.launch && (
                  <span className="text-xs text-stone-300 line-through">${selectedTierObj.regular * seats}</span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">{selectedTierObj.name} · {seats} {seats === 1 ? "seat" : "seats"}</p>
            </div>
            <button
              onClick={() => handlePurchase(selectedTier)}
              disabled={loading || !isLoaded}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all duration-300 shadow-[0_4px_16px_rgba(240,90,40,0.25)] disabled:opacity-60"
            >
              {loading ? "…" : "Checkout"}
              <ArrowRight size={15} weight="bold" />
            </button>
          </div>
        </div>
      )}

      {/* First-visit sale popup - only while the launch is on */}
      <AnimatePresence>
        {showSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            onClick={dismissSale}
          >
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative card-shell max-w-sm w-full"
            >
              <div className="card-core p-7 text-center">
                <button
                  onClick={dismissSale}
                  aria-label="Close"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 text-stone-400 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                  <X size={15} weight="bold" />
                </button>
                <div className="text-4xl mb-3">🔥</div>
                <div className="inline-flex px-3 py-1 rounded-full bg-[var(--cta)] text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                  July launch sale
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-stone-900 mb-2">Save up to $50 / seat</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4 max-w-[34ch] mx-auto">
                  Founding pricing on the SlideSure program for the whole of July. Regular prices return on 1 August.
                </p>
                <div className="flex justify-center gap-2 mb-5">
                  {([["Days", timeLeft.d], ["Hrs", timeLeft.h], ["Min", timeLeft.m], ["Sec", timeLeft.s]] as const).map(([label, val]) => (
                    <div key={label} className="flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 min-w-[48px]">
                      <span className="text-lg font-bold font-mono text-stone-900 tabular-nums">{String(val).padStart(2, "0")}</span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-400">{label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={dismissSale}
                  className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[var(--cta)] text-white font-medium hover:bg-[var(--cta-dark)] active:scale-[0.97] transition-all shadow-[0_4px_16px_rgba(240,90,40,0.25)]"
                >
                  View the deal
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
