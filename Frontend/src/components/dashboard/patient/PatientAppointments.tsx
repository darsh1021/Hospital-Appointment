import { Ticket, CalendarDays, History } from "lucide-react"

const PatientAppointments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Tokens & Visits
          </h1>
          <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage your digital tokens and view your visit history.
          </p>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-full bg-[#171717] px-4 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90">
          Get Digital Token
        </button>
      </div>

      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-6 py-4 flex justify-between items-center dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Active Token (Today)</h2>
          <span className="flex h-2 w-2 rounded-full bg-[#50e3c2] shadow-[0_0_8px_#50e3c2]"></span>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {/* Active Token Item */}
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                <Ticket className="h-6 w-6 text-[#171717] dark:text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-semibold text-[#171717] dark:text-white">Token #42</h3>
                  <span className="inline-flex items-center rounded-full bg-[#d3e5ff] px-2 py-0.5 text-[12px] font-medium text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]">
                    Estimated Wait: ~25 mins
                  </span>
                </div>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">Follow-up Consultation • Dr. Sarah Jenkins</p>
                <div className="mt-1 flex items-center gap-4 text-[13px] text-[#888888]">
                  <div className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    <span>Today, Oct 24, 2026</span>
                  </div>
                  <span className="font-medium text-[#171717] dark:text-white">Fee: ₹200 (Discount Applied)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-2">
              <button className="flex h-8 items-center justify-center rounded-full border border-[#ebebeb] px-4 text-[13px] text-[#171717] transition hover:bg-[#fafafa] dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                View Tracker
              </button>
              <span className="text-[11px] text-[#888888]">
                Contact reception to cancel
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Past Visits & History</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {/* Past Visit Item */}
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4 opacity-80">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] dark:bg-white/5">
                <History className="h-5 w-5 text-[#888888]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[16px] font-medium text-[#171717] dark:text-white">Dr. Robert Chen</h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">New Consultation • Token #18</p>
                <div className="mt-1 flex items-center gap-4 text-[13px] text-[#888888]">
                  <div className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    <span>Sep 28, 2026</span>
                  </div>
                  <span>Fee: ₹400</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex h-8 items-center justify-center rounded-full bg-[#fafafa] px-3 text-[13px] text-[#171717] transition hover:bg-[#ebebeb] dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                Prescription
              </button>
              <button className="flex h-8 items-center justify-center rounded-full border border-[#ebebeb] px-3 text-[13px] text-[#171717] transition hover:bg-[#fafafa] dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAppointments
