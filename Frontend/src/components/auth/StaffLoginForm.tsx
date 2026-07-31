import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../app/store"
import { loginUser } from "../../Features/auth/authSlice"

export const StaffLoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  type loginDataModule = {
    email: string,
    password: string
  }

  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState<loginDataModule>({ email: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email.trim() && loginData.password.trim()) {
      try {
        const response = await dispatch(loginUser(loginData)).unwrap();
        console.log(response)

        // Redirect the user to their specific dashboard based on their role
        if (response.user && response.user.role) {
          navigate(`/dashboard/${response.user.role}`);
        }
      } catch (err: any) {
        console.error("Login failed", err);
      }
    }
  }

  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-4" onSubmit={(e) => handleLogin(e)}>
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
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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

        {error && (
          <div className="rounded-[6px] bg-[#fef2f2] p-2.5 text-[13px] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  )
}
