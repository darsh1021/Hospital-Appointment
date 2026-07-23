import { Ticket, AlertCircle, RotateCcw, UserCheck, UserX, ChevronRight, ListOrdered } from "lucide-react"

type QueueStatus = "waiting" | "serving" | "recalled" | "no-show" | "completed"

type QueueEntry = {
  token: number
  name: string
  visitType: "New Consultation" | "Follow-up"
  fee: number
  source: "online" | "walk-in"
  status: QueueStatus
}

const queue: QueueEntry[] = [
  { token: 39, name: "Arjun Singh",    visitType: "New Consultation",  fee: 400, source: "online",  status: "serving" },
  { token: 40, name: "Suresh Kumar",   visitType: "New Consultation",  fee: 400, source: "walk-in", status: "no-show" },
  { token: 41, name: "Anita Desai",    visitType: "Follow-up",        fee: 200, source: "walk-in", status: "recalled" },
  { token: 42, name: "Priya Sharma",   visitType: "Follow-up",        fee: 200, source: "online",  status: "waiting" },
  { token: 43, name: "Rahul Mehta",    visitType: "New Consultation",  fee: 400, source: "walk-in", status: "waiting" },
  { token: 44, name: "Meena Joshi",    visitType: "Follow-up",        fee: 200, source: "online",  status: "waiting" },
  { token: 45, name: "Karan Patel",    visitType: "New Consultation",  fee: 400, source: "online",  status: "waiting" },
  { token: 37, name: "Deepa Nair",     visitType: "Follow-up",        fee: 200, source: "walk-in", status: "completed" },
  { token: 38, name: "Vijay Nambiar",  visitType: "Follow-up",        fee: 200, source: "walk-in", status: "completed" },
]

const statusConfig: Record<QueueStatus, { label: string; bg: string; text: string }> = {
  serving:   { label: "Serving",   bg: "bg-[#d3e5ff] dark:bg-[#0070f3]/20",   text: "text-[#0761d1] dark:text-[#50e3c2]" },
  waiting:   { label: "Waiting",   bg: "bg-[#fafafa] dark:bg-white/5",         text: "text-[#888888]" },
  recalled:  { label: "Recalled",  bg: "bg-[#ffefcf] dark:bg-[#f5a623]/20",   text: "text-[#ab570a] dark:text-[#f5a623]" },
  "no-show": { label: "No-show",   bg: "bg-[#f7d4d6] dark:bg-[#ee0000]/20",   text: "text-[#ee0000] dark:text-[#ff4d4d]" },
  completed: { label: "Done",      bg: "bg-[#fafafa] dark:bg-white/5",         text: "text-[#888888]" },
}

