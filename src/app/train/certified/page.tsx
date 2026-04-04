"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Certificate,
  Trophy,
  DownloadSimple,
  Copy,
  Check,
  CheckCircle,
  ArrowLeft,
  ShareNetwork,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import {
  defaultProgress,
  refreshProgress,
  type UserProgress,
} from "@/lib/progress-store";
import { redirect } from "next/navigation";
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
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const LINKEDIN_POST = `I'm excited to announce that I have completed the SlideSure Waterslide Assurance & Competency System - a comprehensive training program covering operational safety, defect recognition, water quality management, and incident prevention for waterslide operations.

This certification demonstrates my commitment to maintaining the highest safety standards in aquatic recreation facilities.

#WaterslideSafety #SlideSure #RESTGroup #AquaticSafety #ProfessionalDevelopment`;

export default function CertifiedPage() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingTile, setDownloadingTile] = useState(false);
  const [certId, setCertId] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refreshProgress().then((p) => {
      if (!p.certified) {
        redirect("/train");
        return;
      }
      setProgress(p);
      setMounted(true);
      // Load cert ID from localStorage
      const storedCertId = localStorage.getItem("slidesure-cert-id");
      if (storedCertId) setCertId(storedCertId);
    });
  }, []);

  const userName = progress.userName || "Candidate";
  const certDate = progress.certificationDate
    ? new Date(progress.certificationDate).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const quizScore = progress.quizScores["final-assessment"];
  const score = quizScore?.score ?? 0;
  const total = quizScore?.total ?? 0;

  const handleDownloadPdf = useCallback(async () => {
    if (!certRef.current) return;
    setDownloadingPdf(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = Math.min(pdfW / imgW, pdfH / imgH);
      const w = imgW * ratio;
      const h = imgH * ratio;
      const x = (pdfW - w) / 2;
      const y = (pdfH - h) / 2;

      pdf.addImage(imgData, "PNG", x, y, w, h);
      pdf.save(`SlideSure-Certificate-${userName.replace(/\s+/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloadingPdf(false);
    }
  }, [userName]);

  const handleDownloadTile = useCallback(async () => {
    if (!tileRef.current) return;
    setDownloadingTile(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;

      const canvas = await html2canvas(tileRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.download = `SlideSure-Badge-${userName.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Tile generation failed:", err);
    } finally {
      setDownloadingTile(false);
    }
  }, [userName]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(LINKEDIN_POST);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = LINKEDIN_POST;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[100dvh] bg-[var(--background)]">
        <div className="noise-overlay" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative">
      <div className="noise-overlay" />

      {/* Floating Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-5">
        <div className="max-w-3xl mx-auto">
          <div className="nav-glass rounded-full px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/train"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-[0.95] transition-all duration-300"
              >
                <ArrowLeft size={14} weight="bold" className="text-stone-500" />
              </Link>
              <div className="flex items-center gap-2.5">
                <img src="/rest-group-logo.png" alt="REST Group" width={28} height={28} className="rounded-lg" />
                <span className="text-sm font-semibold tracking-tight text-stone-700">
                  Course Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                <Trophy size={40} weight="fill" className="text-emerald-500" />
              </div>
            </motion.div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-5">
              Course Complete
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-stone-900 mb-2">
              Congratulations, {userName}
            </h1>
            <p className="text-stone-400 text-base leading-relaxed max-w-[50ch] mx-auto">
              You have successfully completed the SlideSure Waterslide Assurance
              & Competency System and earned your certification.
            </p>
          </motion.div>

          {/* Section A: Certificate + PDF Download */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="card-shell">
              <div className="card-core p-2">
                {/* Certificate Preview */}
                <div ref={certRef} className="rounded-[calc(1.25rem-2px)] bg-white p-8 md:p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Certificate size={30} weight="duotone" className="text-[var(--accent)]" />
                    </div>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-2 font-medium">
                    Certificate of Competency
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-stone-900 mb-1">
                    Slide<span className="text-[var(--cta)]">Sure</span>
                  </h2>
                  <p className="text-sm text-stone-400 mb-8">
                    Waterslide Assurance &amp; Competency System
                  </p>
                  <div className="border-t border-b border-stone-100 py-7 mb-7">
                    <p className="text-[11px] text-stone-400 mb-1 uppercase tracking-wider">
                      This certifies that
                    </p>
                    <p className="text-2xl font-bold tracking-tight text-stone-900">{userName}</p>
                    <p className="text-sm text-stone-400 mt-3 max-w-[45ch] mx-auto leading-relaxed">
                      has successfully completed the SlideSure Waterslide Assurance
                      &amp; Competency program and demonstrated competency in operational
                      safety, defect recognition, and incident prevention.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Score</p>
                      <p className="text-lg font-bold font-mono text-stone-800">
                        {score}/{total}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm font-semibold text-stone-800">{certDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Status</p>
                      <p className="text-sm font-semibold text-emerald-600">Passed</p>
                    </div>
                  </div>
                  {certId && (
                    <p className="text-[11px] text-stone-400 mt-6 font-mono">
                      Verification ID: {certId}
                    </p>
                  )}
                  <p className="text-[10px] text-stone-300 mt-2 leading-relaxed">
                    A REST Group product. Standards-aligned waterslide operator training.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="group mt-4 w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[var(--accent)] text-white font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--accent-dark)] active:scale-[0.97] shadow-[0_4px_16px_rgba(11,58,102,0.2)] disabled:opacity-60"
            >
              <DownloadSimple size={18} weight="bold" />
              {downloadingPdf ? "Generating PDF..." : "Download PDF Certificate"}
            </button>
          </motion.div>

          {/* Verification Link */}
          {certId && (
            <motion.div variants={fadeUp} className="mb-8">
              <div className="card-shell" style={{ background: "rgba(4, 120, 87, 0.03)", borderColor: "rgba(4, 120, 87, 0.08)" }}>
                <div className="card-core p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle size={20} weight="fill" className="text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800 mb-0.5">Verification Link</p>
                      <p className="text-xs text-stone-400">Share this link with employers to verify your certificate</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-stone-200/60 text-xs font-mono text-stone-600 truncate">
                      {typeof window !== "undefined" ? `${window.location.origin}/verify/${certId}` : `/verify/${certId}`}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/verify/${certId}`);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 active:scale-[0.97] transition-all duration-300 shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section B: Social Sharing Tile */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="card-shell">
              <div className="card-core p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <ShareNetwork size={20} weight="duotone" className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-stone-800">
                      Social Sharing Tile
                    </h3>
                    <p className="text-sm text-stone-400">
                      Download and share on LinkedIn, socials, or your portfolio
                    </p>
                  </div>
                </div>

                {/* Tile Preview (scaled down for display) */}
                <div className="rounded-2xl overflow-hidden border border-stone-200/60 mb-4">
                  <div style={{ aspectRatio: "1200/630" }} className="relative">
                    <div
                      ref={tileRef}
                      style={{
                        width: 1200,
                        height: 630,
                        transform: "scale(var(--tile-scale))",
                        transformOrigin: "top left",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        background: "linear-gradient(135deg, #0B3A66 0%, #0a2d4f 60%, #091f36 100%)",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                      className="[--tile-scale:calc(100cqw/1200)]"
                    >
                      {/* Decorative elements */}
                      <div
                        style={{
                          position: "absolute",
                          top: -80,
                          right: -80,
                          width: 300,
                          height: 300,
                          borderRadius: "50%",
                          background: "rgba(240, 90, 40, 0.08)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: -60,
                          left: -60,
                          width: 200,
                          height: 200,
                          borderRadius: "50%",
                          background: "rgba(31, 122, 140, 0.06)",
                        }}
                      />

                      {/* Content */}
                      <div style={{ position: "relative", padding: "60px 80px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        {/* Top row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                              width: 48,
                              height: 48,
                              borderRadius: 12,
                              background: "rgba(255,255,255,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                              <Certificate size={26} weight="duotone" color="#F05A28" />
                            </div>
                            <div>
                              <p style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", margin: 0 }}>
                                Slide<span style={{ color: "#F05A28" }}>Sure</span>
                              </p>
                              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
                                REST Group
                              </p>
                            </div>
                          </div>
                          <div style={{
                            padding: "8px 20px",
                            borderRadius: 100,
                            background: "rgba(4, 120, 87, 0.15)",
                            border: "1px solid rgba(4, 120, 87, 0.25)",
                          }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#34d399", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                              Certified
                            </p>
                          </div>
                        </div>

                        {/* Center */}
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
                            Certified Waterslide Operator
                          </p>
                          <p style={{ fontSize: 48, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: 8 }}>
                            {userName}
                          </p>
                          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto" }}>
                            Waterslide Assurance & Competency System
                          </p>
                        </div>

                        {/* Bottom row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                            {certDate}
                          </p>
                          <div style={{ display: "flex", gap: 24 }}>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Score</p>
                              <p style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", fontFamily: "monospace" }}>{score}/{total}</p>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Status</p>
                              <p style={{ fontSize: 18, fontWeight: 700, color: "#34d399" }}>Passed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadTile}
                  disabled={downloadingTile}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.97] transition-all duration-300 disabled:opacity-60"
                >
                  <DownloadSimple size={16} weight="bold" />
                  {downloadingTile ? "Generating Image..." : "Download Social Tile"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Section C: LinkedIn Post Script */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="card-shell">
              <div className="card-core p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--accent)]">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-stone-800">
                      LinkedIn Post
                    </h3>
                    <p className="text-sm text-stone-400">
                      Share your achievement with your professional network
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-stone-50 border border-stone-200/60 p-5 mb-4">
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                    {LINKEDIN_POST}
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(LINKEDIN_POST)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] active:scale-[0.97] transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Share on LinkedIn
                    <ArrowSquareOut size={14} weight="bold" />
                  </a>
                  <button
                    onClick={handleCopy}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
                  >
                    {copied ? (
                      <>
                        <Check size={16} weight="bold" className="text-emerald-600" />
                        <span className="text-emerald-600">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} weight="bold" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back to Training */}
          <motion.div variants={fadeUp} className="text-center">
            <Link
              href="/train"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-0.5 transition-transform duration-300"
              />
              Back to Training
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Hidden: Social tile at full resolution for capture (container query scaling won't work with html2canvas) */}
      <style>{`
        @supports (container-type: inline-size) {
          .tile-preview-wrapper { container-type: inline-size; }
        }
      `}</style>
    </div>
  );
}
