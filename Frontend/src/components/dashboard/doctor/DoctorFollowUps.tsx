import { CalendarDays, Ticket, Clock, CheckCircle2, AlertCircle, History } from "lucide-react"

type FollowUpStatus = "booked" | "not-booked" | "overdue"

type FollowUpPatient = {
  id: number
  name: string
  age: number
  lastVisit: string
  scheduledFollowUp: string
  status: FollowUpStatus
  tokenBooked: number | null
  diagnosis: string
}

const followUps: FollowUpPatient[] = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 34,
    lastVisit: "Sep 28, 2026",
    scheduledFollowUp: "Oct 26, 2026",
    status: "booked",
    tokenBooked: 42,
    diagnosis: "Acne Vulgaris (Grade II)",
  },
  {
    id: 2,
    name: "Deepa Nair",
    age: 29,
    lastVisit: "Oct 2, 2026",
    scheduledFollowUp: "Oct 30, 2026",
    status: "not-booked",
    tokenBooked: null,
    diagnosis: "Psoriasis (Mild)",
  },
  {
    id: 3,
    name: "Suresh Kumar",
    age: 45,
    lastVisit: "Oct 1, 2026",
    scheduledFollowUp: "Oct 15, 2026",
    status: "overdue",
    tokenBooked: null,
    diagnosis: "Seborrheic Dermatitis",
  },
  {
    id: 4,
    name: "Meena Joshi",
    age: 38,
    lastVisit: "Oct 5, 2026",
    scheduledFollowUp: "Nov 5, 2026",
    status: "not-booked",
    tokenBooked: null,
    diagnosis: "Eczema (Atopic)",
  },
]

const statusConfig: Record<FollowUpStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  booked:     { label: "Token Booked",   bg: "bg-[#d3e5ff] dark:bg-[#0070f3]/20",   text: "text-[#0761d1] dark:text-[#50e3c2]", icon: CheckCircle2 },
  "not-booked": { label: "Not Booked",   bg: "bg-[#fafafa] dark:bg-white/5",         text: "text-[#888888]",                      icon: Clock },
  overdue:    { label: "Overdue",        bg: "bg-[#f7d4d6] dark:bg-[#ee0000]/20",   text: "text-[#ee0000] dark:text-[#ff4d4d]", icon: AlertCircle },
}

const DoctorFollowUps = () => {
  const overdue    = followUps.filter(p => p.status === "overdue")
  const booked     = followUps.filter(p => p.status === "booked")
  const notBooked  = followUps.filter(p => p.status === "not-booked")

  const renderGroup = (title: string, patients: FollowUpPatient[]) => {
    if (!patients.length) return null
    return (
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">{title}</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {patients.map(patient => {
            const sc = statusConfig[patient.status]
            const StatusIcon = sc.icon
            return (
              <div key={patient.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                    <History size={18} className="text-[#888888]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-[15px] font-medium text-[#171717] dark:text-white">
                        {patient.name}, {patient.age}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                        <StatusIcon size={11} />
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#888888]">{patient.diagnosis}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#888888]">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        <span>Last visit: {patient.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>Follow-up due: {patient.scheduledFollowUp}</span>
                      </div>
                      {patient.tokenBooked && (
                        <div className="flex items-center gap-1">
                          <Ticket size={13} />
                          <span>Token #{patient.tokenBooked}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    id={`btn-view-prescription-${patient.id}`}
                    className="flex h-8 items-center gap-1.5 rounded-full bg-[#fafafa] border border-[#ebebeb] px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    View Prescription
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
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Follow-ups
          </h1>
          <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Patients with a scheduled follow-up date from their last prescription.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#ebebeb] bg-[#fafafa] px-4 py-2 dark:border-white/10 dark:bg-[#171717]">
            <History size={14} className="text-[#888888]" />
            <span className="text-[13px] text-[#888888]">{followUps.length} scheduled</span>
          </div>
        </div>
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="flex items-center gap-3 rounded-[12px] border border-[#f7d4d6] bg-[#f7d4d6]/40 px-5 py-4 dark:border-[#ee0000]/20 dark:bg-[#ee0000]/10">
          <AlertCircle size={16} className="shrink-0 text-[#ee0000] dark:text-[#ff4d4d]" />
          <p className="text-[14px] text-[#ee0000] dark:text-[#ff4d4d]">
            <span className="font-medium">{overdue.length} patient{overdue.length > 1 ? "s" : ""} overdue</span>
            {" "}— scheduled follow-up date has passed without a new booking.
          </p>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Token Booked", count: booked.length, bg: "bg-[#d3e5ff]/50 dark:bg-[#0070f3]/10", text: "text-[#0761d1] dark:text-[#50e3c2]" },
          { label: "Pending",      count: notBooked.length, bg: "bg-[#fafafa] dark:bg-[#171717]", text: "text-[#888888]" },
          { label: "Overdue",      count: overdue.length, bg: "bg-[#f7d4d6]/50 dark:bg-[#ee0000]/10", text: "text-[#ee0000] dark:text-[#ff4d4d]" },
        ].map(s => (
          <div key={s.label} className={`flex flex-col gap-1 rounded-[12px] border border-[#ebebeb] p-5 dark:border-white/10 ${s.bg}`}>
            <p className={`text-[28px] font-semibold tracking-[-1.28px] leading-none ${s.text}`}>{s.count}</p>
            <p className="text-[13px] text-[#888888]">{s.label}</p>
          </div>
        ))}
      </div>

      {renderGroup("Overdue — Missed Follow-up", overdue)}
      {renderGroup("Upcoming — Token Booked", booked)}
      {renderGroup("Upcoming — Not Yet Booked", notBooked)}
    </div>
  )
}

export default DoctorFollowUps
