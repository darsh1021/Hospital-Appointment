import { FileText, Download, CalendarDays, TrendingUp, IndianRupee, Activity, Plus } from "lucide-react";

const reports = [
  { id: 1, name: "Daily Revenue Summary",    date: "Oct 24, 2026", type: "Financial" },
  { id: 2, name: "Patient Demographics",     date: "Oct 23, 2026", type: "Analytics" },
  { id: 3, name: "Doctor Utilization",       date: "Oct 22, 2026", type: "Operations" },
  { id: 4, name: "Walk-in vs Online (Week)", date: "Oct 21, 2026", type: "Analytics" },
];

const reportTypes = [
  { label: "Financial",    icon: IndianRupee, desc: "Revenue, fees, and refunds." },
  { label: "Patient Data", icon: Activity,    desc: "Demographics, visits, retention." },
  { label: "Operations",   icon: TrendingUp,  desc: "Wait times, queue density." },
];

const AdminReports = () => {
  return (
    <div className="dash-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle mt-1">Generate, view, and export clinic performance data.</p>
        </div>
        <button id="btn-generate-report" className="btn-primary">
          <Plus size={15} /> New Report
        </button>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {reportTypes.map(type => (
          <button
            key={type.label}
            className="card p-5 text-left flex flex-col gap-3 transition-colors hover:bg-[#fafafa] dark:hover:bg-white/[0.02] cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg card-inset text-[#737373]">
              <type.icon size={17} />
            </div>
            <div>
              <p className="card-title group-hover:text-[#0a0a0a] dark:group-hover:text-white transition-colors">{type.label}</p>
              <p className="body-text-sm mt-0.5">{type.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Generated Reports List */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <span className="label-eyebrow">Recent Reports</span>
        </div>

        <div>
          {reports.map((report, idx) => (
            <div
              key={report.id}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fafafa] dark:hover:bg-white/[0.02] ${
                idx !== reports.length - 1 ? "border-b border-[#e5e5e5] dark:border-white/[0.04]" : ""
              }`}
            >
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg card-inset text-[#a3a3a3]">
                <FileText size={16} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="card-title truncate">{report.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="badge badge-neutral text-[10.5px]">{report.type}</span>
                  <span className="data-text-sm flex items-center gap-1">
                    <CalendarDays size={11} className="text-[#a3a3a3]" /> {report.date}
                  </span>
                </div>
              </div>

              {/* Download */}
              <button id={`btn-download-${report.id}`} className="btn-secondary shrink-0">
                <Download size={13} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