const ReceptionLiveQueue = () => {
  const active    = queue.filter(p => !["completed"].includes(p.status))
  const completed = queue.filter(p => p.status === "completed")

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Live Queue
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Full queue view — mark no-shows, reinsert recalled patients, or manually reorder.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#ebebeb] bg-[#fafafa] px-4 py-2 self-start sm:self-auto dark:border-white/10 dark:bg-[#171717]">
          <ListOrdered size={14} className="text-[#888888]" />
          <span className="text-[13px] text-[#888888]">{active.length} remaining</span>
        </div>
      </div>

      {/* Recalled notice */}
      {queue.some(p => p.status === "recalled") && (
        <div className="flex items-start gap-3 rounded-[12px] border border-[#ffefcf] bg-[#ffefcf]/50 px-4 md:px-5 py-4 dark:border-[#f5a623]/20 dark:bg-[#f5a623]/10">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#ab570a] dark:text-[#f5a623]" />
          <p className="text-[13px] md:text-[14px] text-[#ab570a] dark:text-[#f5a623]">
            <span className="font-medium">1 patient recalled</span> — will be reinserted after the next 2 patients per the fairness rule.
          </p>
        </div>
      )}

      {/* Active queue */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Active Queue</h2>
        </div>

        {/* Scrollable on mobile */}
        <div className="overflow-x-auto">
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-[52px_1fr_160px_80px_100px_80px_140px] gap-3 border-b border-[#ebebeb] bg-[#fafafa] px-6 py-3 dark:border-white/10 dark:bg-[#171717]">
            {["#", "Patient", "Visit Type", "Fee", "Source", "Status", "Actions"].map(h => (
              <span key={h} className="font-mono text-[11px] uppercase text-[#888888]">{h}</span>
            ))}
          </div>

          <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
            {active.map(patient => {
              const sc = statusConfig[patient.status]
              return (
                <div
                  key={patient.token}
                  className={`flex flex-col md:grid md:grid-cols-[52px_1fr_160px_80px_100px_80px_140px] gap-3 px-5 md:px-6 py-4 items-start md:items-center ${
                    patient.status === "serving" ? "bg-[#d3e5ff]/20 dark:bg-[#0070f3]/5" : ""
                  }`}
                >
                  {/* Mobile header row */}
                  <div className="flex items-center justify-between w-full md:contents">
                    <span className="font-mono text-[14px] font-semibold text-[#171717] dark:text-white">
                      #{patient.token}
                    </span>
                    {/* Status badge (mobile) */}
                    <span className={`md:hidden inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                      <Ticket size={12} className="text-[#888888]" />
                    </div>
                    <p className="text-[13px] md:text-[14px] font-medium text-[#171717] dark:text-white">{patient.name}</p>
                  </div>

                  {/* Visit type */}
                  <span className="text-[12px] md:text-[13px] text-[#4d4d4d] dark:text-[#888888]">{patient.visitType}</span>

                  {/* Fee */}
                  <span className="text-[13px] font-mono text-[#171717] dark:text-white">₹{patient.fee}</span>

                  {/* Source */}
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium self-start ${
                    patient.source === "online"
                      ? "bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]"
                      : "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                  }`}>
                    {patient.source}
                  </span>

                  {/* Status (desktop) */}
                  <span className={`hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                    {sc.label}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {patient.status === "serving" && (
                      <>
                        <button id={`rcpt-done-${patient.token}`} className="flex h-7 items-center gap-1 rounded-full bg-[#171717] px-3 text-[11px] font-medium text-white dark:bg-white dark:text-[#171717]">
                          <UserCheck size={11} /> Done
                        </button>
                        <button id={`rcpt-noshow-${patient.token}`} className="flex h-7 items-center gap-1 rounded-full border border-[#ee0000]/30 px-3 text-[11px] font-medium text-[#ee0000]">
                          <UserX size={11} /> No-show
                        </button>
                      </>
                    )}
                    {patient.status === "waiting" && (
                      <button id={`rcpt-call-${patient.token}`} className="flex h-7 items-center gap-1 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[11px] font-medium text-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-white">
                        <ChevronRight size={11} /> Call
                      </button>
                    )}
                    {patient.status === "no-show" && (
                      <button id={`rcpt-reinsert-${patient.token}`} className="flex h-7 items-center gap-1 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[11px] font-medium text-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-white">
                        <RotateCcw size={11} /> Reinsert
                      </button>
                    )}
                    {patient.status === "recalled" && (
                      <span className="flex h-7 items-center gap-1 rounded-full bg-[#ffefcf]/80 px-3 text-[11px] font-medium text-[#ab570a] dark:bg-[#f5a623]/10 dark:text-[#f5a623]">
                        <RotateCcw size={11} /> Recalled
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Completed Today</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {completed.map(patient => (
            <div key={patient.token} className="flex items-center justify-between px-5 md:px-6 py-3.5 opacity-60">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-[12px] text-[#888888] shrink-0">#{patient.token}</span>
                <div className="min-w-0">
                  <p className="text-[13px] md:text-[14px] font-medium text-[#171717] dark:text-white truncate">{patient.name}</p>
                  <p className="text-[12px] text-[#888888]">{patient.visitType}</p>
                </div>
              </div>
              <span className="text-[12px] font-mono text-[#171717] dark:text-white shrink-0 ml-4">₹{patient.fee}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReceptionLiveQueue
