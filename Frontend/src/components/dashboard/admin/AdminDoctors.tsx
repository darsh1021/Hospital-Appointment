import { Stethoscope, Clock, Users, TrendingUp, MoreHorizontal } from "lucide-react"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchDoctorsAdmin } from "../../../Features/admin/adminSlice";

const AdminDoctors = () => {
  const dispatch = useAppDispatch();
  const { doctors, loading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDoctorsAdmin());
  }, [dispatch]);

  if (loading) {
    return <div className="text-[#888888] p-6">Loading doctors...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-6">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Doctors
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage doctors, session hours, and view today's performance.
          </p>
        </div>
        <button
          id="btn-add-doctor"
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <Stethoscope size={15} />
          Add Doctor
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Total Doctors",  value: doctors.length },
          { label: "Active Today",   value: doctors.filter(d => d.is_available).length },
          { label: "Off-duty",       value: doctors.filter(d => !d.is_available).length },
        ].map(s => (
          <div key={s.label} className="flex flex-col gap-1 rounded-xl border border-[#ebebeb] bg-[#fafafa] p-4 md:p-5 dark:border-white/10 dark:bg-[#171717]">
            <p className="text-[24px] md:text-[28px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white leading-none">{s.value}</p>
            <p className="text-[11px] md:text-[13px] text-[#888888]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Doctor cards */}
      <div className="flex flex-col gap-4">
        {doctors.map(doc => (
          <div
            key={doc.doctor_id}
            className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl border border-[#ebebeb] bg-white p-5 md:p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]"
          >
            {/* Avatar + info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                <Stethoscope size={20} className="text-[#888888]" />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-[15px] md:text-[16px] font-semibold text-[#171717] dark:text-white">{doc.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    doc.is_available
                      ? "bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]"
                      : "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                  }`}>
                    {doc.is_available ? "Active" : "Off-duty"}
                  </span>
                </div>
                <p className="text-[13px] text-[#888888]">{doc.specialization} · ₹{doc.consultation_fee}</p>
                <div className="flex items-center gap-1.5 text-[12px] text-[#888888]">
                  <Clock size={12} />
                  <span>N/A</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-6 border-t border-[#ebebeb] pt-4 md:border-0 md:pt-0 dark:border-white/10">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-[#888888]" />
                  <span className="font-mono text-[10px] uppercase text-[#888888]">Today</span>
                </div>
                <p className="text-[18px] font-semibold text-[#171717] dark:text-white">-</p>
              </div>
              <div className="w-px h-8 bg-[#ebebeb] dark:bg-white/10" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#888888]" />
                  <span className="font-mono text-[10px] uppercase text-[#888888]">Avg.</span>
                </div>
                <p className="text-[18px] font-semibold text-[#171717] dark:text-white">-m</p>
              </div>
              <button
                id={`btn-doctor-menu-${doc.doctor_id}`}
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

export default AdminDoctors
