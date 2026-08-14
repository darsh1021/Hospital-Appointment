import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { departments } from "./bookTokenData"
import { useAppDispatch, useAppSelector } from "../../app/store"
import { bookAppointmentUser, verifyBookingOtpThunk } from "../../Features/appointment/appointmentSlice"
import { OtpInput } from "../common/OtpInput"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"


const BookFormSection = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading: appointmentLoading, error: appointmentError } = useAppSelector((state) => state.appointment)

  interface FormDataInterface {
    name: string;
    phone: string;
    category: string;
    gender: string;
    address?: string;
    dob: string;
  }

  const [formData, setFormData] = useState<FormDataInterface>({
    name: "",
    phone: "",
    category: "",
    gender: "",
    address: "",
    dob: ""
  })

  const genderItems = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]

  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""))
  const [successMessage, setSuccessMessage] = useState("")
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Countdown timer logic for resend OTP
  useEffect(() => {
    let interval: any
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage("Please enter both your name and phone number.")
      return
    }
    if (!formData.category) {
      setErrorMessage("Please select a department.")
      return
    }
    if (!formData.gender) {
      setErrorMessage("Please select a gender.")
      return
    }
    if (!formData.dob) {
      setErrorMessage("Please enter your date of birth.")
      return
    }

    try {
      const result = await dispatch(
        bookAppointmentUser({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          category: formData.category,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
        })
      ).unwrap()

      console.log(result)

      if (result?.success || result?.otpSent) {
        setSuccessMessage(result?.message || "Verification code sent successfully.")
        setOtpDigits(Array(6).fill(""))
        setTimer(60)
        setCanResend(false)
        setStep('otp')
      }
    } catch (err: any) {
      console.error("Failed to book token:", err)
      setErrorMessage(typeof err === "string" ? err : "Failed to book token. Please try again.")
    }
  }

  const handleResend = async () => {
    if (!canResend || appointmentLoading) return
    try {
      setErrorMessage(null)
      const result = await dispatch(
        bookAppointmentUser({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          category: formData.category,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address
        })
      ).unwrap()
      if (result?.success || result?.otpSent) {
        setSuccessMessage("OTP resent successfully.")
        setOtpDigits(Array(6).fill(""))
        setTimer(60)
        setCanResend(false)
      }
    } catch (err: any) {
      setErrorMessage(typeof err === "string" ? err : "Failed to resend OTP. Please try again.")
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    const otp = otpDigits.join("")
    if (otp.length !== 6) {
      setErrorMessage("Please enter the full 6-digit OTP.")
      return
    }

    try {
      const result = await dispatch(
        verifyBookingOtpThunk({
          phone: formData.phone.trim(),
          otp,
        })
      ).unwrap()

      if (result?.success || result?.redirectToDashboard) {
        navigate("/dashboard/patient")
      }
    } catch (err: any) {
      console.error("Failed to verify OTP:", err)
      setErrorMessage(typeof err === "string" ? err : "Invalid or expired OTP. Please try again.")
    }
  }

  return (
    <section
      className="bg-white dark:bg-[#0a0a0f]"
      aria-labelledby="form-heading"
      style={{ paddingBlock: "80px" }}
      id="booking-form"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_520px] lg:gap-20 items-start">
          {/* ── Left: context copy ── */}
          <div className="lg:pt-4">
            <p
              className="mb-3 text-[11px] font-semibold uppercase tracking-[1.1px] text-[#888] dark:text-[#6ee7b7]"
            >
              Step 1 of 1
            </p>
            <h2
              id="form-heading"
              className="mb-5 text-[28px] font-bold leading-[1.15] tracking-[-1.2px] text-[#171717] dark:text-white"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Request an appointment.
            </h2>
            <p
              className="mb-8 max-w-sm text-[15px] leading-[1.65] text-[#5a5a5a] dark:text-[#94a3b8]"
            >
              Fill in your details below. You'll receive a token number starting from #1
              and be redirected straight to your live patient dashboard.
            </p>

            {/* Trust list */}
            <ul className="flex flex-col gap-3">
              {[
                "Token issued instantly starting from #1",
                "Direct automatic access to Patient Dashboard",
                "Live queue tracking & SMS updates",
                "No prior account setup required",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-[#6ee7b7]"
                    aria-hidden="true"
                  />
                  <span
                    className="text-[14px] text-[#4d4d4d] dark:text-[#94a3b8]"
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: form card ── */}
          <div
            className="relative overflow-hidden rounded-[16px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.09)] bg-[#fafafa] dark:bg-[#14141e] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.4)]"
          >
            {/* Card inner orb — dark only */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full opacity-0 dark:opacity-100"
              style={{
                background:
                  "radial-gradient(circle, rgba(110,231,183,0.07) 0%, transparent 70%)",
              }}
            />

            <h3
              className="mb-6 text-[18px] font-semibold tracking-[-0.5px] text-[#171717] dark:text-white"
            >
              {step === "form" ? "Book your slot" : "Verify Booking"}
            </h3>

            {(errorMessage || appointmentError) && (
              <div className="mb-4 rounded-[8px] bg-[#fef2f2] p-3 text-[13px] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]">
                {errorMessage || appointmentError}
              </div>
            )}

            {step === "form" ? (
              <form className="relative flex flex-col gap-5" onSubmit={handleSubmit}>

                {/* Patient name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="book-patient-name"
                    className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                  >
                    Patient name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-patient-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    autoComplete="name"
                    placeholder="Full name."
                    disabled={appointmentLoading}
                    className="h-11 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 text-[14px] text-[#171717] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#475569] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Phone number */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="book-patient-phone"
                    className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                  >
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-patient-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    autoComplete="tel"
                    placeholder="e.g. 9876543210"
                    disabled={appointmentLoading}
                    className="h-11 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 text-[14px] text-[#171717] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#475569] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="gender"
                    className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Select
                    selectedKey={formData.gender || null}
                    onSelectionChange={(key) =>
                      setFormData({ ...formData, gender: key as string })
                    }
                    isDisabled={appointmentLoading}
                  >
                    <SelectTrigger className="w-full h-11 rounded-[8px] border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)]">
                      <SelectValue>
                        {({ selectedText }) => selectedText || <span className="text-[#aaa] dark:text-[#475569]">Select gender…</span>}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#fafafa] text-[#1f2937] dark:bg-[#18181b] dark:text-[#f9fafb]">
                      <SelectGroup>
                        {genderItems.map((item) => (
                          <SelectItem key={item.value} id={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Birth Date*/}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="book-dob"
                    className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                  >
                    Birth Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                    disabled={appointmentLoading}
                    className="h-11 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 text-[14px] text-[#171717] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#475569] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <Select
                    selectedKey={formData.category || null}
                    onSelectionChange={(key) =>
                      setFormData({ ...formData, category: key as string })
                    }
                    isDisabled={appointmentLoading}
                  >
                    <SelectTrigger className="w-full h-11 rounded-[8px] border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)]">
                      <SelectValue>
                        {({ selectedText }) =>
                          selectedText || (
                            <span className="text-[#aaa] dark:text-[#475569]">
                              Select a department…
                            </span>
                          )
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#fafafa] text-[#1f2937] dark:bg-[#18181b] dark:text-[#f9fafb]">
                      <SelectGroup>
                        {departments.map((d) => (
                          <SelectItem key={d} id={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="book-address"
                    className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                  >
                    Address
                  </label>
                  <textarea
                    id="book-address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    autoComplete="address"
                    placeholder="Enter your address"
                    disabled={appointmentLoading}
                    className="min-h-16 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 py-2 text-[14px] text-[#171717] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#475569] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={appointmentLoading}
                  className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#171717] dark:bg-white px-6 text-[14px] font-semibold text-white dark:text-[#0a0a0f] transition-all hover:bg-[#2a2a2a] dark:hover:bg-[#e2e8f0] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7]"
                >
                  {appointmentLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Get My Token & Open Dashboard
                      <ArrowRight size={15} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form className="relative flex flex-col gap-5 animate-in fade-in duration-200" onSubmit={handleVerifyOtp}>
                <div className="flex flex-col gap-1 text-center">
                  <p className="text-[14px] font-semibold text-[#171717] dark:text-white">
                    Enter verification code
                  </p>
                  <p className="text-[12px] text-[#888888] dark:text-[#a1a1aa]">
                    We sent a 6-digit code to <span className="font-semibold text-[#171717] dark:text-white">+91 {formData.phone}</span>
                  </p>
                </div>

                {successMessage && (
                  <div className="rounded-[6px] bg-[#f0fdf4] p-2.5 text-[12px] text-[#166534] dark:bg-[#052e16] dark:text-[#86efac]">
                    {successMessage}
                  </div>
                )}

                <OtpInput
                  value={otpDigits}
                  onChange={setOtpDigits}
                  disabled={appointmentLoading}
                />

                <div className="flex items-center justify-between text-[12px]">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={appointmentLoading}
                      className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-[#888888] dark:text-[#a1a1aa] tabular-nums">
                      Resend in <span className="font-semibold text-[#171717] dark:text-white">{timer}s</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setStep("form")
                      setOtpDigits(Array(6).fill(""))
                      setErrorMessage(null)
                      setSuccessMessage("")
                    }}
                    className="text-[#888888] hover:text-[#171717] dark:hover:text-white hover:underline"
                  >
                    Edit details
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={appointmentLoading || otpDigits.join("").length !== 6}
                  className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#171717] dark:bg-white px-6 text-[14px] font-semibold text-white dark:text-[#0a0a0f] transition-all hover:bg-[#2a2a2a] dark:hover:bg-[#e2e8f0] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7]"
                >
                  {appointmentLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                      Verifying OTP…
                    </>
                  ) : (
                    <>
                      Verify & Confirm Booking
                      <ArrowRight size={15} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookFormSection
