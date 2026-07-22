import { useState, useEffect, useRef } from "react"
import { CheckCircle2, Clock, Users, Wifi } from "lucide-react"

// ── Queue animation data cycling ──
const INITIAL_QUEUE = [
  { token: 38, name: "Arjun M.",   dept: "Cardiology",   wait: "Now",    status: "active"  },
  { token: 39, name: "Priya K.",   dept: "Neurology",    wait: "~4 min", status: "waiting" },
  { token: 40, name: "Rohit S.",   dept: "Orthopaedics", wait: "~8 min", status: "waiting" },
  { token: 41, name: "Divya P.",   dept: "Cardiology",   wait: "~12 min",status: "waiting" },
  { token: 42, name: "Meera T.",   dept: "Paediatrics",  wait: "~16 min",status: "waiting" },
]

const NEXT_ENTRANTS = [
  { token: 43, name: "Sanjay B.",  dept: "Dermatology",  wait: "~20 min",status: "waiting" },
  { token: 44, name: "Lakshmi R.", dept: "Radiology",    wait: "~24 min",status: "waiting" },
  { token: 45, name: "Vikram N.",  dept: "Neurology",    wait: "~28 min",status: "waiting" },
]

type Patient = (typeof INITIAL_QUEUE)[0]

// ════════════════════════════════════════════════════════
// LIVE QUEUE ANIMATION WIDGET
// Shows a scrolling queue panel where the top patient
// gets "called", advances out, and the next slides in.
// ════════════════════════════════════════════════════════
const LiveQueueWidget = () => {
  const [queue, setQueue]         = useState<Patient[]>(INITIAL_QUEUE)
  const [calledOut, setCalledOut] = useState(false)
  const [newEntry, setNewEntry]   = useState(false)
  const [callCount, setCallCount] = useState(0)
  const entrantRef = useRef(0)

  useEffect(() => {
    const cycle = setInterval(() => {
      // Phase 1 — mark top as "called"
      setCalledOut(true)

      setTimeout(() => {
        // Phase 2 — remove called, shift queue, add new patient
        setQueue((prev) => {
          const next = [...prev.slice(1)]
          // advance wait labels
          const updated = next.map((p, i) => ({
            ...p,
            status: i === 0 ? "active" : "waiting",
            wait:   i === 0 ? "Now" : `~${(i) * 4} min`,
          }))
          const newPatient = NEXT_ENTRANTS[entrantRef.current % NEXT_ENTRANTS.length]
          entrantRef.current += 1
          return [
            ...updated,
            { ...newPatient, wait: `~${updated.length * 4} min`, status: "waiting" },
          ]
        })
        setCalledOut(false)
        setNewEntry(true)
        setCallCount((c) => c + 1)
        setTimeout(() => setNewEntry(false), 600)
      }, 800)
    }, 3500)

    return () => clearInterval(cycle)
  }, [])

  const totalServed = 37 + callCount

  return (
    <div className="relative w-full max-w-[420px]">
      {/* Glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[32px] opacity-0 dark:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(110,231,183,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Main panel */}
      <div
        className="relative overflow-hidden rounded-[20px] border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.10)] bg-white dark:bg-[#12121a] shadow-[0_16px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] dark:border-[rgba(255,255,255,0.07)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[rgba(110,231,183,0.10)]">
              <Users size={15} className="text-[#3f3f46] dark:text-[#6ee7b7]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#171717] dark:text-white" >
                Live Queue
              </p>
              <p className="text-[11px] text-[#888] dark:text-[#64748b]" >
                OPD · All Departments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] dark:border-[rgba(110,231,183,0.20)] bg-[#f9fafb] dark:bg-[rgba(110,231,183,0.06)] px-2.5 py-1">
            <Wifi size={10} className="text-[#6ee7b7] animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#6ee7b7]" >
              Live
            </span>
          </div>
        </div>

        {/* Queue rows */}
        <div className="divide-y divide-[#f0f0f0] dark:divide-[rgba(255,255,255,0.05)]" style={{ minHeight: "260px" }}>
          {queue.map((patient, idx) => {
            const isActive  = patient.status === "active"
            const isLeaving = idx === 0 && calledOut
            const isEntering = idx === queue.length - 1 && newEntry

            return (
              <div
                key={patient.token}
                className="flex items-center gap-3 px-5 py-3.5 transition-all duration-500"
                style={{
                  opacity:   isLeaving ? 0 : 1,
                  transform: isLeaving
                    ? "translateX(-24px)"
                    : isEntering
                    ? "translateX(0)"
                    : "none",
                  transitionTimingFunction: "ease-out",
                }}
              >
                {/* Token badge */}
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold transition-colors duration-300 ${
                    isActive
                      ? "bg-[#6ee7b7] text-[#0f0f13] dark:bg-[#6ee7b7] dark:text-[#0f0f13]"
                      : "bg-[#f4f4f5] dark:bg-[rgba(255,255,255,0.06)] text-[#3f3f46] dark:text-[#94a3b8]"
                  }`}
                  
                >
                  {patient.token}
                </div>

                {/* Name + dept */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`truncate text-[13px] font-medium transition-colors ${
                      isActive ? "text-[#171717] dark:text-white" : "text-[#3f3f46] dark:text-[#cbd5e1]"
                    }`}
                    
                  >
                    {patient.name}
                  </p>
                  <p className="text-[11px] text-[#888] dark:text-[#475569]" >
                    {patient.dept}
                  </p>
                </div>

                {/* Wait badge */}
                <div className="shrink-0">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#d1fae5] dark:bg-[rgba(110,231,183,0.15)] px-2 py-0.5 text-[11px] font-semibold text-[#065f46] dark:text-[#6ee7b7]" >
                      <CheckCircle2 size={10} />
                      {patient.wait}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f4f5] dark:bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-[11px] text-[#888] dark:text-[#64748b]" >
                      <Clock size={9} />
                      {patient.wait}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Panel footer — stats */}
        <div className="grid grid-cols-3 divide-x divide-[#f0f0f0] dark:divide-[rgba(255,255,255,0.07)] border-t border-[#f0f0f0] dark:border-[rgba(255,255,255,0.07)] bg-[#fafafa] dark:bg-[rgba(255,255,255,0.02)]">
          {[
            { label: "In queue", value: queue.length },
            { label: "Served today", value: totalServed },
            { label: "Avg wait", value: "~4 min" },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-3 text-center">
              <p className="text-[15px] font-semibold text-[#171717] dark:text-white" >
                {stat.value}
              </p>
              <p className="text-[10px] text-[#888] dark:text-[#475569]" >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating "New token" toast — pops when someone enters */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 transition-all duration-500"
        style={{
          opacity:   newEntry ? 1 : 0,
          transform: newEntry
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(8px)",
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-[#d1fae5] dark:border-[rgba(110,231,183,0.25)] bg-white dark:bg-[#0f0f13] px-3 py-1.5 shadow-lg dark:shadow-[0_4px_24px_rgba(110,231,183,0.08)]">
          <span className="size-1.5 rounded-full bg-[#6ee7b7] animate-ping" />
          <span className="text-[11px] font-semibold text-[#065f46] dark:text-[#6ee7b7]" >
            Token #{37 + callCount + 1} joined the queue
          </span>
        </div>
      </div>
    </div>
  )
}

export default LiveQueueWidget
