import { ArrowRight } from "lucide-react"
import InkPill from "./InkPill"

// ════════════════════════════════════════════════════
// HERO BAND
// Light: #f5f5f5 canvas + pastel atmospheric orb
// Dark : #0f0f13 deep base + vivid orb at 70% opacity
//        + subtle noise-like radial ring for depth
// ════════════════════════════════════════════════════
const HeroSection = () => (
  <section
    className="relative overflow-hidden bg-[#f5f5f5] dark:bg-[#0f0f13]"
    aria-labelledby="hero-heading"
    style={{ paddingBlock: "96px" }}
  >
    {/* ── Atmospheric orb layer ── */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {/* Main pastel bloom */}
      <div
        className="h-150 w-200 opacity-55 dark:opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 40% 50%, #a7e5d3 0%, transparent 55%)," +
            "radial-gradient(ellipse 50% 50% at 65% 40%, #c8b8e0 0%, transparent 50%)," +
            "radial-gradient(ellipse 45% 45% at 30% 65%, #f4c5a8 0%, transparent 50%)," +
            "radial-gradient(ellipse 40% 40% at 70% 70%, #a8c8e8 0%, transparent 50%)",
          filter: "blur(40px)",
        }}
      />
    </div>
    {/* Dark-only: sharp inner ring for depth */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden dark:block"
      style={{
        background:
          "radial-gradient(ellipse 30% 30% at 50% 50%, rgba(110,231,183,0.06) 0%, transparent 70%)",
      }}
    />

    <div className="relative mx-auto flex max-w-300 flex-col items-center px-6 text-center">
      {/* Badge pill */}
      <span
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e7e5e4] dark:border-[rgba(110,231,183,0.25)] bg-[#f0efed] dark:bg-[rgba(110,231,183,0.08)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-[#292524] dark:text-[#6ee7b7]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <span className="size-1.5 rounded-full bg-[#6ee7b7] dark:bg-[#6ee7b7] animate-pulse" aria-hidden="true" />
        Now open for registration
      </span>

      {/* Hero headline */}
      <h1
        id="hero-heading"
        className="mx-auto max-w-205 text-[#0c0a09] dark:text-white"
        style={{
          fontFamily: "'EB Garamond', 'Times New Roman', serif",
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 300,
          lineHeight: 1.05,
          letterSpacing: "-1.92px",
          textWrap: "balance",
        } as React.CSSProperties}
      >
        Healthcare made simple.
      </h1>

      {/* Subhead */}
      <p
        className="mx-auto mt-6 max-w-135 text-[16px] leading-[1.6] text-[#4e4e4e] dark:text-[#94a3b8]"
        style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.16px" }}
      >
        Book doctor appointments, follow live queues, and manage your
        prescriptions — all in one calm, modern platform built for patients
        and providers.
      </p>

      {/* CTA row */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <InkPill to="/book-token">
          Book Appointment
          <ArrowRight size={15} aria-hidden="true" />
        </InkPill>
        <InkPill to="/doctors" outline>
          Meet Our Doctors
        </InkPill>
      </div>
    </div>
  </section>
)

export default HeroSection
