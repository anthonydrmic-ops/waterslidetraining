"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  DownloadSimple,
  ArrowLeft,
  Copy,
  Check,
} from "@phosphor-icons/react";
import {
  defaultProgress,
  refreshProgress,
  type UserProgress,
} from "@/lib/progress-store";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CertifiedSkeleton } from "@/components/TrainSkeletons";
import { GuillocheBackdrop, FoilSeal } from "@/components/CertificateArtwork";

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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [certId, setCertId] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refreshProgress().then((p) => {
      if (!p.certified) {
        redirect("/train");
        return;
      }
      setProgress(p);
      setMounted(true);
      // Build the public verification URL so a LinkedIn share renders a rich
      // preview card (with the certificate's Open Graph image) rather than text only.
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://slidesure.com.au";
      const storedCertId =
        typeof window !== "undefined"
          ? localStorage.getItem("slidesure-cert-id")
          : null;
      setCertId(storedCertId);
      setShareUrl(storedCertId ? `${appUrl}/verify/${storedCertId}` : appUrl);
    });
  }, []);

  // Generate the verification QR code (points at the public /verify URL) once the
  // share URL is known. Loaded on demand to keep it out of the initial bundle.
  useEffect(() => {
    if (!shareUrl) return;
    let cancelled = false;
    import("qrcode")
      .then((mod) =>
        mod.toDataURL(shareUrl, {
          margin: 1,
          width: 240,
          color: { dark: "#0B3A66", light: "#ffffff" },
        })
      )
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        /* QR is decorative-with-purpose; if it fails the cert still renders */
      });
    return () => {
      cancelled = true;
    };
  }, [shareUrl]);

  const handleCopyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(LINKEDIN_POST);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, []);

  const userName = progress.userName || "Candidate";
  const certIssued = progress.certificationDate ? new Date(progress.certificationDate) : null;
  const certDate = certIssued
    ? certIssued.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Deep link into LinkedIn's "Add licence or certification" flow, pre-filled
  // with the credential details so a graduate can add it to their profile in
  // one tap (name, issuer, issue date, the verification URL, and cert ID).
  const linkedInAddUrl = (() => {
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: "SlideSure Waterslide Assurance & Competency",
      organizationName: "REST Group",
    });
    if (certIssued) {
      params.set("issueYear", String(certIssued.getFullYear()));
      params.set("issueMonth", String(certIssued.getMonth() + 1));
    }
    if (shareUrl) params.set("certUrl", shareUrl);
    if (certId) params.set("certId", certId);
    return `https://www.linkedin.com/profile/add?${params.toString()}`;
  })();
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

  if (!mounted) {
    return <CertifiedSkeleton />;
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
                <div
                  ref={certRef}
                  className="relative overflow-hidden rounded-[calc(1.25rem-2px)] bg-white p-8 md:p-12 text-center"
                >
                  <GuillocheBackdrop />

                  {/* Faint security-print watermark behind the content */}
                  <img
                    src="/rest-group-logo.png"
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
                  />

                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <img src="/rest-group-logo.png" alt="REST Group" width={72} height={72} className="rounded-2xl" />
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
                    <div className="flex items-start justify-center gap-8 flex-wrap">
                      <div>
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Date</p>
                        <p className="text-sm font-semibold text-stone-800">{certDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Status</p>
                        <p className="text-sm font-semibold text-emerald-600">Passed</p>
                      </div>
                      {certId && (
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">
                            Certificate ID
                          </p>
                          <p className="text-xs font-mono font-semibold text-stone-700">{certId}</p>
                        </div>
                      )}
                    </div>

                    {/* Signature · Foil seal · Verification QR */}
                    <div className="flex items-end justify-between gap-4 mt-9">
                      <div className="text-left">
                        <p className="font-serif italic text-lg text-stone-700 leading-none">
                          REST Group
                        </p>
                        <div className="w-32 border-t border-stone-300 mt-1.5 mb-1" />
                        <p className="text-[9px] uppercase tracking-wider text-stone-400">
                          Authorised Signatory
                        </p>
                      </div>

                      <FoilSeal size={72} />

                      <div className="flex flex-col items-center">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt="Scan to verify this certificate"
                            width={60}
                            height={60}
                            className="rounded-md border border-stone-100"
                          />
                        ) : (
                          <div className="w-[60px] h-[60px] rounded-md bg-stone-50 border border-stone-100" />
                        )}
                        <p className="text-[8px] uppercase tracking-wider text-stone-400 mt-1">
                          Scan to verify
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-400 mt-8 leading-relaxed">
                      A REST Group product. Standards-aligned waterslide operator training.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share on LinkedIn */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0A66C2] text-white font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-300 shadow-[0_4px_16px_rgba(10,102,194,0.25)]"
                title="Share your certification on LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
              </a>
              <button
                onClick={handleCopyCaption}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 active:scale-[0.97] transition-all duration-300"
                title="Copy a ready-made post caption"
              >
                {copied ? (
                  <>
                    <Check size={16} weight="bold" className="text-emerald-600" />
                    Caption copied
                  </>
                ) : (
                  <>
                    <Copy size={16} weight="bold" />
                    Copy post caption
                  </>
                )}
              </button>
            </div>

            {/* Add directly to a LinkedIn profile's Licenses & Certifications */}
            <a
              href={linkedInAddUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white border-2 border-[#0A66C2] text-[#0A66C2] font-medium hover:bg-[#0A66C2]/5 active:scale-[0.97] transition-all duration-300"
              title="Add this certification to your LinkedIn profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Add to LinkedIn profile
            </a>

            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="group mt-4 w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[var(--accent)] text-white font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--accent-dark)] active:scale-[0.97] shadow-[0_4px_16px_rgba(11,58,102,0.2)] disabled:opacity-60"
            >
              <DownloadSimple size={18} weight="bold" />
              {downloadingPdf ? "Generating PDF..." : "Download PDF Certificate"}
            </button>
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
    </div>
  );
}
