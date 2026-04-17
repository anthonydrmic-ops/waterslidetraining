"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
} from "@phosphor-icons/react";
import Link from "next/link";

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
    seats: "1 user",
    price: 149,
    perSeat: 149,
    description: "For independent operators and freelancers",
    popular: false,
  },
  {
    id: "team",
    name: "Team",
    icon: Users,
    seats: "Up to 10 users",
    price: 99,
    perSeat: 99,
    description: "For small parks and single-attraction teams",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    icon: Buildings,
    seats: "Up to 50 users",
    price: 79,
    perSeat: 79,
    description: "For multi-attraction facilities and chains",
    popular: false,
  },
];

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState("team");
  const [loading, setLoading] = useState(false);
  const [licensed, setLicensed] = useState<boolean | null>(null);

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
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/training/slidesure");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: "waterslide-safety",
          tier,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === "Unauthorized") {
        router.push("/sign-in?redirect_url=/training/slidesure");
      } else {
        alert("Payment system is being configured. Check back soon.");
      }
    } catch {
      alert("Payment system is being configured. Check back soon.");
    } finally {
      setLoading(false);
    }
  };

  const ctaLabel = () => {
    if (loading) return "Redirecting to checkout...";
    if (!isLoaded) return "Loading...";
    if (!isSignedIn) {
      return `Create Account & Purchase`;
    }
    return `Purchase ${tiers.find((t) => t.id === selectedTier)?.name} Plan`;
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
                <span className="text-xs text-stone-400">{user?.primaryEmailAddress?.emailAddress}</span>
                {licensed && (
                  <Link
                    href="/train"
                    className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-all duration-300"
                  >
                    Go to Course
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-28 pb-16">
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-14">
            <div className="eyebrow bg-stone-100 border border-stone-200/60 text-stone-500 mb-5 mx-auto w-fit">
              REST Group Training
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-stone-900 mb-3">
              SlideSure - Waterslide Safety
            </h1>
            <p className="text-stone-400 text-base md:text-lg max-w-[55ch] mx-auto leading-relaxed">
              Standards-aligned training programs for aquatic recreation facilities.
              Purchase licenses for your team and track completion in real-time.
            </p>
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
          <motion.div variants={fadeUp} className="mb-14">
            <div className="card-shell">
              <div className="card-core p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                        <ShieldCheck size={24} weight="duotone" className="text-[var(--accent)]" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">
                          Available Now
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900">
                          Waterslide Safety & Competency
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-stone-400 leading-relaxed mb-6 max-w-[55ch]">
                      Comprehensive training covering system understanding, inspections,
                      surface management, operations, defect recognition, water quality,
                      incident prevention, and emergency response. Includes final
                      assessment with certification.
                    </p>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">
                        <Clock size={12} /> 8-12 hours
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">
                        <Certificate size={12} /> Certificate included
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">
                        9 modules, 29 lessons
                      </span>
                    </div>

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
              <motion.div variants={fadeUp} className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-stone-900 text-center mb-2">
                  Choose Your Plan
                </h2>
                <p className="text-stone-400 text-sm text-center mb-8">
                  All plans include full course access and certification. Per-seat pricing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {tiers.map((tier) => {
                    const Icon = tier.icon;
                    const isSelected = selectedTier === tier.id;

                    return (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
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
                              <p className="text-[11px] text-stone-400">{tier.seats}</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <span className="text-3xl font-bold tracking-tight text-stone-900">${tier.price}</span>
                            <span className="text-sm text-stone-400"> /seat</span>
                          </div>
                          <p className="text-xs text-stone-400 leading-relaxed">{tier.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp} className="text-center">
                <button
                  onClick={() => handlePurchase(selectedTier)}
                  disabled={loading || !isLoaded}
                  className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-full bg-[var(--cta)] text-white font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--cta-dark)] active:scale-[0.97] shadow-[0_4px_16px_rgba(240,90,40,0.25)] disabled:opacity-60"
                >
                  {ctaLabel()}
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </button>
                {!isSignedIn && isLoaded && (
                  <p className="text-[11px] text-stone-400 mt-3">
                    Already have an account?{" "}
                    <Link href="/sign-in?redirect_url=/training/slidesure" className="text-[var(--accent)] hover:underline">
                      Sign in
                    </Link>
                  </p>
                )}
                <p className="text-[11px] text-stone-300 mt-4">
                  Need 50+ seats?{" "}
                  <a href="mailto:training@restgroup.com.au" className="text-[var(--accent)] hover:underline">
                    Contact us for enterprise pricing
                  </a>
                </p>
              </motion.div>
            </>
          )}

          {/* Dev skip button */}
          <motion.div variants={fadeUp} className="mt-10 text-center">
            <Link
              href="/train"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 border border-stone-200 text-stone-400 text-xs font-medium hover:bg-stone-200 hover:text-stone-600 transition-all duration-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5"/><path d="M6 17l5-5-5-5"/></svg>
              Dev - Skip to Training
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
