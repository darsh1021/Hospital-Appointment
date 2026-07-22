import { CalendarDays, ArrowRight } from "lucide-react"

const AppointmentSummaryCard = () => {
  const scrollToForm = () => {
    const element = document.getElementById("booking-form")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0a0a0f] border border-zinc-200 dark:border-white/10 p-4 shadow-xl">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B45F3D] dark:text-emerald-400 mb-1">Your Token</p>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">You're in the queue</h1>
      </div>

      {/* Token Card */}
      <div className="relative mb-4 rounded-3xl bg-[#1A423B] p-4 text-white overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8D1CE]">Token</p>
          <span className="rounded-full bg-[#3D635D] px-2 py-0.5 text-[10px] font-semibold text-white">Waiting</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter mb-2">014</h2>
        
        {/* Dashed Separator */}
        <div className="border-t border-dashed border-[#3D635D] pt-2 flex justify-between text-[11px] text-[#C8D1CE]">
            <div>
                <p className="mb-0.5">Now serving</p>
                <p className="font-semibold text-base text-white">009</p>
            </div>
            <div>
                <p className="mb-0.5">Your turn in</p>
                <p className="font-semibold text-base text-white">~48 min</p>
            </div>
            <div>
                <p className="mb-0.5">Patients ahead</p>
                <p className="font-semibold text-base text-white">4</p>
            </div>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="rounded-3xl bg-zinc-50 dark:bg-white/5 p-4 border border-zinc-100 dark:border-white/5">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Queue progress</h3>
            <span className="text-[10px] text-zinc-500 dark:text-white/50">updates live</span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 mb-4">
            {[1,2,3,4,5].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 5 ? "bg-[#B45F3D] dark:bg-emerald-500" : "bg-zinc-200 dark:bg-white/10"}`}></div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={scrollToForm}
                className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-700"
            >
                Get Token
                <ArrowRight size={12} />
            </button>
            <button className="flex items-center justify-center gap-1 rounded-xl bg-zinc-200 dark:bg-white/10 py-2 text-[11px] font-semibold text-zinc-900 dark:text-white transition hover:bg-zinc-300 dark:hover:bg-white/20">
                <CalendarDays size={12} />
                Schedule
            </button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentSummaryCard
