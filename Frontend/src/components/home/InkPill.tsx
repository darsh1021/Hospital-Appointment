import { NavLink } from "react-router-dom"

// ── InkPill button ──
// Light → button-primary: black fill · button-secondary: white + hairline border
// Dark  → primary: white fill/dark text · secondary: subtle border + hover glow
const InkPill = ({
  to,
  children,
  outline = false,
}: {
  to: string
  children: React.ReactNode
  outline?: boolean
}) =>
  outline ? (
    <NavLink
      to={to}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d6d3d1] dark:border-[rgba(255,255,255,0.18)] px-5 text-[14px] font-medium leading-none text-[#0c0a09] dark:text-[#e2e8f0] transition-all hover:border-[#292524] dark:hover:border-[rgba(255,255,255,0.40)] hover:bg-[#f0efed] dark:hover:bg-[rgba(255,255,255,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292524] dark:focus-visible:ring-[#6ee7b7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f13]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </NavLink>
  ) : (
    <NavLink
      to={to}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#292524] dark:bg-white px-5 text-[14px] font-medium leading-none text-white dark:text-[#0f0f13] transition-all hover:bg-[#0c0a09] dark:hover:bg-[#e2e8f0] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292524] dark:focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f13]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </NavLink>
  )

export default InkPill
