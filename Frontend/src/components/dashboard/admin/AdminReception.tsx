import { Users, Clock, Mail, Phone, MoreHorizontal, UserPlus } from "lucide-react"

type ReceptionistEntry = {
  id: number
  name: string
  email: string
  phone: string
  shift: string
  status: "active" | "off-duty"
}

const receptionists: ReceptionistEntry[] = [
  { id: 1, name: "Anita Patel", email: "anita@clearskin.clinic", phone: "+91 98765 00001", shift: "Morning (8 AM - 4 PM)", status: "active" },
  { id: 2, name: "Ravi Sharma", email: "ravi@clearskin.clinic", phone: "+91 98765 00002", shift: "Evening (1 PM - 9 PM)", status: "active" },
  { id: 3, name: "Sneha Desai", email: "sneha@clearskin.clinic", phone: "+91 98765 00003", shift: "Morning (8 AM - 4 PM)", status: "off-duty" },
]

const AdminReception = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Reception Staff
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage receptionists, contact details, and their current shifts.
          </p>
        </div>
        <button
          id="btn-add-receptionist"
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <UserPlus size={15} />
          Add Staff
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Total Staff",  value: receptionists.length },
          { label: "Active Today", value: receptionists.filter(r => r.status === "active").length },
          { label: "Off-duty",     value: receptionists.filter(r => r.status === "off-duty").length },
        ].map(s => (
          <div key={s.label} className="flex flex-col gap-1 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-4 md:p-5 dark:border-white/10 dark:bg-[#171717]">
            <p className="text-[24px] md:text-[28px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white leading-none">{s.value}</p>
            <p className="text-[11px] md:text-[13px] text-[#888888]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Staff cards */}
      <div className="flex flex-col gap-4">
        {receptionists.map(staff => (
          <div
            key={staff.id}
            className="flex flex-col md:flex-row md:items-center gap-4 rounded-[12px] border border-[#ebebeb] bg-white p-5 md:p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            {/* Avatar + info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                <Users size={20} className="text-[#888888]" />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-[15px] md:text-[16px] font-semibold text-[#171717] dark:text-white">{staff.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    staff.status === "active"
                      ? "bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]"
                      : "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                  }`}>
                    {staff.status === "active" ? "Active" : "Off-duty"}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#888888] mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} />
                    <span>{staff.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-[12px] text-[#888888] mt-1">
                  <Clock size={12} />
                  <span>{staff.shift}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 md:gap-6 border-t border-[#ebebeb] pt-4 md:border-0 md:pt-0 dark:border-white/10">
              <button
                id={`btn-staff-menu-${staff.id}`}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-[#ebebeb] text-[#888888] transition hover:bg-[#fafafa] dark:border-white/10 dark:hover:bg-white/5"
              >
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminReception
