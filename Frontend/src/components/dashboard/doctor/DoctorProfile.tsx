import { User, Stethoscope, Clock, CalendarDays, CheckCircle2, XCircle, TrendingUp, Mail, Phone } from "lucide-react"

const doctor = {
  name: "Dr. Sarah Jenkins",
  specialisation: "Dermatology & Skin Care",
  email: "s.jenkins@clearskin.clinic",
  phone: "+91 98765 00000",
  qualification: "MBBS, MD (Dermatology)",
  experience: "12 years",
  sessionStart: "11:00 AM",
  sessionEnd: "6:00 PM",
}

const todayStats = {
  servedToday: 14,
  noShows: 2,
  avgMinutes: 12,
  remaining: 9,
  totalCapacity: 25,
}

const recentActivity = [
  { token: 41, name: "Arjun Singh",  type: "New Consultation", status: "completed" as const, time: "2:45 PM" },
  { token: 40, name: "Suresh Kumar", type: "New Consultation", status: "no-show" as const,   time: "2:30 PM" },
  { token: 39, name: "Deepa Nair",   type: "Follow-up",        status: "completed" as const, time: "2:15 PM" },
  { token: 38, name: "Kiran Reddy",  type: "New Consultation", status: "completed" as const, time: "2:00 PM" },
]

const DoctorProfile = () => {
  const progressPct = Math.round((todayStats.servedToday / todayStats.totalCapacity) * 100)

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          My Profile
        </h1>
        <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Your clinic profile and today's session summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* ── Left: Profile card ── */}
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
          {/* Avatar */}
          <div className="flex flex-col items-center px-6 pt-8 pb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-[#171717]">
              <User size={36} className="text-[#888888]" />
            </div>
            <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.6px] text-[#171717] dark:text-white">
              {doctor.name}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#888888]">
              <Stethoscope size={13} />
              <span>{doctor.specialisation}</span>
            </div>
            <span className="mt-3 inline-flex items-center rounded-full bg-[#fafafa] border border-[#ebebeb] px-3 py-1 text-[12px] font-medium text-[#171717] dark:bg-white/5 dark:border-white/10 dark:text-white">
              {doctor.qualification}
            </span>
          </div>

          {/* Info rows */}
          <div className="flex flex-col border-t border-[#ebebeb] dark:border-white/10">
            {[
              { icon: Mail,         label: "Email",       value: doctor.email },
              { icon: Phone,        label: "Phone",       value: doctor.phone },
              { icon: TrendingUp,   label: "Experience",  value: doctor.experience },
              { icon: Clock,        label: "Session",     value: `${doctor.sessionStart} – ${doctor.sessionEnd}` },
              { icon: CalendarDays, label: "Today",       value: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 border-b border-[#ebebeb] px-6 py-3 last:border-0 dark:border-white/10">
                <row.icon size={15} className="mt-0.5 shrink-0 text-[#888888]" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] uppercase text-[#888888]">{row.label}</span>
                  <span className="text-[13px] text-[#171717] dark:text-white break-all">{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Stats + Activity ── */}
        <div className="flex flex-col gap-6">
          {/* Session progress */}
          <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[12px] uppercase text-[#888888]">Today's Session Progress</h3>
              <span className="text-[13px] text-[#888888]">
                {todayStats.servedToday} / {todayStats.totalCapacity} patients
              </span>
            </div>
            <div className="w-full rounded-full bg-[#fafafa] border border-[#ebebeb] h-2.5 dark:bg-[#171717] dark:border-white/10">
              <div
                className="h-full rounded-full bg-[#171717] dark:bg-white transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-[#888888]">{progressPct}% of estimated daily capacity</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Seen Today",       value: todayStats.servedToday,  icon: CheckCircle2, color: "text-[#0070f3]" },
              { label: "No-shows",         value: todayStats.noShows,      icon: XCircle,      color: "text-[#ee0000]" },
              { label: "Avg. Consult",     value: `${todayStats.avgMinutes}m`, icon: TrendingUp, color: "text-[#171717] dark:text-white" },
              { label: "Still in Queue",   value: todayStats.remaining,    icon: User,         color: "text-[#171717] dark:text-white" },
            ].map(stat => (
              <div
                key={stat.label}
                className="flex flex-col gap-3 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-5 dark:border-white/10 dark:bg-[#171717]"
              >
                <stat.icon size={18} className={stat.color} />
                <div>
                  <p className="text-[26px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[12px] text-[#888888]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
            <div className="border-b border-[#ebebeb] px-6 py-4 dark:border-white/10">
              <h3 className="font-mono text-[12px] uppercase text-[#888888]">Recent Activity</h3>
            </div>
            <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
              {recentActivity.map(a => (
                <div key={a.token} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] text-[#888888]">#{a.token}</span>
                    <div>
                      <p className="text-[13px] font-medium text-[#171717] dark:text-white">{a.name}</p>
                      <p className="text-[12px] text-[#888888]">{a.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[#888888]">{a.time}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      a.status === "completed"
                        ? "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                        : "bg-[#f7d4d6] text-[#ee0000] dark:bg-[#ee0000]/20 dark:text-[#ff4d4d]"
                    }`}>
                      {a.status === "completed" ? "Done" : "No-show"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
