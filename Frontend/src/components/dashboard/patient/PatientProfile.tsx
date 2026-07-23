import { User, Mail, Phone, MapPin, Shield } from "lucide-react"

const PatientProfile = () => {
  const inputClass = "w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-[14px] text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage your personal information and contact details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Left Col: Avatar Card */}
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="flex flex-col items-center px-6 pt-8 pb-6 border-b border-[#ebebeb] dark:border-white/10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-[#171717]">
              <User size={40} className="text-[#888888]" />
            </div>
            <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.6px] text-[#171717] dark:text-white">
              Arjun Singh
            </h2>
            <p className="mt-1 text-[13px] text-[#888888]">Patient ID: #PT-8842</p>
          </div>
          <div className="p-4 flex justify-center bg-[#fafafa] dark:bg-white/5">
            <button className="text-[12px] font-medium text-[#171717] dark:text-white hover:underline">
              Change Avatar
            </button>
          </div>
        </div>

        {/* Right Col: Forms */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
            <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center gap-2 dark:border-white/10">
              <User size={16} className="text-[#888888]" />
              <h2 className="font-mono text-[12px] uppercase text-[#888888]">Personal Details</h2>
            </div>
            <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717] dark:text-white">Full Name</label>
                <input type="text" defaultValue="Arjun Singh" className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717] dark:text-white">Date of Birth</label>
                <input type="date" defaultValue="2004-05-12" className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717] dark:text-white">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                  <input type="email" defaultValue="arjun.singh@example.com" className={`${inputClass} pl-9`} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717] dark:text-white">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                  <input type="tel" defaultValue="+91 98765 43210" className={`${inputClass} pl-9`} />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-[13px] font-medium text-[#171717] dark:text-white">Home Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                  <textarea defaultValue="Flat 4B, Riverview Apartments, Phase 2, New Delhi" rows={2} className={`${inputClass} pl-9 py-2.5`} />
                </div>
              </div>
            </div>
            <div className="border-t border-[#ebebeb] p-5 md:px-6 md:py-4 bg-[#fafafa] dark:border-white/10 dark:bg-[#171717] flex justify-end">
              <button className="flex h-9 items-center justify-center rounded-full bg-[#171717] px-5 text-[13px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile
