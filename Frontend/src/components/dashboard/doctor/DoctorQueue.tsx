import { ListOrdered, ChevronRight, AlertCircle, RotateCcw, UserCheck, UserX, Ticket } from "lucide-react"

type QueueStatus = "waiting" | "serving" | "recalled" | "no-show" | "completed"

type QueueEntry = {
  token: number
  name: string
  visitType: "New Consultation" | "Follow-up"
  fee: number
  status: QueueStatus
  waitMinutes?: number
}

const queueData: QueueEntry[] = [
  { token: 42, name: "Priya Sharma",   visitType: "Follow-up",        fee: 200, status: "serving" },
  { token: 43, name: "Rahul Mehta",    visitType: "New Consultation",  fee: 400, status: "waiting",  waitMinutes: 12 },
  { token: 44, name: "Anita Desai",    visitType: "Follow-up",        fee: 200, status: "recalled",  waitMinutes: 24 },
  { token: 45, name: "Karan Patel",    visitType: "New Consultation",  fee: 400, status: "waiting",  waitMinutes: 36 },
  { token: 46, name: "Meena Joshi",    visitType: "Follow-up",        fee: 200, status: "waiting",  waitMinutes: 48 },
  { token: 40, name: "Suresh Kumar",   visitType: "New Consultation",  fee: 400, status: "no-show"  },
  { token: 38, name: "Deepa Nair",     visitType: "Follow-up",        fee: 200, status: "completed" },
  { token: 39, name: "Arjun Singh",    visitType: "New Consultation",  fee: 400, status: "completed" },
]

const statusConfig: Record<QueueStatus, { label: string; bg: string; text: string }> = {
  serving:   { label: "Serving",   bg: "bg-[#d3e5ff] dark:bg-[#0070f3]/20",   text: "text-[#0761d1] dark:text-[#50e3c2]" },
  waiting:   { label: "Waiting",   bg: "bg-[#fafafa] dark:bg-white/5",         text: "text-[#888888]" },
  recalled:  { label: "Recalled",  bg: "bg-[#ffefcf] dark:bg-[#f5a623]/20",   text: "text-[#ab570a] dark:text-[#f5a623]" },
  "no-show": { label: "No-show",   bg: "bg-[#f7d4d6] dark:bg-[#ee0000]/20",   text: "text-[#ee0000] dark:text-[#ff4d4d]" },
  completed: { label: "Done",      bg: "bg-[#fafafa] dark:bg-white/5",         text: "text-[#888888]" },
}

const DoctorQueue = () => {
  const active = queueData.filter(p => ["serving", "waiting", "recalled"].includes(p.status))
  const past   = queueData.filter(p => ["no-show", "completed"].includes(p.status))

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Live Queue
          </h1>
          <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Full ordered queue — call, complete, or mark no-show from here.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#ebebeb] bg-[#fafafa] px-4 py-2 dark:border-white/10 dark:bg-[#171717]">
          <ListOrdered size={15} className="text-[#888888]" />
          <span className="text-[13px] text-[#888888]">{active.length} remaining</span>
        </div>
      </div>

      {/* Recalled notice */}
      {queueData.some(p => p.status === "recalled") && (
        <div className="flex items-center gap-3 rounded-[12px] border border-[#ffefcf] bg-[#ffefcf]/50 px-5 py-4 dark:border-[#f5a623]/20 dark:bg-[#f5a623]/10">
          <AlertCircle size={16} className="shrink-0 text-[#ab570a] dark:text-[#f5a623]" />
          <p className="text-[14px] text-[#ab570a] dark:text-[#f5a623]">
            <span className="font-medium">1 patient recalled</span> — reinserted after the next 2 patients as per fairness rule.
          </p>
        </div>
      )}

      {/* Active queue */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Active Queue</h2>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[48px_1fr_160px_90px_90px_140px] gap-4 border-b border-[#ebebeb] bg-[#fafafa] px-6 py-3 dark:border-white/10 dark:bg-[#171717]">
          {["#", "Patient", "Visit Type", "Fee", "Est. Wait", "Actions"].map(h => (
            <span key={h} className="font-mono text-[11px] uppercase text-[#888888]">{h}</span>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {active.map((patient) => {
            const sc = statusConfig[patient.status]
            return (
              <div
                key={patient.token}
                className={`grid grid-cols-1 md:grid-cols-[48px_1fr_160px_90px_90px_140px] gap-4 px-6 py-4 items-center ${
                  patient.status === "serving" ? "bg-[#d3e5ff]/20 dark:bg-[#0070f3]/5" : ""
                }`}
              >
                {/* Token */}
                <span className="font-mono text-[14px] font-semibold text-[#171717] dark:text-white">
                  #{patient.token}
                </span>
                {/* Name + status */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                    <Ticket size={14} className="text-[#888888]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#171717] dark:text-white">{patient.name}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                      {sc.label}
                    </span>
                  </div>
                </div>
                {/* Visit type */}
                <span className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">{patient.visitType}</span>
                {/* Fee */}
                <span className="text-[13px] font-mono text-[#171717] dark:text-white">₹{patient.fee}</span>
                {/* Est wait */}
                <span className="text-[13px] text-[#888888]">
                  {patient.waitMinutes ? `~${patient.waitMinutes}m` : "—"}
                </span>
                {/* Actions */}
                <div className="flex gap-2">
                  {patient.status === "serving" && (
                    <>
                      <button
                        id={`btn-complete-${patient.token}`}
                        className="flex h-7 items-center gap-1.5 rounded-full bg-[#171717] px-3 text-[12px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90"
                      >
                        <UserCheck size={12} /> Done
                      </button>
                      <button
                        id={`btn-noshow-${patient.token}`}
                        className="flex h-7 items-center gap-1.5 rounded-full border border-[#ee0000]/30 px-3 text-[12px] font-medium text-[#ee0000] transition hover:bg-[#f7d4d6] dark:hover:bg-[#ee0000]/10"
                      >
                        <UserX size={12} /> No-show
                      </button>
                    </>
                  )}
                  {patient.status === "waiting" && (
                    <button
                      id={`btn-call-${patient.token}`}
                      className="flex h-7 items-center gap-1.5 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <ChevronRight size={12} /> Call
                    </button>
                  )}
                  {patient.status === "recalled" && (
                    <button
                      id={`btn-reinsert-${patient.token}`}
                      className="flex h-7 items-center gap-1.5 rounded-full border border-[#f5a623]/30 bg-[#ffefcf]/50 px-3 text-[12px] font-medium text-[#ab570a] transition hover:bg-[#ffefcf] dark:border-[#f5a623]/20 dark:bg-[#f5a623]/10 dark:text-[#f5a623]"
                    >
                      <RotateCcw size={12} /> Recalled
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completed / No-show today */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Completed Today</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {past.map((patient) => {
            const sc = statusConfig[patient.status]
            return (
              <div key={patient.token} className="flex items-center justify-between px-6 py-4 opacity-60">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] text-[#888888]">#{patient.token}</span>
                  <div>
                    <p className="text-[14px] font-medium text-[#171717] dark:text-white">{patient.name}</p>
                    <p className="text-[12px] text-[#888888]">{patient.visitType}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                  {sc.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DoctorQueue
