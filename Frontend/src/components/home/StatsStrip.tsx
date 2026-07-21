import { stats } from "./homeData"

// ════════════════════════════════════════════════════
// STATS STRIP — alternating band
// Light: #fafafa canvas-soft + hairline borders
// Dark : #16161c elevated surface + stronger dividers
//        + vivid teal accent on the stat values
// ════════════════════════════════════════════════════
const StatsStrip = () => (
  <section className="border-y border-[#e7e5e4] dark:border-[rgba(255,255,255,0.08)] bg-[#fafafa] dark:bg-[#16161c]">
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="relative">
            {/* Vertical divider for all but last (desktop) */}
            {i < stats.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute right-0 top-2 hidden h-10 w-px bg-[#e7e5e4] dark:bg-[rgba(255,255,255,0.08)] sm:block"
              />
            )}
            <dd
              className="text-[42px] text-[#0c0a09] dark:text-white"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              {s.value}
            </dd>
            <dt
              className="mt-1 text-[13px] text-[#777169] dark:text-[#64748b]"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.2px" }}
            >
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  </section>
)

export default StatsStrip
