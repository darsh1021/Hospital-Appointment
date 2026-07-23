import { Clock, Users, CheckCircle2, XCircle, Timer, TrendingUp, Stethoscope, ChevronRight } from "lucide-react"

// ── Mock data ─────────────────────────────────────────────────────────────────
const currentPatient = {
  token: 42,
  name: "Priya Sharma",
  visitType: "Follow-up",
  fee: 200,
  elapsedMinutes: 8,
}

const stats = {
  servedToday: 14,
  noShows: 2,
  avgMinutes: 12,
  remaining: 9,
}

const upNext = [
  { token: 43, name: "Rahul Mehta", type: "New Consultation" },
  { token: 44, name: "Anita Desai", type: "Follow-up" },
  { token: 45, name: "Karan Patel", type: "New Consultation" },
]

// ── Component ─────────────────────────────────────────────────────────────────
const DoctorOverview = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page header */}
      <div>
        <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          Overview
        </h1>
        <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Manage the live queue and track today's session pace.
        </p>
      </div>

      {/* ── Now Serving card ── */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
        {/* Banner */}
        <div className="bg-[#d3e5ff] px-6 py-3 dark:bg-[#0070f3]/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0761d1] opacity-75 dark:bg-[#50e3c2]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0761d1] dark:bg-[#50e3c2]" />
            </span>
            <span className="text-[14px] font-medium text-[#0761d1] dark:text-[#50e3c2]">
              Session active — currently seeing patient
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-[#0761d1] dark:text-[#50e3c2]">
            <Timer size={14} />
            <span className="font-mono">{currentPatient.elapsedMinutes}m elapsed</span>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            {/* Token block */}
            <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] bg-[#fafafa] w-full md:w-1/3 py-8 dark:border-white/10 dark:bg-[#171717]">
              <span className="font-mono text-[13px] uppercase text-[#888888]">Now Serving</span>
              <span className="text-[64px] font-semibold tracking-[-2.4px] text-[#171717] leading-none mt-2 dark:text-white">
                #{currentPatient.token}
              </span>
              <span className="mt-3 text-[16px] font-medium text-[#171717] dark:text-white">
                {currentPatient.name}
              </span>
              <span className="mt-2 inline-flex items-center rounded-full bg-white border border-[#ebebeb] px-3 py-1 text-[12px] font-medium text-[#171717] dark:bg-white/5 dark:border-white/10 dark:text-white">
                {currentPatient.visitType} · ₹{currentPatient.fee}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-4 w-full md:w-2/3 justify-center h-full py-4">
              <p className="text-[13px] font-mono uppercase text-[#888888] tracking-wide">
                Consultation Actions
              </p>
              <button
                id="btn-complete-consultation"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#171717] text-[16px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90"
              >
                <CheckCircle2 size={20} />
                Complete Consultation
              </button>
              <button
                id="btn-patient-no-show"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-[#ee0000]/30 bg-[#f7d4d6]/40 text-[16px] font-medium text-[#ee0000] transition hover:bg-[#f7d4d6] dark:border-[#ee0000]/20 dark:bg-[#ee0000]/10 dark:text-[#ff4d4d] dark:hover:bg-[#ee0000]/20"
              >
                <XCircle size={20} />
                Patient Didn't Show
              </button>
              <p className="text-[12px] text-[#888888]">
                * "Didn't Show" recalls the patient after 2 patients and advances the queue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Patients Seen", value: stats.servedToday, icon: CheckCircle2, color: "text-[#0070f3]" },
          { label: "No-shows", value: stats.noShows, icon: XCircle, color: "text-[#ee0000]" },
          { label: "Avg. Consult Time", value: `${stats.avgMinutes}m`, icon: TrendingUp, color: "text-[#171717] dark:text-white" },
          { label: "Still in Queue", value: stats.remaining, icon: Users, color: "text-[#171717] dark:text-white" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <span className={`${stat.color}`}>
              <stat.icon size={18} />
            </span>
            <div>
              <p className="text-[28px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white leading-none">
                {stat.value}
              </p>
              <p className="mt-1 text-[13px] text-[#888888]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Rolling average note ── */}
      <div className="flex items-start gap-3 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-5 dark:border-white/10 dark:bg-[#171717]">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#888888]" />
        <div>
          <p className="text-[14px] font-medium text-[#171717] dark:text-white">
            Rolling Avg. Wait Estimate
          </p>
          <p className="mt-1 text-[13px] text-[#888888]">
            Based on your last 8 consultations, each patient is waiting approximately{" "}
            <span className="font-mono text-[#171717] dark:text-white">~{stats.avgMinutes} min</span>.
            This number is broadcast live to patients in the queue.
          </p>
        </div>
      </div>

      {/* ── Up Next ── */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-6 py-4 flex items-center justify-between dark:border-white/10">
          <div className="flex items-center gap-2">
            <Stethoscope size={16} className="text-[#888888]" />
            <h2 className="font-mono text-[12px] uppercase text-[#888888]">Up Next</h2>
          </div>
          <span className="text-[13px] text-[#888888]">{upNext.length} patients</span>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {upNext.map((patient, idx) => (
            <div key={patient.token} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] font-mono text-[13px] font-medium text-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-white">
                  #{patient.token}
                </span>
                <div>
                  <p className="text-[14px] font-medium text-[#171717] dark:text-white">{patient.name}</p>
                  <p className="text-[12px] text-[#888888]">{patient.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#888888]">
                  ~{(idx + 1) * stats.avgMinutes}m wait
                </span>
                <ChevronRight size={16} className="text-[#888888]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorOverview
