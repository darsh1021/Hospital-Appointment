import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { ShieldCheck, Zap, Activity, Users, ArrowRight } from "lucide-react"
import SectionLabel from "./SectionLabel"

// ════════════════════════════════════════════════════
// LIVE TOKEN SHOWCASE — always dark section
// This section intentionally stays dark in both modes
// (it's the "dark feature" band) — but greatly improved:
// - Better orb luminosity
// - Token card in dark: glassy dark card instead of broken white
// - Progress bar and queue info styled for dark surface
// ════════════════════════════════════════════════════
const TokenShowcaseSection = () => {
  const [queuePos, setQueuePos] = useState(3)
  const [timeRemaining, setTimeRemaining] = useState(12)

  useEffect(() => {
    const timer = setInterval(() => {
      setQueuePos((p) => {
        if (p === 0) {
          setTimeRemaining(12)
          return 3
        }
        return p - 1
      })
      setTimeRemaining((t) => {
        if (t === 0) return 12
        return t - 4
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const isMyTurn = queuePos === 0

  return (
    <section
      className="relative overflow-hidden bg-[#0c0a0e]"
      aria-labelledby="platform-heading"
      style={{ paddingBlock: "96px" }}
    >
      {/* Rich atmospheric orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 80% at 85% 50%, rgba(167,229,211,0.13) 0%, transparent 65%)," +
            "radial-gradient(ellipse 45% 65% at 8% 40%, rgba(200,184,224,0.11) 0%, transparent 60%)," +
            "radial-gradient(ellipse 35% 50% at 50% 10%, rgba(168,200,232,0.07) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Copy column */}
          <div>
            <SectionLabel>The platform</SectionLabel>
            <h2
              id="platform-heading"
              className="mb-5 text-white"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "clamp(30px, 3.5vw, 48px)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.96px",
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Your token, live in your pocket.
            </h2>
            <p
              className="mb-8 text-[15px] leading-[1.65] text-[#94a3b8]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Book once, track everywhere. Your token number, queue position,
              and estimated wait time update in real-time.
            </p>

            <ul className="mb-10 flex flex-col gap-4">
              {[
                { icon: Zap,      text: "Instant token generation after booking" },
                { icon: Activity, text: "Live queue position updated every 30 s" },
                { icon: Users,    text: "SMS + email at every queue milestone" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.text} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(110,231,183,0.10)] ring-1 ring-[rgba(110,231,183,0.20)]">
                      <Icon size={13} className="text-[#6ee7b7]" aria-hidden="true" />
                    </span>
                    <span
                      className="text-[14px] leading-[1.5] text-[#94a3b8]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.text}
                    </span>
                  </li>
                )
              })}
            </ul>

            <NavLink
              to="/book-token"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-medium leading-none text-[#0c0a09] transition-all hover:bg-[#e2e8f0] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0a0e]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get your token now
              <ArrowRight size={15} aria-hidden="true" />
            </NavLink>
          </div>

          {/* ── Token Card ── */}
          <div
            className="relative mx-auto w-full max-w-[360px] transition-all duration-700"
            style={{ transform: isMyTurn ? "scale(1.03)" : "scale(1)" }}
          >
            {/* Outer glow ring */}
            <div
              className="absolute -inset-px rounded-[25px] opacity-0 transition-opacity duration-700"
              style={{
                background: isMyTurn
                  ? "linear-gradient(135deg, rgba(110,231,183,0.5), rgba(168,200,232,0.3))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                opacity: isMyTurn ? 1 : 1,
                filter: "blur(1px)",
              }}
              aria-hidden="true"
            />
            <div
              className="relative overflow-hidden rounded-[24px] p-[1px]"
              style={{
                background: isMyTurn
                  ? "linear-gradient(135deg, rgba(110,231,183,0.45), rgba(168,200,232,0.25), rgba(255,255,255,0.06))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
              }}
            >
              <div className="relative rounded-[23px] bg-[#17171f] p-6">
                {/* Soft inner orb */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[23px] opacity-40"
                  style={{
                    background: isMyTurn
                      ? "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(110,231,183,0.15) 0%, transparent 70%)"
                      : "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,200,232,0.10) 0%, transparent 70%)",
                  }}
                />

                {/* Card header */}
                <div className="relative mb-6 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.07)] ring-1 ring-[rgba(255,255,255,0.10)]">
                      <ShieldCheck size={15} className="text-[#6ee7b7]" />
                    </div>
                    <div>
                      <h3
                        className="text-[13px] font-semibold text-white"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        ClinicBook
                      </h3>
                      <p
                        className="text-[11px] text-[#64748b]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Verified Appointment
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ${
                      isMyTurn
                        ? "bg-[rgba(110,231,183,0.12)] ring-[rgba(110,231,183,0.30)]"
                        : "bg-[rgba(255,255,255,0.05)] ring-[rgba(255,255,255,0.10)]"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isMyTurn ? "bg-[#6ee7b7]" : "bg-[#6ee7b7] animate-pulse"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide ${
                        isMyTurn ? "text-[#6ee7b7]" : "text-[#94a3b8]"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {isMyTurn ? "Your turn" : "Live"}
                    </span>
                  </div>
                </div>

                {/* Token number */}
                <div className="relative text-center">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#475569]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Token Number
                  </p>
                  <div
                    className={`my-2 text-[76px] leading-none transition-colors duration-500 ${
                      isMyTurn ? "text-[#6ee7b7]" : "text-white"
                    }`}
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontWeight: 300,
                      letterSpacing: "-3px",
                    }}
                  >
                    42
                  </div>
                  <p
                    className="mb-6 text-[14px] text-[#64748b]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Dr. Aisha Khan · Cardiology
                  </p>
                </div>

                {/* Queue info panel */}
                <div className="relative rounded-[12px] bg-[rgba(255,255,255,0.04)] ring-1 ring-[rgba(255,255,255,0.07)] p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] text-[#475569]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Queue ahead
                    </span>
                    <span
                      className="text-[14px] font-semibold text-white transition-all duration-300"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {isMyTurn ? "—" : `${queuePos} patients`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#475569]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Est. wait time
                    </span>
                    <span
                      className={`text-[14px] font-semibold transition-all duration-300 ${
                        isMyTurn ? "text-[#6ee7b7]" : "text-white"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {timeRemaining === 0 ? "Now →" : `~${timeRemaining} min`}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative mt-4 w-full rounded-full h-1 overflow-hidden bg-[rgba(255,255,255,0.06)]">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-in-out"
                    style={{
                      width: `${Math.max(5, 100 - (queuePos / 3) * 100)}%`,
                      background: isMyTurn
                        ? "linear-gradient(90deg, #6ee7b7, #34d399)"
                        : "linear-gradient(90deg, rgba(110,231,183,0.6), rgba(168,200,232,0.5))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TokenShowcaseSection
