import SectionLabel from "./SectionLabel"
import { orbCards } from "./homeData"

// ════════════════════════════════════════════════════
// GRADIENT-ORB CARD BAND
// Light: #f5f5f5 canvas + fafafa cards
// Dark : #0f0f13 base + #1a1a24 cards with vivid orbs
//        at full opacity + strong border + glow hover
// ════════════════════════════════════════════════════
const OrbCardsSection = () => (
  <section
    className="bg-[#f5f5f5] dark:bg-[#0f0f13]"
    aria-labelledby="orb-cards-heading"
    style={{ paddingBlock: "96px" }}
  >
    <div className="mx-auto max-w-[1200px] px-6">
      <SectionLabel>What we offer</SectionLabel>
      <h2
        id="orb-cards-heading"
        className="mb-12 max-w-xl text-[#0c0a09] dark:text-white"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "clamp(28px, 3vw, 36px)",
          fontWeight: 300,
          lineHeight: 1.17,
          letterSpacing: "-0.36px",
          textWrap: "balance",
        } as React.CSSProperties}
      >
        Everything you need, nothing you don't.
      </h2>

      <div className="grid gap-5 sm:grid-cols-3">
        {orbCards.map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-[20px] border border-[#e7e5e4] dark:border-[rgba(255,255,255,0.10)] bg-[#fafafa] dark:bg-[#1a1a24] p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:hover:border-[rgba(110,231,183,0.22)] dark:hover:shadow-[0_8px_40px_rgba(110,231,183,0.06)]"
          >
            {/* Atmospheric orb — vivid in dark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-35 dark:opacity-60 transition-opacity duration-300 group-hover:opacity-50 dark:group-hover:opacity-80"
              style={{ background: card.orb, filter: "blur(24px)" }}
            />

            <div className="relative">
              <span
                className="mb-5 inline-block text-[11px] font-semibold uppercase tracking-[1.1px] text-[#777169] dark:text-[#6ee7b7]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {card.label}
              </span>
              <h3
                className="mb-3 text-[#0c0a09] dark:text-white"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "24px",
                  fontWeight: 300,
                  lineHeight: 1.2,
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-[15px] leading-[1.6] text-[#5a5a5a] dark:text-[#94a3b8]"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.1px" }}
              >
                {card.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default OrbCardsSection
