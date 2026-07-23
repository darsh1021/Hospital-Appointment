import { User, Phone, MapPin, QrCode } from "lucide-react"

const PatientProfile = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage your personal information, which identifies you for clinic walk-ins.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Quick Identity Card */}
        <div className="flex flex-col md:flex-row items-center gap-6 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] dark:border-white/10 dark:bg-[#171717]">
           <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[12px] bg-white border border-[#ebebeb] dark:border-white/10 dark:bg-[#0a0a0a]">
              <QrCode className="h-10 w-10 text-[#171717] dark:text-white" />
           </div>
           <div>
              <h2 className="text-[18px] font-semibold text-[#171717] dark:text-white">Patient Identity Code</h2>
              <p className="mt-1 text-[14px] text-[#4d4d4d] dark:text-[#888888]">
                Show this QR code or provide your registered phone number at reception to automatically link your visit history and apply the ₹200 follow-up rate.
              </p>
           </div>
        </div>

        {/* Personal Information */}
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="border-b border-[#ebebeb] px-6 py-4 dark:border-white/10">
            <h2 className="text-[18px] font-semibold text-[#171717] dark:text-white">Personal Information</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                <User className="h-10 w-10 text-[#888888]" />
              </div>
              <div className="flex flex-col gap-2">
                <button className="rounded-full bg-[#171717] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90">
                  Upload Photo
                </button>
                <button className="text-[13px] text-[#888888] hover:text-[#171717] dark:hover:text-white">
                  Remove
                </button>
              </div>
            </div>

            <form className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#171717] dark:text-white">First Name</label>
                <input 
                  type="text" 
                  defaultValue="John"
                  className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#171717] dark:text-white">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="Doe"
                  className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[14px] font-medium text-[#171717] dark:text-white">
                  Registered Phone Number <span className="text-[#888888] font-normal">(Primary Identifier)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
                  <input 
                    type="tel" 
                    defaultValue="+91 98765 43210"
                    className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white pl-9 pr-3 text-[14px] text-[#171717] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#171717] dark:text-white">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
                  <input 
                    type="text" 
                    defaultValue="123 Health Street, Wellness City, 10001"
                    className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white pl-9 pr-3 text-[14px] text-[#171717] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="flex items-center justify-end border-t border-[#ebebeb] bg-[#fafafa] px-6 py-4 dark:border-white/10 dark:bg-white/5 rounded-b-[12px]">
            <button className="rounded-full bg-[#171717] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile
