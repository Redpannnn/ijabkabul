"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://the.invisimple.id/wp-content/uploads/2026/03/BG-ALL-PAGE-TEMA-2-.jpg";

// Foto galeri Our Moment — preview besar di atas + thumbnail 1 baris di bawah.
// Klik thumbnail → tampil di preview besar. Tombol panah prev/next di preview
// besar buat mundur/lanjut (wrap-around, dari foto terakhir lanjut ke pertama).
// Catatan: DSC_0232 di-list 2x, diambil 1x aja biar nggak dobel di galeri.
const RAW_PHOTOS = [
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

// Versi ringan via transformasi ImageKit (?tr=) biar loading cepat —
// gambar & framing-nya sama persis, cuma di-resize. Hapus "?tr=..." kalau
// mau pakai file asli full-size.
const previewSrc = (src: string) => `${src}?tr=w-900,q-80`;
const thumbSrc = (src: string) => `${src}?tr=w-160,q-70`;

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

  // index foto yang lagi tampil di preview besar
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const thumbsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const total = RAW_PHOTOS.length;
  const goPrev = () => setActive((v) => (v - 1 + total) % total);
  const goNext = () => setActive((v) => (v + 1) % total);

  // Thumbnail aktif digeser ke tengah strip (scroll HORIZONTAL doang).
  // PENTING: jangan pakai scrollIntoView di sini — scrollIntoView ikut
  // men-scroll SEMUA ancestor, termasuk window/page, sehingga pas undangan
  // dibuka halaman langsung lompat/smooth-scroll ke slide 5.
  // Solusi: hitung posisi thumb aktif manual, lalu scroll strip-nya aja.
  useEffect(() => {
    const strip = stripRef.current;
    const el = thumbsRef.current[active];
    if (!strip || !el) return;
    const stripRect = strip.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    // Selisih antara titik-tengah thumb aktif dan titik-tengah strip (viewport).
    const delta =
      elRect.left + elRect.width / 2 - (stripRect.left + strip.clientWidth / 2);
    // `top: strip.scrollTop` eksplisit biar posisi vertikal strip tidak berubah.
    strip.scrollTo({
      left: strip.scrollLeft + delta,
      top: strip.scrollTop,
      behavior: "smooth",
    });
  }, [active]);

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

        {/* ───── Preview besar ───── */}
        <motion.div
          variants={item}
          className="relative w-full"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/40 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/30">
            <AnimatePresence mode="sync">
              <motion.img
                key={active}
                src={previewSrc(RAW_PHOTOS[active])}
                alt={`Foto galeri pernikahan ${active + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>

            {/* Tombol prev — kiri preview besar */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto sebelumnya"
              className="absolute left-2.5 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#544c39] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Tombol next — kanan preview besar */}
            <button
              type="button"
              onClick={goNext}
              aria-label="Foto berikutnya"
              className="absolute right-2.5 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#544c39] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </motion.div>

        {/* ───── Thumbnail — 1 baris, scroll horizontal ───── */}
        <motion.div variants={item} className="mt-3 w-full">
          <div
            ref={stripRef}
            className="flex w-full gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {RAW_PHOTOS.map((src, i) => (
              <button
                key={src}
                ref={(el) => {
                  thumbsRef.current[i] = el;
                }}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Lihat foto ${i + 1}`}
                aria-current={i === active}
                className={`relative h-[4.25rem] w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ${
                  i === active
                    ? "opacity-100 ring-2 ring-[#f2cc6d]"
                    : "opacity-55 ring-1 ring-white/30 hover:opacity-90"
                }`}
              >
                <img
                  src={thumbSrc(src)}
                  alt={`Thumbnail foto ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
