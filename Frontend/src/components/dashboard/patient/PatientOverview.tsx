import { Clock, Users, Ticket, AlertCircle, History, ChevronRight } from "lucide-react"

const PatientOverview = () => {
  const hasActiveToken = true;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Overview
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Track your live queue status and manage your digital tokens.
          </p>
        </div>
        <button
          id="btn-book-appointment"
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <Ticket size={15} />
          Book Appointment
        </button>
      </div>

      {hasActiveToken ? (
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
          {/* Status Banner */}
          <div className="bg-[#d3e5ff]/50 px-5 md:px-6 py-3.5 dark:bg-[#0070f3]/10 flex items-start sm:items-center gap-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0 text-[#0761d1] dark:text-[#50e3c2]" />
            <span className="text-[13px] md:text-[14px] font-medium text-[#0761d1] dark:text-[#50e3c2]">
              You have an active token for today. Please arrive near the estimated time.
            </span>
          </div>

          <div className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              
              {/* Token Info */}
              <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] bg-[#fafafa] w-full md:w-1/3 py-8 px-4 dark:border-white/10 dark:bg-[#171717] text-center">
                <span className="font-mono text-[12px] uppercase text-[#888888]">Your Token</span>
                <span className="text-[56px] md:text-[64px] font-semibold tracking-[-2.4px] text-[#171717] leading-none mt-2 dark:text-white">
                  #42
                </span>
                <span className="mt-4 inline-flex items-center rounded-full bg-white border border-[#ebebeb] px-3 py-1 text-[12px] font-medium text-[#171717] dark:bg-white/5 dark:border-white/10 dark:text-white">
                  General Consultation
                </span>
              </div>

              {/* Live Tracker */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 w-full md:w-2/3">
                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 dark:border-white/10 dark:bg-[#0a0a0a]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <Ticket size={14} /> Serving
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] leading-none dark:text-white">#39</span>
                    <span className="flex items-center gap-1.5 rounded-full bg-[#f7d4d6]/50 px-2 py-0.5 text-[11px] font-medium text-[#ee0000] dark:bg-[#ee0000]/10 dark:text-[#ff4d4d]">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ee0000] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ee0000]"></span>
                      </span>
                      LIVE
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 dark:border-white/10 dark:bg-[#0a0a0a]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <Users size={14} /> Ahead of you
                  </span>
                  <span className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] leading-none mt-1 dark:text-white">2</span>
                </div>

                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 dark:border-white/10 dark:bg-[#0a0a0a]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <Clock size={14} /> Est. Wait Time
                  </span>
                  <span className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] leading-none mt-1 dark:text-white">~35m</span>
                </div>

                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-4 md:p-5 dark:border-white/10 dark:bg-[#171717]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <AlertCircle size={14} /> Token Status
                  </span>
                  <span className="text-[15px] font-medium text-[#171717] mt-1 dark:text-white">Confirmed</span>
                  <span className="text-[12px] text-[#888888] mt-0.5">Please arrive by 11:15 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] border-dashed bg-[#fafafa] py-16 px-6 text-center dark:border-white/10 dark:bg-[#171717]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#ebebeb] dark:bg-[#0a0a0a] dark:border-white/10">
            <Ticket className="h-5 w-5 text-[#888888]" />
          </div>
          <h3 className="mt-4 text-[16px] font-medium text-[#171717] dark:text-white">No active tokens</h3>
          <p className="mt-2 text-[14px] text-[#888888] max-w-sm">
            You don't have any appointments scheduled for today. Book a new appointment to join the queue.
          </p>
          <button className="mt-6 flex h-10 items-center justify-center gap-2 rounded-full bg-[#171717] px-6 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]">
            Book Appointment
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center gap-2 dark:border-white/10">
          <History size={15} className="text-[#888888]" />
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Recent Visits</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {[
            { date: "Oct 12, 2026", type: "Follow-up", doctor: "Dr. Sarah Jenkins", status: "Completed" },
            { date: "Sep 28, 2026", type: "New Consultation", doctor: "Dr. Sarah Jenkins", status: "Completed" },
          ].map((visit, idx) => (
            <div key={idx} className="flex items-center justify-between px-5 md:px-6 py-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                  <span className="font-mono text-[11px] text-[#888888]">OCT</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-[#171717] dark:text-white truncate">{visit.type}</p>
                  <p className="text-[12px] text-[#888888]">{visit.date} · {visit.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-flex rounded-full bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#888888] dark:bg-white/5">
                  {visit.status}
                </span>
                <ChevronRight size={15} className="text-[#888888]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientOverview
