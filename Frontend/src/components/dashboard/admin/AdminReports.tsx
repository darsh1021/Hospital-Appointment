import { FileText, Download, CalendarDays, TrendingUp, IndianRupee, Activity, FileSpreadsheet } from "lucide-react"

const reports = [
  { id: 1, name: "Daily Revenue Summary",    date: "Oct 24, 2026", type: "Financial", status: "Ready" },
  { id: 2, name: "Patient Demographics",     date: "Oct 23, 2026", type: "Analytics", status: "Ready" },
  { id: 3, name: "Doctor Utilization",       date: "Oct 22, 2026", type: "Operations",status: "Ready" },
  { id: 4, name: "Weekly Walk-in vs Online", date: "Oct 21, 2026", type: "Analytics", status: "Ready" },
]

const reportTypes = [
  { label: "Financial Reports", icon: IndianRupee,  desc: "Revenue, fees collected, refunds" },
  { label: "Patient Analytics", icon: Activity,     desc: "Demographics, new vs follow-up, retention" },
  { label: "Operational Data",  icon: TrendingUp,   desc: "Wait times, doctor efficiency, queue length" },
]

const AdminReports = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Reports
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Generate and export clinic performance data.
          </p>
        </div>
        <button
          id="btn-generate-report"
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <FileSpreadsheet size={15} />
          New Report
        </button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map(type => (
          <div key={type.label} className="flex flex-col gap-3 rounded-xl border border-[#ebebeb] bg-white p-5 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] transition hover:border-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:border-white cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
              <type.icon size={18} className="text-[#171717] dark:text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-[#171717] dark:text-white">{type.label}</h3>
              <p className="mt-1 text-[13px] text-[#888888]">{type.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Reports List */}
      <div className="flex flex-col rounded-xl border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Recent Reports</h2>
        </div>
        
        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {reports.map(report => (
            <div key={report.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 md:px-6 md:py-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                  <FileText size={16} className="text-[#888888]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] md:text-[15px] font-medium text-[#171717] dark:text-white truncate">{report.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[12px] text-[#888888]">
                    <span className="inline-flex items-center rounded-full bg-[#fafafa] px-2 py-0.5 text-[10px] font-medium text-[#171717] dark:bg-white/5 dark:text-white">
                      {report.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  id={`btn-download-${report.id}`}
                  className="flex h-8 items-center gap-1.5 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 text-[12px] font-medium text-[#171717] transition hover:bg-[#f5f5f5] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <Download size={13} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminReports
