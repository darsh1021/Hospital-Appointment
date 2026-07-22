import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

export const StaffLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col">
      {/* <div className="mb-4 rounded-md bg-[#fefce8] p-3 text-[13px] text-[#854d0e] dark:bg-[#422006] dark:text-[#fde047]">
        <strong>Note:</strong> This section is strictly for hospital authorities (Doctors, Receptionists, Admins). Patients should use the Patient Login.
      </div> */}
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-email"
            className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com…"
            required
            className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
            >
              Password
            </label>
            <NavLink
              to="/auth/forgot-password"
              className="text-[13px] text-[#0070f3] hover:text-[#0761d1] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#0070f3]"
            >
              Forgot password?
            </NavLink>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Your password…"
              required
              className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 pr-10 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:hover:text-white dark:focus-visible:ring-white"
            >
              {showPassword
                ? <EyeOff size={15} aria-hidden="true" />
                : <Eye size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
