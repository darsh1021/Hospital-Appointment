import { Star } from "lucide-react"
import SectionLabel from "./SectionLabel"
import { testimonials } from "./homeData"

// ════════════════════════════════════════════════════
// TESTIMONIALS — alternating surface
// Light: #fafafa + white cards
// Dark : #16161c + #1e1e2a cards + amber stars
//        + author name in full white
// ════════════════════════════════════════════════════
const TestimonialsSection = () => (
  <section
    className="bg-[#fafafa] dark:bg-[#16161c]"
    aria-labelledby="testimonials-heading"
    style={{ paddingBlock: "96px" }}
  >
    <div className="mx-auto max-w-[1200px] px-6">
      <div className="mb-14 text-center">
        <SectionLabel>What people say</SectionLabel>
        <h2
          id="testimonials-heading"
          className="mx-auto max-w-lg text-[#0c0a09] dark:text-white"
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 300,
            lineHeight: 1.17,
            letterSpacing: "-0.36px",
            textWrap: "balance",
          } as React.CSSProperties}
        >
          Patients and providers love it.
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote
            key={t.name}
            className="group flex flex-col rounded-[16px] border border-[#e7e5e4] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1e1e2a] p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:hover:border-[rgba(255,255,255,0.14)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {/* Stars */}
            <div className="mb-5 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className="fill-[#fbbf24] text-[#fbbf24]"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p
              className="flex-1 text-[15px] leading-[1.65] text-[#5a5a5a] dark:text-[#94a3b8]"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.1px" }}
            >
              "{t.quote}"
            </p>
            <footer className="mt-6 flex items-center gap-3">
              {/* Avatar placeholder */}
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0efed] dark:bg-[rgba(255,255,255,0.07)] ring-1 ring-[#e7e5e4] dark:ring-[rgba(255,255,255,0.10)]">
                <span
                  className="text-[13px] font-semibold text-[#292524] dark:text-[#e2e8f0]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t.name.charAt(0)}
                </span>
              </div>
              <cite className="not-italic">
                <p
                  className="text-[14px] font-semibold text-[#292524] dark:text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-[12px] text-[#777169] dark:text-[#64748b]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t.role}
                </p>
              </cite>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
)

export default TestimonialsSection
