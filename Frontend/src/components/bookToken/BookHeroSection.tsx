import AppointmentSummaryCard from "./AppointmentSummaryCard"
import { ArrowRight, PersonStanding } from "lucide-react"

// ════════════════════════════════════════════════════
// BOOK TOKEN — HERO SECTION
// Left: badge + headline + subhead + micro-stat pills
// Right: animated live-queue widget
// Light: white bg · Dark: #0a0a0f deep base
// ════════════════════════════════════════════════════
const BookHeroSection = () => (
  <section
    className="relative overflow-hidden bg-white dark:bg-[#0a0a0f]"
    aria-labelledby="book-hero-heading"
  >
    {/* Subtle gradient wash — visible in dark only */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden dark:block"
      style={{
        background:
          "radial-gradient(ellipse 55% 60% at 75% 50%, rgba(110,231,183,0.05) 0%, transparent 65%)," +
          "radial-gradient(ellipse 40% 50% at 20% 30%, rgba(168,200,232,0.04) 0%, transparent 60%)",
      }}
    />

    <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:py-10">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        {/* ── Left: copy ── */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] dark:border-[rgba(110,231,183,0.20)] bg-[#f9fafb] dark:bg-[rgba(110,231,183,0.06)] px-3 py-1.5">
          <span className="size-1.5 rounded-full bg-[#6ee7b7] animate-pulse" aria-hidden="true" />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.9px] text-[#3f3f46] dark:text-[#6ee7b7]"
          >
            Online booking · No waiting room
          </span>
          </div>

          {/* Headline */}
          <h1
          id="book-hero-heading"
          className="mb-5 text-[#171717] dark:text-white"
          style={{
            fontSize: "clamp(36px, 4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-2px",
            textWrap: "balance",
          } as React.CSSProperties}
          >
          Book your appointment.
          </h1>

          {/* Subhead */}
          <p
          className="mb-8 max-w-md text-[17px] leading-[1.65] text-[#4d4d4d] dark:text-[#94a3b8]"
          >
          No phone calls, no waiting. Book a slot online, get your token,
          and walk in exactly when it's your turn.
          </p>

          {/* Micro-stat pills */}
          <div className="flex flex-wrap gap-3 mb-10">
          {[
            { value: "< 60 s", label: "to book" },
            { value: "80+",    label: "doctors" },
            { value: "24/7",   label: "available" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.08)] bg-[#fafafa] dark:bg-[rgba(255,255,255,0.04)] px-3.5 py-2"
            >
              <span
                className="text-[15px] font-bold text-[#171717] dark:text-white"
              >
                {s.value}
              </span>
              <span
                className="text-[12px] text-[#888] dark:text-[#64748b]"
              >
                {s.label}
              </span>
            </div>
          ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => {
                const form = document.getElementById("booking-form");
                form?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 rounded-2xl border border-emerald-600 bg-transparent px-6 py-3.5 text-[15px] font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/10 active:scale-95"
            >
              Get Your Token Now
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => {
                const form = document.getElementById("how-it-works");
                form?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-zinc-900 dark:text-white transition-all hover:bg-zinc-50 dark:hover:bg-white/10 active:scale-95"
            >
              <PersonStanding size={19} />
              How it work
            </button>
          </div>
        </div>

        {/* ── Right: animated queue widget ── */}
        <div className="flex justify-center lg:justify-end">
          <AppointmentSummaryCard />
        </div>
      </div>
    </div>
  </section>
)

export default BookHeroSection
