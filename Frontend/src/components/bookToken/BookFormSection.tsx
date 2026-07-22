import { useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { departments } from "./bookTokenData"

// ════════════════════════════════════════════════════
// BOOKING FORM SECTION
// Left: context copy + trust badges
// Right: the actual booking form card
// Simulates a "submitting → confirmed" state
// ════════════════════════════════════════════════════
const BookFormSection = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [token, setToken] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setTimeout(() => {
      setToken(Math.floor(Math.random() * 20) + 40)
      setStatus("done")
    }, 1800)
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
              Fill in your details below. You'll receive a token number via
              SMS and email immediately after confirming.
            </p>

            {/* Trust list */}
            <ul className="flex flex-col gap-3">
              {[
                "Token issued in under 60 seconds",
                "Live queue tracking via SMS & email",
                "Cancel or reschedule anytime",
                "No account required",
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

            {/* ── Idle / Loading form ── */}
            {status !== "done" ? (
              <>
                <h3
                  className="mb-6 text-[18px] font-semibold tracking-[-0.5px] text-[#171717] dark:text-white"
                >
                  Book your slot
                </h3>

                <form className="relative flex flex-col gap-5" onSubmit={handleSubmit}>
                  {/* Department */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="dept-select"
                      className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                    >
                      Department
                    </label>
                    <select
                      id="dept-select"
                      name="department"
                      required
                      disabled={status === "loading"}
                      className="h-11 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 text-[14px] text-[#171717] dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a department…</option>
                      {departments.map((d) => (
                        <option key={d} value={d.toLowerCase()}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Patient name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="patient-name"
                      className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                    >
                      Patient name
                    </label>
                    <input
                      id="patient-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Full name"
                      disabled={status === "loading"}
                      className="h-11 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 text-[14px] text-[#171717] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#475569] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Phone number */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="patient-phone"
                      className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                    >
                      Phone number
                    </label>
                    <input
                      id="patient-phone"
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="+91 9876543210"
                      disabled={status === "loading"}
                      className="h-11 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 text-[14px] text-[#171717] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#475569] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Preferred date */}
                  {/* <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="preferred-date"
                      className="text-[13px] font-medium text-[#171717] dark:text-[#e2e8f0]"
                    >
                      Preferred date
                    </label>
                    <input
                      id="preferred-date"
                      type="date"
                      name="date"
                      required
                      disabled={status === "loading"}
                      className="h-11 rounded-[8px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#0a0a0f] px-3 text-[14px] text-[#171717] dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7] disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div> */}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#171717] dark:bg-white px-6 text-[14px] font-semibold text-white dark:text-[#0a0a0f] transition-all hover:bg-[#2a2a2a] dark:hover:bg-[#e2e8f0] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ee7b7]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                        Generating token…
                      </>
                    ) : (
                      <>
                        Get My Token
                        <ArrowRight size={15} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ── Confirmation state ── */
              <div className="flex flex-col items-center py-8 text-center">
                {/* Animated check ring */}
                <div className="relative mb-6 flex size-20 items-center justify-center rounded-full bg-[#d1fae5] dark:bg-[rgba(110,231,183,0.12)]">
                  <div className="absolute inset-0 animate-ping rounded-full bg-[#6ee7b7] opacity-20" />
                  <CheckCircle2 size={36} className="text-[#059669] dark:text-[#6ee7b7]" aria-hidden="true" />
                </div>
                <h3
                  className="mb-2 text-[22px] font-bold tracking-[-0.8px] text-[#171717] dark:text-white"

                >
                  You're in the queue!
                </h3>
                <p
                  className="mb-6 text-[14px] text-[#5a5a5a] dark:text-[#94a3b8]"

                >
                  Your token number has been issued.
                  <br />
                  We'll notify you when it's almost your turn.
                </p>

                {/* Token badge */}
                <div className="mb-8 flex flex-col items-center rounded-[16px] border border-[#e5e7eb] dark:border-[rgba(110,231,183,0.20)] bg-[#f9fafb] dark:bg-[rgba(110,231,183,0.05)] px-10 py-6">
                  <p
                    className="mb-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-[#888] dark:text-[#6ee7b7]"

                  >
                    Your token
                  </p>
                  <span
                    className="text-[64px] font-bold leading-none text-[#171717] dark:text-white"
                    style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-3px" }}
                  >
                    #{token}
                  </span>
                </div>

                <button
                  onClick={() => setStatus("idle")}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.12)] bg-white dark:bg-transparent px-5 text-[13px] font-medium text-[#3f3f46] dark:text-[#94a3b8] transition-all hover:border-[#d1d5db] dark:hover:border-[rgba(255,255,255,0.25)] hover:text-[#171717] dark:hover:text-white"

                >
                  Book another appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookFormSection
