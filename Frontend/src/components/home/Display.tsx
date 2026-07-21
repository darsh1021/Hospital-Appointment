// ── Display headline ──
// Design tokens: display-mega (64px/300), display-xl (48px), display-lg (36px),
//                display-md (32px), display-sm (24px) — all EB Garamond weight 300
const Display = ({
  size = "mega",
  children,
  className = "",
}: {
  size?: "mega" | "xl" | "lg" | "md" | "sm"
  children: React.ReactNode
  className?: string
}) => {
  const styles: Record<string, React.CSSProperties> = {
    mega: { fontSize: "64px", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-1.92px" },
    xl:   { fontSize: "48px", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.96px" },
    lg:   { fontSize: "36px", fontWeight: 300, lineHeight: 1.17, letterSpacing: "-0.36px" },
    md:   { fontSize: "32px", fontWeight: 300, lineHeight: 1.13, letterSpacing: "-0.32px" },
    sm:   { fontSize: "24px", fontWeight: 300, lineHeight: 1.2,  letterSpacing: "0" },
  }
  return (
    <div
      className={`text-[#0c0a09] dark:text-white ${className}`}
      style={{ fontFamily: "'EB Garamond', 'Times New Roman', serif", ...styles[size] }}
    >
      {children}
    </div>
  )
}

export default Display
