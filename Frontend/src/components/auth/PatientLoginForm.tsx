import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/store"
import { loginPatientUser, verifyPatientOtp } from "../../Features/auth/authSlice"
import { clearError } from "../../Features/auth/authSlice"

import { OtpInput } from "../common/OtpInput"

const OTP_LENGTH = 6

// ─── Resend Countdown ─────────────────────────────────────────────────────────
function useResendTimer(initial = 60) {
  const [seconds, setSeconds] = useState(initial)
  const reset = useCallback(() => setSeconds(initial), [initial])

  useEffect(() => {
    if (seconds <= 0) return
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds])

  return { seconds, canResend: seconds <= 0, reset }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const PatientLoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [step, setStep] = useState<"login" | "otp">("login")
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({ name: "", phone: "" })

  const { seconds, canResend, reset: resetTimer } = useResendTimer(60)

  // Clear error when switching steps
  useEffect(() => {
    dispatch(clearError())
    setSuccessMessage("")
  }, [step, dispatch])

  const otp = digits.join("")
  const otpComplete = otp.length === OTP_LENGTH && digits.every(Boolean)

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone.trim() && !formData.name.trim()) return
    try {
      const response = await dispatch(
        loginPatientUser({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        })
      ).unwrap()
      if (response?.success) {
        setSuccessMessage(response.message || "OTP sent to your registered phone.")
        setDigits(Array(OTP_LENGTH).fill(""))
        resetTimer()
        setStep("otp")
      }
    } catch {
      // error shown via redux state
    }
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpComplete) return
    try {
      const response = await dispatch(
        verifyPatientOtp({ phone: formData.phone.trim(), otp })
      ).unwrap()
      if (response?.success || response?.user) {
        navigate("/dashboard/patient")
      }
    } catch {
      // error shown via redux state
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend || loading) return
    try {
      const response = await dispatch(
        loginPatientUser({ name: formData.name.trim(), phone: formData.phone.trim() })
      ).unwrap()
      if (response?.success) {
        setSuccessMessage("OTP resent successfully.")
        setDigits(Array(OTP_LENGTH).fill(""))
        resetTimer()
      }
    } catch {
      // error shown via redux state
    }
  }

  // ── Change number ──────────────────────────────────────────────────────────
  const handleChangeNumber = () => {
    setStep("login")
    setDigits(Array(OTP_LENGTH).fill(""))
    setSuccessMessage("")
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      {/* ── LOGIN STEP ────────────────────────────────────────────── */}
      {step === "login" && (
        <form
          id="patient-login-form"
          className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
          onSubmit={handlePatientLogin}
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-name"
              className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
            >
              Patient Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              id="patient-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              spellCheck={false}
              placeholder="Full Name"
              className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-phone"
              className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
            >
              Phone Number <span className="text-[#ef4444]">*</span>
            </label>
            <input
              id="patient-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder="e.g. 9876543210"
              required
              maxLength={10}
              pattern="[0-9]{10}"
              className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-[6px] bg-[#fef2f2] p-2.5 text-[13px] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]"
            >
              <span className="mt-px shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            id="patient-login-submit"
            type="submit"
            disabled={loading || !formData.phone.trim() || !formData.name.trim()}
            className="mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending OTP…
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      )}

      {/* ── OTP STEP ──────────────────────────────────────────────── */}
      {step === "otp" && (
        <form
          id="patient-otp-form"
          className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-200"
          onSubmit={handleVerifyOtp}
        >
          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            {/* Phone icon badge */}
            <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#27272a]">
              <svg
                className="size-5 text-[#171717] dark:text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.41 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6 6l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.46 16l.46.92z" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[#171717] dark:text-white">
              Verify your number
            </p>
            <p className="text-[12px] text-[#888888] dark:text-[#a1a1aa]">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-[#171717] dark:text-white">
                +91 {formData.phone}
              </span>
            </p>
          </div>

          {/* Success banner */}
          {successMessage && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-[6px] bg-[#f0fdf4] p-2.5 text-[12px] text-[#166534] dark:bg-[#052e16] dark:text-[#86efac]"
            >
              <svg className="size-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}

          {/* 6-box OTP Input */}
          <div className="flex flex-col gap-2">
            <OtpInput value={digits} onChange={setDigits} disabled={loading} />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-[6px] bg-[#fef2f2] p-2.5 text-[13px] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]"
            >
              <span className="mt-px shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Resend & Change Number row */}
          <div className="flex items-center justify-between text-[12px]">
            {canResend ? (
              <button
                id="patient-resend-otp"
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="font-medium text-[#0070f3] hover:text-[#0761d1] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-[#888888] dark:text-[#a1a1aa] tabular-nums">
                Resend in{" "}
                <span className="font-semibold text-[#171717] dark:text-white">
                  {seconds}s
                </span>
              </span>
            )}

            <button
              id="patient-change-number"
              type="button"
              onClick={handleChangeNumber}
              className="text-[#888888] hover:text-[#171717] dark:hover:text-white hover:underline"
            >
              Change number
            </button>
          </div>

          {/* Verify button */}
          <button
            id="patient-otp-submit"
            type="submit"
            disabled={loading || !otpComplete}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying…
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      )}
    </div>
  )
}
