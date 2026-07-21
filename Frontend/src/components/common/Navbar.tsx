import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X, Stethoscope } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "../../lib/utils"

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Doctors", to: "/doctors" },
  { label: "Treatments", to: "/treatments" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      id="site-navbar"
      className="sticky top-0 z-50 w-full border-b border-[#ebebeb] bg-white/90 backdrop-blur-md dark:bg-[#171717]/90 dark:border-white/10"
      role="banner"
    >
      {/* Skip to main content – accessibility */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-[6px] focus-visible:bg-[#171717] focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        {/* ── Logo ── */}
        <NavLink
          to="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:rounded-md dark:focus-visible:ring-white"
          aria-label="ClinicBook home"
        >
          <span className="flex size-7 items-center justify-center rounded-[6px] bg-[#171717] text-white dark:bg-white dark:text-[#171717]">
            <Stethoscope size={14} aria-hidden="true" />
          </span>
          <span className="font-[Geist,Inter,system-ui] text-[14px] font-semibold tracking-[-0.28px] text-[#171717] dark:text-white select-none">
            ClinicBook
          </span>
        </NavLink>

        {/* ── Desktop nav links ── */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-2 text-[14px] font-normal leading-5 tracking-[-0.28px] transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white",
                  isActive
                    ? "text-[#171717] dark:text-white"
                    : "text-[#4d4d4d] hover:text-[#171717] dark:text-[#888888] dark:hover:text-white"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right CTA cluster ── */}
        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />

          <NavLink
            to="/auth/login"
            className="inline-flex h-7 items-center rounded-[6px] bg-white border border-[#ebebeb] px-2 text-[14px] font-medium leading-5 tracking-[-0.28px] text-[#171717] transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:bg-[#171717] dark:border-white/10 dark:text-white dark:hover:bg-white/5 dark:focus-visible:ring-white"
          >
            Log In
          </NavLink>

          <NavLink
            to="/auth/signup"
            className="inline-flex h-7 items-center rounded-[6px] bg-[#171717] px-2 text-[14px] font-medium leading-5 tracking-[-0.28px] text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
          >
            Sign Up
          </NavLink>
        </div>

        {/* ── Mobile hamburger ── */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-[6px] text-[#4d4d4d] transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:text-[#888888] dark:hover:bg-white/5 dark:focus-visible:ring-white"
          >
            {mobileOpen
              ? <X size={18} aria-hidden="true" />
              : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-[#ebebeb] bg-white px-6 pb-6 pt-4 dark:border-white/10 dark:bg-[#171717]"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-[6px] px-3 py-2.5 text-[14px] font-normal leading-5 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white",
                    isActive
                      ? "bg-[#fafafa] text-[#171717] dark:bg-white/5 dark:text-white"
                      : "text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] dark:text-[#888888] dark:hover:bg-white/5 dark:hover:text-white"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <NavLink
              to="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] font-medium text-[#171717] transition-colors hover:bg-[#fafafa] dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
            >
              Log In
            </NavLink>
            <NavLink
              to="/auth/signup"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-[6px] bg-[#171717] px-3 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
