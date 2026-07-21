import { NavLink } from "react-router-dom"
import { Stethoscope } from "lucide-react"

// ──────────────────────────────────────────────
// Footer column data
// ──────────────────────────────────────────────
const columns: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Book Appointment", to: "/book-token" },
      { label: "Find a Doctor", to: "/doctors" },
      { label: "Treatments", to: "/treatments" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log In", to: "/auth/login" },
      { label: "Sign Up", to: "/auth/signup" },
      { label: "Forgot Password", to: "/auth/forgot-password" },
    ],
  },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="site-footer"
      className="border-t border-[#ebebeb] bg-white dark:border-white/10 dark:bg-[#0a0a0a]"
      role="contentinfo"
    >
      {/* ── Top section: logo + columns ── */}
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <NavLink
              to="/"
              className="mb-3 inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:rounded-md dark:focus-visible:ring-white"
              aria-label="ClinicBook home"
            >
              <span className="flex size-7 items-center justify-center rounded-[6px] bg-[#171717] text-white dark:bg-white dark:text-[#171717]">
                <Stethoscope size={14} aria-hidden="true" />
              </span>
              <span className="font-[Geist,Inter,system-ui] text-[14px] font-semibold tracking-[-0.28px] text-[#171717] dark:text-white">
                ClinicBook
              </span>
            </NavLink>
            <p className="max-w-[200px] text-[13px] leading-5 text-[#888888]">
              Modern hospital appointment management for patients and providers.
            </p>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              {/* Mono eyebrow */}
              <h2 className="mb-3 font-mono text-[11px] font-normal uppercase leading-4 tracking-wide text-[#888888]">
                {col.heading}
              </h2>
              <ul className="flex flex-col gap-2" role="list">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="text-[13px] leading-5 tracking-[-0.28px] text-[#4d4d4d] transition-colors hover:text-[#171717] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#171717] dark:text-[#888888] dark:hover:text-white dark:focus-visible:ring-white"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div className="border-t border-[#ebebeb] dark:border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
          <p className="text-[12px] leading-4 text-[#888888]">
            © {currentYear} ClinicBook. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <NavLink
              to="/privacy"
              className="text-[12px] leading-4 text-[#888888] transition-colors hover:text-[#171717] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#171717] dark:hover:text-white dark:focus-visible:ring-white"
            >
              Privacy
            </NavLink>
            <NavLink
              to="/terms"
              className="text-[12px] leading-4 text-[#888888] transition-colors hover:text-[#171717] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#171717] dark:hover:text-white dark:focus-visible:ring-white"
            >
              Terms
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
