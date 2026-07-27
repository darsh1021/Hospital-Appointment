import { FileText, Download, Activity, FileStack } from "lucide-react"

const PatientMedicalRecord = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Medical Record
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Your comprehensive health history, diagnoses, and lab results.
          </p>
        </div>
        <button
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <Download size={15} />
          Export Full Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Left Col: Vitals / Info */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
            <div className="border-b border-[#ebebeb] px-5 py-4 flex items-center gap-2 dark:border-white/10">
              <Activity size={15} className="text-[#888888]" />
              <h2 className="font-mono text-[12px] uppercase text-[#888888]">Patient Profile</h2>
            </div>
            <div className="flex flex-col p-5 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase text-[#888888]">Blood Group</span>
                <span className="text-[14px] font-medium text-[#171717] dark:text-white">O Positive (O+)</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase text-[#888888]">Allergies</span>
                <span className="text-[14px] font-medium text-[#ee0000] dark:text-[#ff4d4d]">Penicillin</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase text-[#888888]">Chronic Conditions</span>
                <span className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">None reported</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline */}
        <div className="md:col-span-2 flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
          <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center gap-2 dark:border-white/10">
            <FileStack size={15} className="text-[#888888]" />
            <h2 className="font-mono text-[12px] uppercase text-[#888888]">Clinical History</h2>
          </div>
          
          <div className="p-5 md:p-6">
            <div className="relative border-l border-[#ebebeb] dark:border-white/10 ml-3 md:ml-4 space-y-8 pb-4">
              
              {/* Item 1 */}
              <div className="relative pl-6 md:pl-8">
                <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#171717] ring-4 ring-white dark:bg-white dark:ring-[#0a0a0a]" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] text-[#888888]">September 28, 2026</span>
                  <h3 className="text-[15px] font-medium text-[#171717] dark:text-white">Dermatology Consultation</h3>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">Diagnosis: Acne Vulgaris (Grade II). Started on oral isotretinoin and topical clindamycin.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="flex h-7 items-center gap-1.5 rounded border border-[#ebebeb] bg-[#fafafa] px-2 text-[11px] font-medium text-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-white">
                      <FileText size={11} /> Visit Summary
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative pl-6 md:pl-8">
                <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#ebebeb] ring-4 ring-white dark:bg-white/20 dark:ring-[#0a0a0a]" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] text-[#888888]">May 15, 2026</span>
                  <h3 className="text-[15px] font-medium text-[#171717] dark:text-white">General Consultation</h3>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">Diagnosis: Contact Dermatitis. Prescribed mild corticosteroids.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientMedicalRecord
