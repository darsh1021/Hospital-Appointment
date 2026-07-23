import { Clock, Users, Ticket, AlertCircle, History } from "lucide-react"

const PatientOverview = () => {
  // Simulating state for demonstration purposes
  const hasActiveToken = true;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          Overview
        </h1>
        <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Track your live queue status and manage your digital tokens.
        </p>
      </div>

      {hasActiveToken ? (
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
          {/* Status Banner */}
          <div className="bg-[#d3e5ff] px-6 py-3 dark:bg-[#0070f3]/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#0761d1] dark:text-[#50e3c2]" />
            <span className="text-[14px] font-medium text-[#0761d1] dark:text-[#50e3c2]">
              You have an active token for today. Please arrive near the estimated time.
            </span>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Token Info */}
              <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] bg-[#fafafa] w-full md:w-1/3 py-8 dark:border-white/10 dark:bg-[#171717]">
                <span className="font-mono text-[13px] uppercase text-[#888888]">Your Token</span>
                <span className="text-[64px] font-semibold tracking-[-2.4px] text-[#171717] leading-none mt-2 dark:text-white">
                  #42
                </span>
                <span className="mt-3 inline-flex items-center rounded-full bg-white border border-[#ebebeb] px-3 py-1 text-[12px] font-medium text-[#171717] dark:bg-white/5 dark:border-white/10 dark:text-white">
                  General Consultation
                </span>
              </div>

              {/* Live Tracker */}
              <div className="grid grid-cols-2 gap-6 w-full md:w-2/3">
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-[14px] text-[#888888]">
                    <Ticket size={16} /> Currently Serving
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">#39</span>
                    <span className="flex items-center gap-1.5 rounded-full bg-[#f7d4d6] px-2 py-0.5 text-[11px] font-medium text-[#ee0000] dark:bg-[#ee0000]/20 dark:text-[#ff4d4d]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ee0000] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ee0000]"></span>
                      </span>
                      LIVE
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-[14px] text-[#888888]">
                    <Users size={16} /> Waiting Ahead
                  </span>
                  <span className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">2</span>
                </div>

                <div className="flex flex-col gap-2 col-span-2 mt-2">
                  <span className="flex items-center gap-2 text-[14px] text-[#888888]">
                    <Clock size={16} /> Est. Wait Time (Rolling Avg)
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] leading-none dark:text-white">~25</span>
                    <span className="text-[16px] font-medium text-[#888888] pb-1">minutes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-[#ebebeb] pt-6 dark:border-white/30">
               <span className="text-[13px] text-[#888888]">
                 * Please reach the clinic within 15 minutes of receiving the notification.
               </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] bg-white px-6 py-16 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] text-center dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fafafa] mb-6 dark:bg-[#171717]">
            <Ticket className="h-8 w-8 text-[#171717] dark:text-white" />
          </div>
          <h2 className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717] dark:text-white">
            Get a Digital Token
          </h2>
          <p className="mt-3 text-[16px] text-[#4d4d4d] max-w-md dark:text-[#888888]">
            Join the live queue from home and track your wait time in real-time. No need to wait in the clinic.
          </p>
          <div className="mt-6 flex flex-col gap-2 w-full max-w-xs text-[14px]">
             <div className="flex justify-between border-b border-[#ebebeb] pb-2 dark:border-white/10">
                <span className="text-[#888888]">New Consultation</span>
                <span className="font-medium text-[#171717] dark:text-white">₹400</span>
             </div>
             <div className="flex justify-between py-2">
                <span className="text-[#888888]">Follow-up (Return Visit)</span>
                <span className="font-medium text-[#171717] dark:text-white">₹200</span>
             </div>
          </div>
          <button className="mt-8 flex h-12 items-center justify-center rounded-full bg-[#171717] px-8 text-[16px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90">
            Book Token Now
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-[#171717] dark:text-white" />
          <h2 className="text-[20px] font-semibold tracking-[-0.6px] text-[#171717] dark:text-white">
            Recent Visits
          </h2>
        </div>
        <div className="flex flex-col gap-0">
          {[
            { date: "Oct 10, 2026", type: "Follow-up", doctor: "Dr. Sarah Jenkins", status: "Completed" },
            { date: "Sep 28, 2026", type: "New Consultation", doctor: "Dr. Robert Chen", status: "Completed" },
          ].map((visit, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-[#ebebeb] py-4 last:border-0 dark:border-white/10">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-medium text-[#171717] dark:text-white">{visit.type}</span>
                <span className="text-[13px] text-[#888888]">{visit.doctor}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[13px] text-[#171717] dark:text-white">{visit.date}</span>
                 <span className="inline-flex items-center rounded-full bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#888888] dark:bg-white/5">
                   {visit.status}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientOverview
