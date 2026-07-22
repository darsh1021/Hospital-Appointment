import { steps } from "./bookTokenData"

// ════════════════════════════════════════════════════
// HOW IT WORKS — 4-step process grid
// Light: #fafafa section + white cards
// Dark : #0f0f15 section + #1a1a24 cards + step number
//        as teal label + icon with ring badge
// ════════════════════════════════════════════════════
const BookHowItWorks = () => (
  <section
    className="bg-[#fafafa] dark:bg-[#0f0f15]"
    aria-labelledby="how-it-works-heading"
    style={{ paddingBlock: "80px" }}
  >
    <div className="mx-auto max-w-[1280px] px-6">
      {/* Section header */}
      <div className="mb-12">
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[1.1px] text-[#888] dark:text-[#6ee7b7]"
        >
          Process
        </p>
        <h2
          id="how-it-works-heading"
          className="text-[28px] font-bold leading-[1.15] tracking-[-1.2px] text-[#171717] dark:text-white"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          How it works.
        </h2>
      </div>

      {/* Steps grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, idx) => {
          const Icon = s.icon
          const isLast = idx === steps.length - 1
          return (
            <div key={s.step} className="relative">
              {/* Connector line (desktop only) */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-[22px] hidden h-px w-4 translate-x-full bg-[#e5e7eb] dark:bg-[rgba(255,255,255,0.07)] lg:block"
                />
              )}

              <div className="group h-full rounded-[12px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1a1a24] p-6 transition-all duration-300 hover:border-[#d1d5db] dark:hover:border-[rgba(110,231,183,0.18)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                {/* Step counter */}
                <p
                  className="mb-4 text-[11px] font-semibold uppercase tracking-[1.1px] text-[#b0b0b0] dark:text-[#6ee7b7]"
                >
                  {s.step}
                </p>

                {/* Icon badge */}
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-[10px] bg-[#f4f4f5] dark:bg-[rgba(255,255,255,0.06)] ring-1 ring-[#e5e7eb] dark:ring-[rgba(255,255,255,0.09)] transition-all duration-300 group-hover:ring-[rgba(110,231,183,0.25)] dark:group-hover:bg-[rgba(110,231,183,0.08)]">
                  <Icon
                    size={18}
                    className="text-[#3f3f46] dark:text-[#e2e8f0] transition-colors duration-300 group-hover:text-[#171717] dark:group-hover:text-[#6ee7b7]"
                    aria-hidden="true"
                  />
                </div>

                <h3
                  className="mb-2 text-[15px] font-semibold leading-snug tracking-[-0.3px] text-[#171717] dark:text-white"
                >
                  {s.title}
                </h3>
                <p
                  className="text-[13px] leading-[1.6] text-[#5a5a5a] dark:text-[#94a3b8]"
                >
                  {s.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

export default BookHowItWorks
