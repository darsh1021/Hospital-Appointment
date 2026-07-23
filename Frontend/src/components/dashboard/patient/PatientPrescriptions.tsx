import { Download, Pill, CalendarDays, QrCode } from "lucide-react"

const PatientPrescriptions = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Prescriptions
          </h1>
          <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            View your prescriptions. Present your latest prescription at reception for the ₹200 follow-up fee.
          </p>
        </div>
      </div>

      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="border-b border-[#ebebeb] px-6 py-4 flex justify-between items-center dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Prescription History</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {[
            {
              doctor: "Dr. Sarah Jenkins",
              date: "Oct 10, 2026",
              medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"],
              status: "Valid for Follow-up",
              isLatest: true,
            },
            {
              doctor: "Dr. Robert Chen",
              date: "Sep 28, 2026",
              medications: ["Paracetamol 500mg"],
              status: "Archived",
              isLatest: false,
            },
          ].map((prescription, idx) => (
            <div key={idx} className={`flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between ${prescription.isLatest ? 'bg-[#fafafa]/50 dark:bg-white/[0.02]' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                  <Pill className={`h-5 w-5 ${prescription.isLatest ? 'text-[#0070f3]' : 'text-[#888888]'}`} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[16px] font-medium text-[#171717] dark:text-white">{prescription.doctor}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium ${
                      prescription.isLatest 
                        ? 'bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]' 
                        : 'bg-[#fafafa] text-[#888888] dark:bg-white/5 dark:text-[#888888]'
                    }`}>
                      {prescription.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[13px] text-[#888888]">
                    <CalendarDays size={14} />
                    <span>Issued on {prescription.date}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {prescription.medications.map((med, i) => (
                      <span key={i} className="rounded-md border border-[#ebebeb] bg-white px-2 py-1 text-[12px] text-[#4d4d4d] dark:border-white/10 dark:bg-black dark:text-[#888888]">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {prescription.isLatest && (
                  <button className="flex h-8 items-center justify-center gap-2 rounded-full bg-[#171717] px-4 text-[13px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90">
                    <QrCode size={14} />
                    Show at Reception
                  </button>
                )}
                <button className="flex h-8 items-center justify-center gap-2 rounded-full border border-[#ebebeb] px-4 text-[13px] font-medium text-[#171717] transition hover:bg-[#fafafa] dark:border-white/10 dark:text-white dark:hover:bg-white/5">
                  <Download size={14} />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientPrescriptions
