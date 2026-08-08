import {
  Users, Ticket,  XCircle, Clock, TrendingUp, UserPlus,
  ListOrdered, ChevronRight, AlertCircle,
} from "lucide-react"

const stats = {
  registeredToday: 23,
  onlineBookings: 14,
  walkIns: 9,
  noShows: 2,
  avgWait: 18,
  currentToken: 39,
  totalInQueue: 7,
}

const upNext = [
  { token: 40, name: "Suresh Kumar",   type: "New Consultation", fee: 400, source: "online" },
  { token: 41, name: "Anita Desai",    type: "Follow-up",        fee: 200, source: "walk-in" },
  { token: 42, name: "Priya Sharma",   type: "Follow-up",        fee: 200, source: "online" },
  { token: 43, name: "Rahul Mehta",    type: "New Consultation", fee: 400, source: "walk-in" },
]

const ReceptionOverview = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Overview
          </h1>
          <p className="mt-1 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Today's queue at a glance. Register walk-ins or manage the live queue.
          </p>
        </div>
        <button
          id="btn-register-walkin"
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90"
        >
          <UserPlus size={16} />
          Register Walk-in
        </button>
      </div>

      {/* Live status banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[12px] border border-[#d3e5ff] bg-[#d3e5ff]/50 px-5 py-4 dark:border-[#0070f3]/20 dark:bg-[#0070f3]/10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0761d1] opacity-75 dark:bg-[#50e3c2]" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0761d1] dark:bg-[#50e3c2]" />
          </span>
          <span className="text-[14px] font-medium text-[#0761d1] dark:text-[#50e3c2]">
            Doctor is currently serving Token #{stats.currentToken}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-[#0761d1] dark:text-[#50e3c2]">
          <Clock size={13} />
          <span>~{stats.avgWait} min avg. wait</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {[
          { label: "Registered Today", value: stats.registeredToday, icon: Users,        color: "text-[#171717] dark:text-white" },
          { label: "Online Bookings",  value: stats.onlineBookings,  icon: Ticket,       color: "text-[#0070f3]" },
          { label: "Walk-ins",         value: stats.walkIns,         icon: UserPlus,     color: "text-[#171717] dark:text-white" },
          { label: "No-shows",         value: stats.noShows,         icon: XCircle,      color: "text-[#ee0000]" },
          { label: "Avg. Wait",        value: `${stats.avgWait}m`,   icon: Clock,        color: "text-[#171717] dark:text-white" },
          { label: "In Queue",         value: stats.totalInQueue,    icon: ListOrdered,  color: "text-[#171717] dark:text-white" },
        ].map(stat => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 md:gap-3 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <stat.icon size={16} className={`shrink-0 ${stat.color}`} />
            <div>
              <p className="text-[22px] md:text-[26px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white leading-none">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] md:text-[12px] text-[#888888] leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Online vs Walk-in bar */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white p-5 md:p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-[12px] uppercase text-[#888888]">Online vs Walk-in Split</h3>
          <span className="text-[13px] text-[#888888]">{stats.registeredToday} total</span>
        </div>
        <div className="flex rounded-full overflow-hidden h-2.5 bg-[#ebebeb] dark:bg-white/10">
          <div
            className="h-full bg-[#171717] dark:bg-white transition-all"
            style={{ width: `${Math.round((stats.onlineBookings / stats.registeredToday) * 100)}%` }}
          />
          <div className="h-full bg-[#888888] flex-1" />
        </div>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#171717] dark:bg-white" />
            <span className="text-[12px] text-[#888888]">Online — {stats.onlineBookings}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#888888]" />
            <span className="text-[12px] text-[#888888]">Walk-in — {stats.walkIns}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <TrendingUp size={13} className="text-[#888888]" />
            <span className="text-[12px] text-[#888888]">Cap: 70% online</span>
          </div>
        </div>
      </div>

      {/* Up-next queue preview */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center justify-between dark:border-white/10">
          <div className="flex items-center gap-2">
            <ListOrdered size={15} className="text-[#888888]" />
            <h2 className="font-mono text-[12px] uppercase text-[#888888]">Coming Up</h2>
          </div>
          <span className="text-[13px] text-[#888888]">{stats.totalInQueue} in queue</span>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {upNext.map(patient => (
            <div key={patient.token} className="flex items-center justify-between px-5 md:px-6 py-4">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <span className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] font-mono text-[12px] font-medium text-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-white">
                  #{patient.token}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] md:text-[14px] font-medium text-[#171717] dark:text-white truncate">{patient.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <p className="text-[11px] md:text-[12px] text-[#888888]">{patient.type}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      patient.source === "online"
                        ? "bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]"
                        : "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                    }`}>
                      {patient.source}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:block text-[13px] font-mono text-[#171717] dark:text-white">₹{patient.fee}</span>
                <ChevronRight size={15} className="text-[#888888]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fairness note */}
      <div className="flex items-start gap-3 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-4 md:p-5 dark:border-white/10 dark:bg-[#171717]">
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#888888]" />
        <p className="text-[12px] md:text-[13px] text-[#888888]">
          Online booking cap is set to <span className="font-medium text-[#171717] dark:text-white">60–70%</span> of daily capacity.
          Walk-in spots are always reserved so in-person patients are never turned away.
        </p>
      </div>
    </div>
  )
}

export default ReceptionOverview
