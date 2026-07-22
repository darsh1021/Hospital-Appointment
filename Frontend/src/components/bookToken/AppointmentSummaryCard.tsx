// import React from "react"

const AppointmentSummaryCard = () => {
  return (
    <div className="w-full max-w-sm rounded-3xl bg-[#F8F9F3] p-4 text-[#1A1A1A] shadow-xl">
      {/* Top Header */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B45F3D] mb-1">Your Token</p>
        <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">You're in the queue</h1>
      </div>

      {/* Token Card */}
      <div className="relative mb-4 rounded-3xl bg-[#1A423B] p-4 text-white overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8D1CE]">Token</p>
          <span className="rounded-full bg-[#3D635D] px-2 py-0.5 text-[10px] font-semibold text-white">Waiting</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter mb-2">014</h2>
        
        {/* Dashed Separator */}
        <div className="border-t border-dashed border-[#3D635D] pt-2 flex justify-between text-[11px]">
            <div>
                <p className="text-[#C8D1CE] mb-0.5">Now serving</p>
                <p className="font-semibold text-base">009</p>
            </div>
            <div>
                <p className="text-[#C8D1CE] mb-0.5">Your turn in</p>
                <p className="font-semibold text-base">~48 min</p>
            </div>
            <div>
                <p className="text-[#C8D1CE] mb-0.5">Patients ahead</p>
                <p className="font-semibold text-base">4</p>
            </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="rounded-3xl bg-white p-4 border border-[#E9E9E9]">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">Queue progress</h3>
            <span className="text-[10px] text-[#5D5D5D]">updates live</span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 mb-3">
            {[1,2,3,4,5].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 5 ? "bg-[#B45F3D]" : "bg-[#E9E9E9]"}`}></div>
            ))}
        </div>

        <div className="rounded-xl bg-[#F0F4F2] p-3 mb-3 flex gap-2 text-[11px]">
            <span className="text-lg">ℹ️</span>
            <p className="text-[#1A1A1A]">4 patients ahead of you. Feel free to run errands nearby.</p>
        </div>

        <div className="space-y-2 text-[11px] text-[#5D5D5D]">
            <div className="flex justify-between">
                <p>Doctor's avg. time</p>
                <p className="font-bold text-[#1A1A1A]">12 min</p>
            </div>
            <div className="flex justify-between">
                <p>Visit type</p>
                <p className="font-bold text-[#1A1A1A]">New patient · ₹400</p>
            </div>
            <div className="flex justify-between">
                <p>Registered via</p>
                <p className="font-bold text-[#1A1A1A]">Online booking</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentSummaryCard
