"use client";

import { useEffect, useState } from "react";
import { GuillocheBackdrop, FoilSeal, ModuleMedals } from "@/components/CertificateArtwork";

/**
 * Dev-only visual preview of the certificate with sample data, so the design
 * can be checked without earning a certification. Mirrors the markup in
 * /train/certified exactly - keep the two in sync when restyling.
 */
export default function CertificatePreviewPage() {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    import("qrcode")
      .then((mod) =>
        mod.toDataURL("https://restgroup.com.au/verify/SS-PREVIEW-0000", {
          margin: 1,
          width: 240,
          color: { dark: "#0B3A66", light: "#ffffff" },
        })
      )
      .then(setQrDataUrl)
      .catch(() => {});
  }, []);

  const userName = "Jordan Rivers";
  const certDate = "11 June 2026";
  const certId = "SS-2026-4F8A2C";
  const finalPct = 95;

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-xs text-stone-400 mb-4 font-mono">
          /dev/certificate - preview with sample data
        </p>
        <div className="card-shell">
          <div className="card-core p-2">
            <div
              className="relative overflow-hidden rounded-[calc(1.25rem-2px)] p-8 md:p-12 text-center"
              style={{ background: "linear-gradient(165deg, #ffffff 0%, #fbf8f1 100%)" }}
            >
              <GuillocheBackdrop />
              <img
                src="/rest-group-logo.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
              />
              <div className="relative z-10">
                <div className="flex justify-center mb-5">
                  <img src="/rest-group-logo.png" alt="REST Group" width={64} height={64} className="rounded-2xl" />
                </div>
                <p
                  className="text-[10px] uppercase tracking-[0.34em] mb-2.5 font-semibold"
                  style={{ color: "#C9A13B" }}
                >
                  Certificate of Competency
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-stone-900 mb-1">
                  Slide<span className="text-[var(--cta)]">Sure</span>
                </h2>
                <p className="text-sm text-stone-400 mb-7">
                  Waterslide Assurance &amp; Competency System
                </p>

                <div
                  className="py-7 mb-6"
                  style={{
                    borderTop: "1px solid rgba(201,161,59,0.35)",
                    borderBottom: "1px solid rgba(201,161,59,0.35)",
                  }}
                >
                  <p className="text-[11px] text-stone-400 mb-2 uppercase tracking-[0.22em]">
                    This certifies that
                  </p>
                  <p className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight">
                    {userName}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3.5 mb-3" aria-hidden>
                    <span className="block w-10 border-t" style={{ borderColor: "rgba(201,161,59,0.5)" }} />
                    <span className="block w-1.5 h-1.5 rotate-45" style={{ background: "#C9A13B" }} />
                    <span className="block w-10 border-t" style={{ borderColor: "rgba(201,161,59,0.5)" }} />
                  </div>
                  <p className="text-sm text-stone-500 max-w-[48ch] mx-auto leading-relaxed">
                    has successfully completed the SlideSure Waterslide Assurance
                    &amp; Competency program and demonstrated competency in operational
                    safety, defect recognition, and incident prevention.
                  </p>
                </div>

                <div className="mb-7">
                  <ModuleMedals size={38} />
                  <p className="text-[9px] uppercase tracking-[0.22em] text-stone-400 mt-2.5">
                    All nine competency modules passed
                  </p>
                </div>

                <div className="flex items-start justify-center gap-8 flex-wrap">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Date</p>
                    <p className="text-sm font-semibold text-stone-800">{certDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">
                      Final Assessment
                    </p>
                    <p className="text-sm font-semibold text-stone-800">{finalPct}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-semibold text-emerald-600">Passed</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">
                      Certificate ID
                    </p>
                    <p className="text-xs font-mono font-semibold text-stone-700">{certId}</p>
                  </div>
                </div>

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
      </div>
    </div>
  );
}
