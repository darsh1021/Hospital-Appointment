import { Settings, Save, Store, Clock, Users, Shield } from "lucide-react"

const AdminSettings = () => {
  const inputClass = "w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-[14px] text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Settings
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage clinic preferences, fees, and operational limits.
          </p>
        </div>
        <button
          id="btn-save-settings"
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center gap-2 dark:border-white/10">
          <Store size={16} className="text-[#888888]" />
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Clinic Details</h2>
        </div>
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">Clinic Name</label>
            <input type="text" defaultValue="Clearskin Clinic" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">Contact Email</label>
            <input type="email" defaultValue="admin@clearskin.clinic" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">Address</label>
            <textarea defaultValue="123 Health Ave, Medical District" rows={2} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Operations & Queue */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center gap-2 dark:border-white/10">
          <Clock size={16} className="text-[#888888]" />
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Operations & Queue</h2>
        </div>
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">Online Booking Cap (%)</label>
            <input type="number" defaultValue="70" className={inputClass} />
            <p className="text-[11px] text-[#888888]">Percentage of total tokens available for online booking.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">Avg Consultation Time (mins)</label>
            <input type="number" defaultValue="15" className={inputClass} />
            <p className="text-[11px] text-[#888888]">Baseline used before rolling average takes over.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">No-show Recall Buffer</label>
            <input type="number" defaultValue="2" className={inputClass} />
            <p className="text-[11px] text-[#888888]">Number of patients to wait before recalling a missed patient.</p>
          </div>
        </div>
      </div>

      {/* Fees */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center gap-2 dark:border-white/10">
          <Users size={16} className="text-[#888888]" />
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Fee Structure</h2>
        </div>
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">New Consultation Fee (₹)</label>
            <input type="number" defaultValue="400" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">Follow-up Fee (₹)</label>
            <input type="number" defaultValue="200" className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
