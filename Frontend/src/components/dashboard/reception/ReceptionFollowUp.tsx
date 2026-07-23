import { History, CalendarDays, Ticket, AlertCircle, CheckCircle2, Clock } from "lucide-react"

type FollowUpStatus = "booked" | "not-booked" | "overdue"

type FollowUpEntry = {
  id: number
  name: string
  age: number
  lastVisit: string
  followUpDue: string
  diagnosis: string
  status: FollowUpStatus
  token: number | null
  fee: number
}

const patients: FollowUpEntry[] = [
  { id: 1, name: "Priya Sharma",  age: 34, lastVisit: "Sep 28, 2026", followUpDue: "Oct 26, 2026", diagnosis: "Acne Vulgaris (Grade II)",  status: "booked",     token: 42, fee: 200 },
  { id: 2, name: "Deepa Nair",    age: 29, lastVisit: "Oct 2, 2026",  followUpDue: "Oct 30, 2026", diagnosis: "Psoriasis (Mild)",          status: "not-booked", token: null, fee: 200 },
  { id: 3, name: "Suresh Kumar",  age: 45, lastVisit: "Oct 1, 2026",  followUpDue: "Oct 15, 2026", diagnosis: "Seborrheic Dermatitis",     status: "overdue",    token: null, fee: 200 },
  { id: 4, name: "Meena Joshi",   age: 38, lastVisit: "Oct 5, 2026",  followUpDue: "Nov 5, 2026",  diagnosis: "Eczema (Atopic)",           status: "not-booked", token: null, fee: 200 },
  { id: 5, name: "Arjun Singh",   age: 22, lastVisit: "Sep 20, 2026", followUpDue: "Oct 20, 2026", diagnosis: "Tinea Corporis",            status: "overdue",    token: null, fee: 200 },
]

const statusConfig: Record<FollowUpStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  booked:       { label: "Token Booked", bg: "bg-[#d3e5ff] dark:bg-[#0070f3]/20",  text: "text-[#0761d1] dark:text-[#50e3c2]", icon: CheckCircle2 },
  "not-booked": { label: "Pending",      bg: "bg-[#fafafa] dark:bg-white/5",        text: "text-[#888888]",                     icon: Clock },
  overdue:      { label: "Overdue",      bg: "bg-[#f7d4d6] dark:bg-[#ee0000]/20",  text: "text-[#ee0000] dark:text-[#ff4d4d]", icon: AlertCircle },
}

const ReceptionFollowUp = () => {
  const overdue   = patients.filter(p => p.status === "overdue")
  const booked    = patients.filter(p => p.status === "booked")
  const notBooked = patients.filter(p => p.status === "not-booked")

  const renderGroup = (title: string, list: FollowUpEntry[]) => {
    if (!list.length) return null
    return (
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">{title}</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {list.map(patient => {
            const sc = statusConfig[patient.status]
            const StatusIcon = sc.icon
            return (
              <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 md:p-6">
                <div className="flex items-start gap-3 md:gap-4 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                    <History size={18} className="text-[#888888]" />
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[14px] md:text-[15px] font-medium text-[#171717] dark:text-white">
                        {patient.name}, {patient.age}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                        <StatusIcon size={10} />{sc.label}
                      </span>
                    </div>
                    <p className="text-[12px] md:text-[13px] text-[#888888]">{patient.diagnosis}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#888888]">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={12} />
                        <span>Last: {patient.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Due: {patient.followUpDue}</span>
                      </div>
                      {patient.token && (
                        <div className="flex items-center gap-1">
                          <Ticket size={12} />
                          <span>Token #{patient.token}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {!patient.token && (
                    <button
                      id={`btn-register-followup-${patient.id}`}
                      className="flex h-8 items-center gap-1.5 rounded-full bg-[#171717] px-4 text-[12px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
                    >
                      Register
                    </button>
                  )}
                  <button
                    id={`btn-history-${patient.id}`}
                    className="flex h-8 items-center gap-1.5 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    History
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Follow-up Patients
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Patients with a prescribed follow-up date. They receive the ₹200 discounted fee.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#ebebeb] bg-[#fafafa] px-4 py-2 self-start sm:self-auto dark:border-white/10 dark:bg-[#171717]">
          <History size={14} className="text-[#888888]" />
          <span className="text-[13px] text-[#888888]">{patients.length} scheduled</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Token Booked", count: booked.length,    bg: "bg-[#d3e5ff]/50 dark:bg-[#0070f3]/10",   text: "text-[#0761d1] dark:text-[#50e3c2]" },
          { label: "Pending",      count: notBooked.length, bg: "bg-[#fafafa] dark:bg-[#171717]",          text: "text-[#888888]" },
          { label: "Overdue",      count: overdue.length,   bg: "bg-[#f7d4d6]/50 dark:bg-[#ee0000]/10",   text: "text-[#ee0000] dark:text-[#ff4d4d]" },
        ].map(s => (
          <div key={s.label} className={`flex flex-col gap-1 rounded-[12px] border border-[#ebebeb] p-4 md:p-5 dark:border-white/10 ${s.bg}`}>
            <p className={`text-[22px] md:text-[28px] font-semibold tracking-[-1.28px] leading-none ${s.text}`}>{s.count}</p>
            <p className="text-[11px] md:text-[13px] text-[#888888]">{s.label}</p>
          </div>
        ))}
      </div>

      {overdue.length > 0 && (
        <div className="flex items-start gap-3 rounded-[12px] border border-[#f7d4d6] bg-[#f7d4d6]/40 px-4 md:px-5 py-4 dark:border-[#ee0000]/20 dark:bg-[#ee0000]/10">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#ee0000] dark:text-[#ff4d4d]" />
          <p className="text-[13px] md:text-[14px] text-[#ee0000] dark:text-[#ff4d4d]">
            <span className="font-medium">{overdue.length} overdue follow-up{overdue.length > 1 ? "s" : ""}</span> — these patients missed their scheduled return date.
          </p>
        </div>
      )}

      {renderGroup("Overdue — Missed Follow-up Date", overdue)}
      {renderGroup("Upcoming — Token Booked", booked)}
      {renderGroup("Upcoming — Not Yet Registered", notBooked)}
    </div>
  )
}

export default ReceptionFollowUp
