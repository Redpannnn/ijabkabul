"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://the.invisimple.id/wp-content/uploads/2026/03/BG-ALL-PAGE-TEMA-2-.jpg";

// 9 foto Our Moment — konsep: preview besar (utama) + baris thumbnail.
// Klik thumbnail → foto tampil di preview besar. Panah prev/next di preview
// besar untuk maju/mundur (loop). Catatan: DSC_0232 di daftar dobel, diambil 1x.
const MOMENTS = [
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0284.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0282.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0280.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0281.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0260.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0265.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0226.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0232.JPG",
  "https://ik.imagekit.io/au8q7zdvt/FADHIL%20-%20MEILANY/DSC_0231.JPG",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide5() {
  const goTo = useInvitation((s) => s.goTo);

  // Index foto yang sedang tampil di preview besar.
  const [idx, setIdx] = useState(0);

  // Refs semua thumbnail — buat auto-scroll thumbnail aktif ke tengah baris.
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const prev = () =>
    setIdx((v) => (v - 1 + MOMENTS.length) % MOMENTS.length);
  const next = () => setIdx((v) => (v + 1) % MOMENTS.length);

  // Saat idx berubah (termasuk lewat panah), pastikan thumbnail aktif
  // terlihat di baris thumbnail (scroll horizontal halus, tanpa geser halaman).
  useEffect(() => {
    thumbRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [idx]);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — fixed (parallax) */}
      <motion.img
        src={BG_IMAGE}
        alt="Latar our moment"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        loading="eager"
      />
      {/* Bg solid overlay #7c0000 (80% opacity, no blur) — di slide 5 aja.
          position: absolute supaya scoped ke slide 5, nggak bocor ke slide lain. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[#7c0000]/80"
      />
      {/* Back button */}
      <button
        type="button"
        onClick={() => goTo("cover")}
        aria-label="Kembali ke cover"
        className="group absolute left-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/60 text-[#544c39] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:left-8 sm:top-8"
      >
        <svg className="size-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-[26rem] flex-col items-center px-6 py-20"
      >
        <motion.h2
          variants={item}
          className="font-wedding text-[2.6rem] leading-none text-white sm:text-[3.2rem]"
        >
          Our Moment
        </motion.h2>

        <span
          aria-hidden
          className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* ───── Preview besar ─────
            Foto aktif dengan crossfade. Panah prev/next di kiri-kanan (loop),
            badge counter posisi foto di pojok kanan bawah. */}
        <motion.div
          variants={item}
          className="relative w-full overflow-hidden rounded-2xl border border-white/70 shadow-[0_22px_55px_-15px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
        >
          <div className="relative aspect-[3/4] w-full">
            <AnimatePresence mode="sync">
              <motion.img
                key={idx}
                src={MOMENTS[idx]}
                alt={`Momen ${idx + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>
          </div>

          {/* Panah prev */}
          <button
            type="button"
            onClick={prev}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 sm:h-11 sm:w-11"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Panah next */}
          <button
            type="button"
            onClick={next}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 sm:h-11 sm:w-11"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Counter posisi foto */}
          <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[0.62rem] font-medium tracking-wider text-white backdrop-blur-sm">
            {idx + 1} / {MOMENTS.length}
          </span>
        </motion.div>

        {/* ───── Baris thumbnail (1 baris, scroll horizontal di layar kecil) ─────
            Klik thumbnail → foto muncul di preview besar. Thumbnail aktif
            di-highlight ring emas + opacity penuh. */}
        <div
          className="mt-4 flex w-full gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent"
          role="listbox"
          aria-label="Pilih foto galeri"
        >
          {MOMENTS.map((src, i) => (
            <motion.button
              key={src}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              variants={item}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Lihat foto ${i + 1}`}
              aria-selected={i === idx}
              className={`relative h-[4.25rem] w-[3.25rem] shrink-0 overflow-hidden rounded-lg transition-all duration-300 sm:h-[4.75rem] sm:w-[3.6rem] ${
                i === idx
                  ? "opacity-100 ring-2 ring-[#f2cc6d]"
                  : "opacity-50 ring-1 ring-white/25 hover:opacity-90"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail momen ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
