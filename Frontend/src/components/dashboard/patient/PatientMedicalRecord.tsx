import { FileText, Download, Activity, FileStack, Ticket } from "lucide-react"

const PatientMedicalRecord = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Medical Record
          </h1>
          <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Access lab results, imaging, and notes from your past clinic visits.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reports List */}
        <div className="lg:col-span-2 flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="border-b border-[#ebebeb] px-6 py-4 dark:border-white/10">
            <h2 className="font-mono text-[12px] uppercase text-[#888888]">Visit Records & Reports</h2>
          </div>
          <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
            {[
              { type: "Blood Test (CBC)", date: "Oct 05, 2026", token: "Token #14", icon: Activity },
              { type: "Chest X-Ray", date: "Sep 20, 2026", token: "External Lab", icon: FileStack },
              { type: "General Consultation Notes", date: "Sep 15, 2026", token: "Token #32", icon: FileText },
            ].map((report, idx) => (
              <div key={idx} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fafafa] dark:bg-white/5">
                    <report.icon className="h-5 w-5 text-[#171717] dark:text-white" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-[#171717] dark:text-white">{report.type}</h3>
                    <div className="flex items-center gap-2 text-[13px] text-[#888888] mt-0.5">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Ticket size={12} /> {report.token}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ebebeb] text-[#171717] transition hover:bg-[#fafafa] dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Vitals & Summary */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] dark:border-white/10 dark:bg-[#171717]">
            <h2 className="text-[16px] font-semibold text-[#171717] dark:text-white">Basic Vitals</h2>
            <p className="mb-4 text-[13px] text-[#888888]">Recorded on last visit</p>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between border-b border-[#ebebeb] pb-2 dark:border-white/10">
                <span className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">Blood Pressure</span>
                <span className="font-medium text-[#171717] dark:text-white">120/80</span>
              </div>
              <div className="flex justify-between border-b border-[#ebebeb] pb-2 dark:border-white/10">
                <span className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">Heart Rate</span>
                <span className="font-medium text-[#171717] dark:text-white">72 bpm</span>
              </div>
              <div className="flex justify-between border-b border-[#ebebeb] pb-2 dark:border-white/10">
                <span className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">Weight</span>
                <span className="font-medium text-[#171717] dark:text-white">70 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">Height</span>
                <span className="font-medium text-[#171717] dark:text-white">175 cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientMedicalRecord
