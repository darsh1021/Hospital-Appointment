import { useState, useEffect } from "react"
import { User, CalendarDays, Activity } from "lucide-react"

const PATIENTS = [
  { name: "Priya K.", wait: "~4m" },
  { name: "Rohit S.", wait: "~8m" },
  { name: "Divya P.", wait: "~12m" },
]

const AppointmentSummaryCard = () => {
  const [patient, setPatient] = useState(PATIENTS[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setPatient((prev) => {
          const currentIndex = PATIENTS.indexOf(prev)
          return PATIENTS[(currentIndex + 1) % PATIENTS.length]
        })
        setIsAnimating(false)
      }, 500)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Current Session</h2>
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <Activity size={20} />
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl bg-zinc-100 dark:bg-white/5 p-4 border border-zinc-200 dark:border-white/5">
          <p className="text-xs text-zinc-500 dark:text-white/50 mb-1">Active Patient</p>
          <p className="text-xl font-semibold text-zinc-900 dark:text-white">#38</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 dark:bg-white/5 p-4 border border-zinc-200 dark:border-white/5">
          <p className="text-xs text-zinc-500 dark:text-white/50 mb-1">Wait Time</p>
          <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">Now</p>
        </div>
      </div>

      {/* Upcoming */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-zinc-500 dark:text-white/50 px-1">Upcoming</p>
        <div
          className={`flex items-center gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <User size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900 dark:text-white">{patient.name}</p>
            <p className="text-xs text-zinc-500 dark:text-white/50">Next in line</p>
          </div>
          <p className="text-xs font-mono text-zinc-600 dark:text-white/70">{patient.wait}</p>
        </div>
      </div>
      
      {/* Footer Button */}
      <button className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
        <CalendarDays size={16} />
        View Full Schedule
      </button>
    </div>
  )
}

export default AppointmentSummaryCard
