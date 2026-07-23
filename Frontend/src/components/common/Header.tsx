import { Bell, Search } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { useLocation } from "react-router-dom"

// ── Derive a human-readable title from the pathname ──
const pageTitleFromPath = (pathname: string): string => {
  const segment = pathname.split("/").filter(Boolean).pop() ?? "Dashboard"
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const Header = () => {
  const location = useLocation()
  const title = pageTitleFromPath(location.pathname)

  return (
    <header
      id="dashboard-header"
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#ebebeb] bg-white/90 px-6 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a0a]/90"
      role="banner"
    >
      {/* ── Page title ── */}
      <div className="flex items-center gap-3">
        {/* breadcrumb dot */}
        <span
          className="hidden size-1.5 rounded-full bg-[#ebebeb] sm:block dark:bg-white/10"
          aria-hidden="true"
        />
        <h1 className="text-[14px] font-semibold leading-5 tracking-[-0.28px] text-[#171717] dark:text-white">
          {title}
        </h1>
      </div>

      {/* ── Right cluster ── */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:flex items-center">
          <Search
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 text-[#888888]"
          />
          <input
            type="search"
            name="header-search"
            aria-label="Search"
            placeholder="Search…"
            autoComplete="off"
            spellCheck={false}
            className="h-7 w-44 rounded-[6px] border border-[#ebebeb] bg-white pl-7 pr-3 text-[13px] text-[#171717] placeholder:text-[#888888] transition-all focus:w-56 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
          />
        </div>

        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex size-8 items-center justify-center rounded-full border border-[#ebebeb] bg-white text-[#4d4d4d] transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-[#888888] dark:hover:bg-white/10 dark:focus-visible:ring-white"
        >
          <Bell size={14} aria-hidden="true" />
          {/* Unread dot */}
          <span
            className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#0070f3]"
            aria-label="You have unread notifications"
          />
        </button>

        <ThemeToggle />

        {/* Avatar */}
        <button
          type="button"
          aria-label="Open user menu"
          className="inline-flex size-7 items-center justify-center rounded-full bg-[#171717] text-[15px] font-semibold text-white focus-visible:outline-none focus-  :ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717]"
        >
          U
        </button>
      </div>
    </header>
  )
}

export default Header
