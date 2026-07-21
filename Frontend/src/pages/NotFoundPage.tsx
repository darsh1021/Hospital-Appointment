import { NavLink } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const NotFoundPage = () => {
  return (
    <>
      <title>404 — Page Not Found · ClinicBook</title>
      <meta name="description" content="The page you were looking for doesn't exist." />

      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-[#888888]">
          404
        </p>
        <h1
          className="mb-4 text-[40px] font-semibold leading-[1.1] tracking-[-2px] text-[#171717] dark:text-white sm:text-[48px]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Page not found.
        </h1>
        <p className="mb-10 max-w-md text-[18px] leading-7 text-[#4d4d4d] dark:text-[#888888]">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <NavLink
          to="/"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#ebebeb] bg-white px-5 text-[14px] font-medium text-[#171717] transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to home
        </NavLink>
      </div>
    </>
  )
}

export default NotFoundPage
