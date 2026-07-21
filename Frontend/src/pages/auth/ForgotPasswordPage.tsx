import { NavLink } from "react-router-dom"
import { Stethoscope } from "lucide-react"

const ForgotPasswordPage = () => {
  return (
    <>
      <title>Forgot Password — ClinicBook</title>
      <meta
        name="description"
        content="Reset your ClinicBook account password. Enter your email to receive a reset link."
      />

      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-12 dark:bg-[#0a0a0a]">
        <div className="w-full max-w-[400px]">

          {/* Brand mark */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <span className="flex size-10 items-center justify-center rounded-[8px] bg-[#171717] text-white dark:bg-white dark:text-[#171717]">
              <Stethoscope size={18} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.6px] text-[#171717] dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-1 max-w-[280px] text-[14px] leading-5 text-[#888888]">
                Enter your email and we'll send you a link to reset your
                password.
              </p>
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-[12px] border border-[#ebebeb] bg-white p-8 dark:border-white/10 dark:bg-[#171717]"
            style={{ boxShadow: "inset 0 0 0 1px #0000000a, 0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a" }}
          >
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="forgot-email"
                  className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                >
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="you@example.com…"
                  required
                  className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
                />
              </div>

              <button
                type="submit"
                className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
              >
                Send reset link
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[13px] text-[#888888]">
            Remember your password?{" "}
            <NavLink
              to="/auth/login"
              className="text-[#0070f3] hover:text-[#0761d1] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#0070f3]"
            >
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordPage
