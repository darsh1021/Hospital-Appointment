import { UserPlus, Clock, Ticket, CalendarDays, Phone } from "lucide-react"

type WalkInEntry = {
  id: number
  token: number
  name: string
  age: number
  phone: string
  fee: number
  visitType: "New Consultation" | "Follow-up"
  registeredAt: string
  status: "waiting" | "serving" | "completed"
}

const walkIns: WalkInEntry[] = [
  { id: 1, token: 41, name: "Anita Desai",    age: 52, phone: "+91 98100 11223", fee: 200, visitType: "Follow-up",        registeredAt: "11:15 AM", status: "waiting" },
  { id: 2, token: 43, name: "Rahul Mehta",    age: 28, phone: "+91 97200 33445", fee: 400, visitType: "New Consultation",  registeredAt: "11:32 AM", status: "waiting" },
  { id: 3, token: 47, name: "Geeta Iyer",     age: 65, phone: "+91 94300 55667", fee: 400, visitType: "New Consultation",  registeredAt: "12:05 PM", status: "waiting" },
  { id: 4, token: 38, name: "Vijay Nambiar",  age: 44, phone: "+91 99100 77889", fee: 200, visitType: "Follow-up",        registeredAt: "10:50 AM", status: "serving" },
  { id: 5, token: 36, name: "Lakshmi Rao",    age: 31, phone: "+91 98200 99001", fee: 400, visitType: "New Consultation",  registeredAt: "10:20 AM", status: "completed" },
]

const statusConfig = {
  serving:   { label: "Serving",   bg: "bg-[#d3e5ff] dark:bg-[#0070f3]/20",   text: "text-[#0761d1] dark:text-[#50e3c2]" },
  waiting:   { label: "Waiting",   bg: "bg-[#fafafa] dark:bg-white/5",         text: "text-[#888888]" },
  completed: { label: "Done",      bg: "bg-[#fafafa] dark:bg-white/5",         text: "text-[#888888]" },
}

const ReceptionWalkIn = () => {
  const active    = walkIns.filter(p => p.status !== "completed")
  const completed = walkIns.filter(p => p.status === "completed")

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Walk-in Patients
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Patients registered in person at reception today.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3 sm:gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#ebebeb] bg-[#fafafa] px-4 py-2 dark:border-white/10 dark:bg-[#171717]">
            <UserPlus size={14} className="text-[#888888]" />
            <span className="text-[13px] text-[#888888]">{active.length} active</span>
          </div>
          <button
            id="btn-new-walkin"
            className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
          >
            <UserPlus size={15} />
            New
          </button>
        </div>
      </div>

      {/* Active */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Active Walk-ins</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {active.map(patient => {
            const sc = statusConfig[patient.status]
            return (
              <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 md:p-6">
                <div className="flex items-start gap-3 md:gap-4 min-w-0">
                  {/* Token badge */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                    <span className="font-mono text-[12px] font-semibold text-[#171717] dark:text-white">#{patient.token}</span>
                  </div>
                  {/* Info */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[14px] md:text-[15px] font-medium text-[#171717] dark:text-white">{patient.name}, {patient.age}</h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-[12px] md:text-[13px] text-[#888888]">{patient.visitType} · ₹{patient.fee}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#888888]">
                      <div className="flex items-center gap-1">
                        <Phone size={12} />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Registered {patient.registeredAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                  <button
                    id={`btn-view-token-${patient.token}`}
                    className="flex h-8 items-center gap-1.5 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <Ticket size={12} />
                    View Token
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
            <h2 className="font-mono text-[12px] uppercase text-[#888888]">Completed Today</h2>
          </div>
          <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
            {completed.map(patient => (
              <div key={patient.id} className="flex items-center justify-between px-5 md:px-6 py-4 opacity-60">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[12px] text-[#888888] shrink-0">#{patient.token}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] md:text-[14px] font-medium text-[#171717] dark:text-white truncate">{patient.name}</p>
                    <p className="text-[12px] text-[#888888]">{patient.visitType} · <span className="flex items-center gap-1 inline-flex"><CalendarDays size={11} />{patient.registeredAt}</span></p>
                  </div>
                </div>
                <span className="text-[12px] font-mono text-[#171717] dark:text-white shrink-0">₹{patient.fee}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceptionWalkIn
