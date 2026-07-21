import { ArrowRight } from "lucide-react"
import SectionLabel from "./SectionLabel"
import InkPill from "./InkPill"

// ════════════════════════════════════════════════════
// PRE-FOOTER CTA BAND
// Light: #f5f5f5 canvas + lavender/peach orb
// Dark : #0f0f13 + vivid orb at full opacity
//        + teal-accented secondary CTA
// ════════════════════════════════════════════════════
const CtaBandSection = () => (
  <section
    className="relative overflow-hidden bg-[#f5f5f5] dark:bg-[#0f0f13]"
    aria-labelledby="cta-heading"
    style={{ paddingBlock: "96px" }}
  >
    {/* Atmospheric orb — vivid in dark */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        className="h-[460px] w-[640px] opacity-45 dark:opacity-65"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 40% 50%, #c8b8e0 0%, transparent 55%)," +
            "radial-gradient(ellipse 50% 50% at 65% 50%, #e8b8c4 0%, transparent 50%)," +
            "radial-gradient(ellipse 35% 40% at 50% 80%, #a7e5d3 0%, transparent 55%)",
          filter: "blur(44px)",
        }}
      />
    </div>

    <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
      <SectionLabel>Get started</SectionLabel>
      <h2
        id="cta-heading"
        className="mb-5 max-w-xl text-[#0c0a09] dark:text-white"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "clamp(28px, 3vw, 40px)",
          fontWeight: 300,
          lineHeight: 1.17,
          letterSpacing: "-0.36px",
          textWrap: "balance",
        } as React.CSSProperties}
      >
        Ready to take care of your health?
      </h2>
      <p
        className="mb-10 max-w-md text-[16px] leading-[1.6] text-[#4e4e4e] dark:text-[#94a3b8]"
        style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.1px" }}
      >
        Join thousands of patients already managing their health with
        ClinicBook — for free.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <InkPill to="/auth/signup">
          Sign Up for Free
          <ArrowRight size={15} aria-hidden="true" />
        </InkPill>
        <InkPill to="/book-token" outline>
          Book without account
        </InkPill>
      </div>
    </div>
  </section>
)

export default CtaBandSection
