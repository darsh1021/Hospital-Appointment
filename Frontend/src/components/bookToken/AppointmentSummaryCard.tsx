import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

const AppointmentSummaryCard = () => {
  const [nowServing, setNowServing] = useState(9);
  const [patientsAhead, setPatientsAhead] = useState(4);
  const [timeRemaining, setTimeRemaining] = useState(48);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Show notification that a patient finished
      setShowNotification(true);
      
      setTimeout(() => {
        // 2. Start number animation and hide notification
        setShowNotification(false);
        setIsAnimating(true);
        
        setTimeout(() => {
          // 3. Update numbers and stop animation
          setNowServing(prev => prev + 1);
          setPatientsAhead(prev => (prev > 0 ? prev - 1 : 0));
          setTimeRemaining(prev => (prev > 12 ? prev - 12 : 0));
          setIsAnimating(false);
        }, 500); // Duration of sliding animation
      }, 3000); // Duration to show notification
    }, 12000); // Loop every 12 seconds for demo

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm rounded-[2rem] bg-white dark:bg-[#0a0a0f] border border-zinc-200 dark:border-white/10 p-4 md:p-5 shadow-2xl dark:shadow-none transition-colors duration-300">
      {/* Header */}
      <div className="mb-4 px-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D47151] dark:text-[#E88C71] mb-1.5">Your Token</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1.5 leading-tight">You're in the queue</h1>
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          We'll notify you as your turn gets close — no need to stand and wait.
        </p>
      </div>

      {/* Token Card */}
      <div className="relative mb-4 rounded-[1.25rem] bg-[#1A423B] dark:bg-[#15332d] p-4 text-white overflow-hidden shadow-xl transition-colors duration-300 border border-[#1A423B] dark:border-white/5">
        
        {/* Cutouts */}
        <div className="absolute top-[60%] -left-3 -translate-y-1/2 w-6 h-6 bg-white dark:bg-[#0a0a0f] rounded-full transition-colors duration-300 z-10"></div>
        <div className="absolute top-[60%] -right-3 -translate-y-1/2 w-6 h-6 bg-white dark:bg-[#0a0a0f] rounded-full transition-colors duration-300 z-10"></div>
        
        {/* Notification Overlay */}
        <div className={`absolute top-0 left-0 w-full p-2 bg-emerald-500/55 backdrop-blur-md z-20 flex items-center justify-center gap-1.5 transition-all duration-500 transform ${showNotification ? 'translate-y-0 opacity-100 shadow-md' : '-translate-y-full opacity-0'}`}>
          <CheckCircle2 size={14} className="text-white shrink-0 animate-pulse" />
          <span className="text-[13px] font-medium text-white truncate">Patient {nowServing.toString().padStart(3, '0')} finished</span>
        </div>

        <div className="flex justify-between items-start mb-2 relative z-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8ea8a1]">Token</p>
          <span className="rounded-full bg-white/15 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white/90">Waiting</span>
        </div>
        <h2 className="text-5xl font-bold tracking-tighter mb-3 relative z-0 leading-none">014</h2>
        
        {/* Dashed Separator */}
        <div className="border-t border-dashed border-white/20 pt-3 grid grid-cols-3 gap-2 relative z-0 mt-3">
            <div>
                <p className="mb-0.5 text-[10px] text-[#8ea8a1]">Now serving</p>
                <div className="h-5 overflow-hidden relative">
                    <div className={`flex flex-col transition-transform duration-500 ease-in-out ${isAnimating ? '-translate-y-1/2' : 'translate-y-0'}`}>
                        <p className="font-semibold text-[15px] text-white h-5 flex items-center">
                            {nowServing.toString().padStart(3, '0')}
                        </p>
                        <p className="font-semibold text-[15px] text-white h-5 flex items-center text-emerald-300">
                            {(nowServing + 1).toString().padStart(3, '0')}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <p className="mb-0.5 text-[10px] text-[#8ea8a1]">Your turn in</p>
                <div className="h-5 overflow-hidden relative">
                    <div className={`flex flex-col transition-transform duration-500 ease-in-out ${isAnimating ? '-translate-y-1/2' : 'translate-y-0'}`}>
                        <p className="font-semibold text-[15px] text-white h-5 flex items-center">
                            ~{timeRemaining} min
                        </p>
                        <p className="font-semibold text-[15px] text-white h-5 flex items-center text-emerald-300">
                            ~{Math.max(0, timeRemaining - 12)} min
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <p className="mb-0.5 text-[10px] text-[#8ea8a1]">Patients ahead</p>
                <div className="h-5 overflow-hidden relative">
                    <div className={`flex flex-col transition-transform duration-500 ease-in-out ${isAnimating ? '-translate-y-1/2' : 'translate-y-0'}`}>
                        <p className="font-semibold text-[15px] text-white h-5 flex items-center">
                            {patientsAhead}
                        </p>
                        <p className="font-semibold text-[15px] text-white h-5 flex items-center text-emerald-300">
                            {Math.max(0, patientsAhead - 1)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Progress & Details */}
      <div className="rounded-[1.25rem] bg-[#FAFAFA] dark:bg-[#111116] p-4 border border-zinc-100 dark:border-white/5 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[13px] text-zinc-900 dark:text-white">Queue progress</h3>
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">updates live</span>
        </div>

        {/* Progress Stepper */}
        <div className="relative mb-4 px-1">
            <div className="absolute top-1/2 left-2 right-2 h-[2px] bg-zinc-200 dark:bg-zinc-700 -translate-y-1/2 z-0"></div>
            <div className="relative z-10 flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((step) => {
                    const isActive = step === 5;
                    return (
                        <div key={step} className="flex items-center justify-center bg-[#FAFAFA] dark:bg-[#111116] px-1 transition-colors duration-300">
                            <div className={`w-2 h-2 rounded-full border-2 ${isActive ? 'bg-[#E36C59] border-[#E36C59] ring-[2px] ring-[#E36C59]/20' : 'bg-zinc-200 border-zinc-200 dark:bg-zinc-600 dark:border-zinc-600'}`}></div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Alert box */}
        <div className="rounded-xl bg-[#EEF2F0] dark:bg-[#1a2421] px-3 py-2.5 mb-3 flex items-start gap-2 transition-colors duration-300">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E36C59] dark:bg-[#E88C71] flex-shrink-0 animate-pulse"></div>
            <p className="text-[12px] font-medium text-[#2C4039] dark:text-[#A6B6B0] leading-tight">
                {patientsAhead} patients ahead of you. Feel free to run errands nearby.
            </p>
        </div>

        {/* Details List */}
        <div className="space-y-0 pt-0.5">
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[12px] text-zinc-500 dark:text-zinc-400">Doctor's avg. time / patient</span>
                <span className="text-[12px] font-semibold text-zinc-900 dark:text-white">12 min</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[12px] text-zinc-500 dark:text-zinc-400">Visit type</span>
                <span className="text-[12px] font-semibold text-zinc-900 dark:text-white">New patient · ₹400</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
                <span className="text-[12px] text-zinc-500 dark:text-zinc-400">Registered via</span>
                <span className="text-[12px] font-semibold text-zinc-900 dark:text-white">Online booking</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentSummaryCard;
