import { ArrowRight } from "lucide-react"
import SectionLabel from "./SectionLabel"
import InkPill from "./InkPill"
import { features } from "./homeData"

// ════════════════════════════════════════════════════
// FEATURE CARDS BAND — 3-up feature-card grid
// Light: #fafafa section + white cards + hairline
// Dark : #16161c section + #1e1e2a cards + vivid orb
//        + strong border + icon badge upgrade
// ════════════════════════════════════════════════════
const FeatureCardsSection = () => (
  <section
    className="bg-[#fafafa] dark:bg-[#16161c]"
    aria-labelledby="features-heading"
    style={{ paddingBlock: "96px" }}
  >
    <div className="mx-auto max-w-[1200px] px-6">
      <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel>Why ClinicBook</SectionLabel>
          <h2
            id="features-heading"
            className="max-w-lg text-[#0c0a09] dark:text-white"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 300,
              lineHeight: 1.17,
              letterSpacing: "-0.36px",
              textWrap: "balance",
            } as React.CSSProperties}
          >
            Built for patients. Loved by providers.
          </h2>
        </div>
        <div className="shrink-0">
          <InkPill to="/book-token">
            Start booking
            <ArrowRight size={15} aria-hidden="true" />
          </InkPill>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-[16px] border border-[#e7e5e4] dark:border-[rgba(255,255,255,0.09)] bg-white dark:bg-[#1e1e2a] p-6 transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] dark:hover:border-[rgba(255,255,255,0.16)] dark:hover:shadow-[0_6px_32px_rgba(0,0,0,0.4)]"
            >
              {/* Atmospheric orb — behind icon corner */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-4 h-36 w-36 opacity-30 dark:opacity-55 transition-opacity duration-300 group-hover:opacity-45 dark:group-hover:opacity-70"
                style={{ background: f.orb, filter: "blur(20px)" }}
              />
              <div className="relative">
                {/* Icon badge */}
                <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-[#f0efed] dark:bg-[rgba(255,255,255,0.07)] ring-1 ring-[#e7e5e4] dark:ring-[rgba(255,255,255,0.10)]">
                  <Icon size={18} className="text-[#292524] dark:text-[#e2e8f0]" aria-hidden="true" />
                </div>
                <h3
                  className="mb-2 text-[19px] text-[#0c0a09] dark:text-white"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    lineHeight: 1.35,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.6] text-[#5a5a5a] dark:text-[#94a3b8]"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.1px" }}
                >
                  {f.body}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

export default FeatureCardsSection
