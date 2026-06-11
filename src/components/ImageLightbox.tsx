"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MagnifyingGlassPlus, X } from "@phosphor-icons/react";

/**
 * A lesson image that opens into a fullscreen lightbox on click/tap.
 * Defect macros are shot to be studied closely — the inline 720px column can't
 * do them justice, so the frame zooms to the whole viewport with the caption
 * pinned underneath. Closes on backdrop click, the X button, or Escape.
 */
export function ZoomableImage({
  src,
  alt,
  ratioClass,
  caption,
}: {
  src: string;
  alt: string;
  ratioClass: string;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes; page scroll is locked while the lightbox is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${alt}`}
        className={`group/zoom relative block w-full ${ratioClass} overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/60 cursor-zoom-in`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/zoom:scale-[1.025]"
        />
        {/* Enlarge affordance — quiet until hover, always present on touch */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-stone-900/55 backdrop-blur-sm text-white text-[10px] font-medium opacity-70 md:opacity-0 md:group-hover/zoom:opacity-100 transition-opacity duration-300">
          <MagnifyingGlassPlus size={12} weight="bold" />
          <span className="hidden sm:inline">Enlarge</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" />
            <motion.figure
              initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70dvh] md:h-[78dvh]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs text-stone-300 leading-relaxed max-w-[70ch] mx-auto">
                {caption ?? alt}
              </figcaption>
              <button
                type="button"
                onClick={close}
                aria-label="Close image"
                className="absolute -top-2 right-0 md:-right-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors duration-300"
              >
                <X size={16} weight="bold" />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
