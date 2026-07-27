import { ClipboardList, Download, AlertCircle, Pill } from "lucide-react"

const prescriptions = [
  { id: 1, doctor: "Dr. Sarah Jenkins", date: "Sep 28, 2026", diagnosis: "Acne Vulgaris", active: true },
  { id: 2, doctor: "Dr. Robert Chen", date: "May 15, 2026", diagnosis: "Contact Dermatitis", active: false },
]

const PatientPrescriptions = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Prescriptions
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            View and download your digital prescriptions.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        {prescriptions.map(rx => (
          <div key={rx.id} className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
            {/* Header / Title */}
            <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 dark:border-white/10 bg-[#fafafa] dark:bg-[#171717]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                  <ClipboardList size={16} className="text-[#888888]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white">{rx.diagnosis}</h3>
                  <p className="text-[13px] text-[#888888]">{rx.doctor} · {rx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {rx.active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#d3e5ff]/50 px-2 py-0.5 text-[11px] font-medium text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]">
                    Active
                  </span>
                )}
                <button className="flex h-8 items-center gap-1.5 rounded-full border border-[#ebebeb] bg-white px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:hover:bg-white/5">
                  <Download size={13} />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Meds list preview */}
            <div className="p-5 md:p-6">
              <h4 className="font-mono text-[11px] uppercase text-[#888888] mb-4">Medications</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Pill size={15} className="mt-0.5 text-[#888888]" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] font-medium text-[#171717] dark:text-white">Isotretinoin 20mg</p>
                    <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">1 capsule daily after dinner for 3 months.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Pill size={15} className="mt-0.5 text-[#888888]" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] font-medium text-[#171717] dark:text-white">Clindamycin Gel 1%</p>
                    <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">Apply locally on active acne twice a day.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advice */}
            <div className="border-t border-[#ebebeb] bg-[#fafafa]/50 p-5 md:px-6 md:py-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-[#888888] mt-0.5" />
                <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">
                  <strong className="font-medium text-[#171717] dark:text-white">Doctor's Note:</strong> Use gentle cleanser. Avoid excessive sun exposure and strictly use SPF 50 sunscreen daily.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatientPrescriptions
