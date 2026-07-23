import {
  Users, Stethoscope, TrendingUp, TrendingDown, IndianRupee,
  Clock, CalendarDays, BarChart3, CheckCircle2, XCircle,
} from "lucide-react"

const stats = {
  totalPatients: 1243,
  totalDoctors: 3,
  todayRegistered: 23,
  todayRevenue: 7800,
  avgConsultTime: 12,
  noShowRate: 8.7,
  onlineSplit: 61,
  walkInSplit: 39,
}

const weeklyData = [
  { day: "Mon", patients: 20, revenue: 7200 },
  { day: "Tue", patients: 25, revenue: 9000 },
  { day: "Wed", patients: 18, revenue: 6400 },
  { day: "Thu", patients: 23, revenue: 7800 },
  { day: "Fri", patients: 27, revenue: 9600 },
  { day: "Sat", patients: 15, revenue: 5200 },
]

const maxPatients = Math.max(...weeklyData.map(d => d.patients))

const recentAlerts = [
  { type: "warning", message: "Avg. consultation time up 2 min from last week." },
  { type: "info",    message: "No-show rate is within acceptable range (< 10%)." },
  { type: "success", message: "Online booking cap at 61% — walk-in slots are protected." },
]

const AdminOverview = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          Admin Overview
        </h1>
        <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Clinic-wide metrics, daily patterns, and operational health.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Patients",   value: stats.totalPatients.toLocaleString("en-IN"), icon: Users,         color: "text-[#171717] dark:text-white" },
          { label: "Doctors on Staff", value: stats.totalDoctors,                           icon: Stethoscope,   color: "text-[#171717] dark:text-white" },
          { label: "Today's Revenue",  value: `₹${stats.todayRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-[#0070f3]" },
          { label: "Registered Today", value: stats.todayRegistered,                        icon: CalendarDays,  color: "text-[#171717] dark:text-white" },
        ].map(stat => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 md:gap-3 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            <stat.icon size={16} className={stat.color} />
            <div>
              <p className="text-[22px] md:text-[28px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white leading-none">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] md:text-[12px] text-[#888888] leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Avg. Consult Time",  value: `${stats.avgConsultTime}m`,  icon: Clock,        trend: "up",     note: "+2m vs last week" },
          { label: "No-show Rate",       value: `${stats.noShowRate}%`,       icon: XCircle,      trend: "down",   note: "Within range (< 10%)" },
          { label: "Online Bookings",    value: `${stats.onlineSplit}%`,      icon: TrendingUp,   trend: "stable", note: "Cap: 70%" },
          { label: "Walk-in Split",      value: `${stats.walkInSplit}%`,      icon: Users,        trend: "stable", note: "Walk-in protected" },
        ].map(stat => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 md:gap-3 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-4 md:p-5 dark:border-white/10 dark:bg-[#171717]"
          >
            <stat.icon size={15} className="text-[#888888]" />
            <div>
              <p className="text-[20px] md:text-[24px] font-semibold tracking-[-0.96px] text-[#171717] dark:text-white leading-none">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] text-[#888888]">{stat.label}</p>
              <p className="text-[10px] md:text-[11px] text-[#888888] mt-0.5">{stat.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white p-5 md:p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#888888]" />
            <h3 className="font-mono text-[12px] uppercase text-[#888888]">Weekly Patient Volume</h3>
          </div>
          <span className="text-[13px] text-[#888888]">This week</span>
        </div>
        <div className="flex items-end justify-between gap-2 md:gap-4 h-32 md:h-40">
          {weeklyData.map(d => (
            <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex items-end justify-center" style={{ height: "100%" }}>
                <div
                  className="w-full max-w-[40px] rounded-t-[4px] bg-[#171717] dark:bg-white transition-all duration-500"
                  style={{ height: `${(d.patients / maxPatients) * 100}%`, minHeight: "4px" }}
                  title={`${d.day}: ${d.patients} patients · ₹${d.revenue.toLocaleString("en-IN")}`}
                />
              </div>
              <span className="font-mono text-[10px] md:text-[11px] text-[#888888]">{d.day}</span>
              <span className="text-[10px] md:text-[11px] font-medium text-[#171717] dark:text-white">{d.patients}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="flex flex-col gap-3">
        {recentAlerts.map((alert, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 rounded-[12px] border px-4 md:px-5 py-3.5 ${
              alert.type === "warning" ? "border-[#ffefcf] bg-[#ffefcf]/50 dark:border-[#f5a623]/20 dark:bg-[#f5a623]/10"
              : alert.type === "success" ? "border-[#d3e5ff] bg-[#d3e5ff]/30 dark:border-[#0070f3]/20 dark:bg-[#0070f3]/10"
              : "border-[#ebebeb] bg-[#fafafa] dark:border-white/10 dark:bg-[#171717]"
            }`}
          >
            {alert.type === "warning"  && <TrendingUp  size={14} className="shrink-0 mt-0.5 text-[#ab570a] dark:text-[#f5a623]" />}
            {alert.type === "success"  && <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-[#0070f3]" />}
            {alert.type === "info"     && <TrendingDown size={14} className="shrink-0 mt-0.5 text-[#888888]" />}
            <p className={`text-[12px] md:text-[13px] ${
              alert.type === "warning" ? "text-[#ab570a] dark:text-[#f5a623]"
              : alert.type === "success" ? "text-[#0761d1] dark:text-[#50e3c2]"
              : "text-[#4d4d4d] dark:text-[#888888]"
            }`}>{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOverview
