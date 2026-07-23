import { CalendarDays, Clock, MapPin, Ticket, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react"

const appointments = [
  { id: 1, doctor: "Dr. Sarah Jenkins", spec: "Dermatologist", date: "Today", time: "11:15 AM", status: "confirmed", token: 42, type: "General Consultation" },
  { id: 2, doctor: "Dr. Robert Chen", spec: "Cosmetologist", date: "Oct 30, 2026", time: "2:30 PM", status: "upcoming", token: null, type: "Follow-up" },
  { id: 3, doctor: "Dr. Sarah Jenkins", spec: "Dermatologist", date: "Sep 28, 2026", time: "10:00 AM", status: "completed", token: 12, type: "General Consultation" },
]

const PatientAppointments = () => {
  const active = appointments.filter(a => a.status !== "completed")
  const past = appointments.filter(a => a.status === "completed")

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Appointments
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage upcoming visits. Missed your appointment? Visit the clinic tomorrow to carry over your token.
          </p>
        </div>
        <button
          id="btn-new-appointment"
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <CalendarDays size={15} />
          New Appointment
        </button>
      </div>

      {/* Active Appointments */}
      <div className="flex flex-col gap-4">
        <h2 className="font-mono text-[12px] uppercase text-[#888888] pl-1">Upcoming</h2>
        {active.map((apt) => (
          <div
            key={apt.id}
            className={`flex flex-col md:flex-row gap-4 md:gap-6 rounded-[12px] border bg-white p-5 md:p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:bg-[#0a0a0a] ${
              apt.status === "confirmed" ? "border-[#d3e5ff] dark:border-[#0070f3]/30" : "border-[#ebebeb] dark:border-white/10"
            }`}
          >
            {/* Date/Time Block */}
            <div className={`flex flex-col items-center justify-center rounded-[8px] min-w-[100px] py-4 px-2 border ${
              apt.status === "confirmed" 
                ? "bg-[#d3e5ff]/30 border-[#d3e5ff] dark:bg-[#0070f3]/10 dark:border-[#0070f3]/20" 
                : "bg-[#fafafa] border-[#ebebeb] dark:bg-[#171717] dark:border-white/10"
            }`}>
              <span className={`text-[12px] font-medium uppercase ${apt.status === "confirmed" ? "text-[#0761d1] dark:text-[#50e3c2]" : "text-[#888888]"}`}>
                {apt.date}
              </span>
              <span className={`text-[18px] font-semibold mt-0.5 leading-none ${apt.status === "confirmed" ? "text-[#0761d1] dark:text-[#50e3c2]" : "text-[#171717] dark:text-white"}`}>
                {apt.time}
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[16px] md:text-[18px] font-semibold tracking-[-0.32px] text-[#171717] dark:text-white">
                  {apt.doctor}
                </h3>
                {apt.status === "confirmed" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#d3e5ff]/50 px-2 py-0.5 text-[11px] font-medium text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]">
                    <CheckCircle2 size={10} /> Confirmed
                  </span>
                )}
              </div>
              <p className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">{apt.type}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[13px] text-[#888888]">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  <span>Clearskin Clinic, Main Branch</span>
                </div>
                {apt.token && (
                  <div className="flex items-center gap-1.5 font-medium text-[#171717] dark:text-white">
                    <Ticket size={13} />
                    <span>Token #{apt.token}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col items-center justify-end gap-2 border-t md:border-t-0 md:border-l border-[#ebebeb] pt-4 md:pt-0 md:pl-6 dark:border-white/10 shrink-0">
              <button className="w-full md:w-auto h-9 rounded-full bg-[#171717] px-5 text-[13px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Appointments */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Past Appointments</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {past.map(apt => (
            <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-6 py-4 opacity-70">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                  <CalendarDays size={16} className="text-[#888888]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] md:text-[15px] font-medium text-[#171717] dark:text-white truncate">
                    {apt.doctor} <span className="text-[#888888] font-normal">— {apt.type}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[12px] text-[#888888]">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{apt.date} · {apt.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="flex h-8 items-center gap-1.5 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  View Summary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientAppointments
