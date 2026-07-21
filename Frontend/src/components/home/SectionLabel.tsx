// ── Shared section-label (caption-uppercase) ──
// Light: muted warm gray · Dark: vivid teal-mint accent
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[1.1px] text-[#777169] dark:text-[#6ee7b7]"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    <span className="inline-block h-px w-4 bg-[#d6d3d1] dark:bg-[#6ee7b7] opacity-70" aria-hidden="true" />
    {children}
  </p>
)

export default SectionLabel
