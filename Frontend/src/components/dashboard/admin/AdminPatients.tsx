import { Users, Search, CalendarDays, Ticket, MoreHorizontal } from "lucide-react"
import { useState } from "react"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchPatientsAdmin } from "../../../Features/admin/adminSlice";

const AdminPatients = () => {
  const dispatch = useAppDispatch();
  const { patients: allPatients, loading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPatientsAdmin());
  }, [dispatch]);

  const [query, setQuery] = useState("");
  const filtered = allPatients.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.phone_number.includes(query)
  );

  if (loading) {
    return <div className="text-[#888888] p-6">Loading patients...</div>;
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
            Patients
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            All registered patients — search by name or phone.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#ebebeb] bg-[#fafafa] px-4 py-2 self-start sm:self-auto dark:border-white/10 dark:bg-[#171717]">
          <Users size={14} className="text-[#888888]" />
          <span className="text-[13px] text-[#888888]">{allPatients.length} total</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" />
        <input
          id="patient-search"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full rounded-[8px] border border-[#ebebeb] bg-white py-3 pl-10 pr-4 text-[14px] text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"
        />
      </div>

      {/* Patient list */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[1fr_80px_160px_100px_130px_80px_40px] gap-3 border-b border-[#ebebeb] bg-[#fafafa] px-6 py-3 dark:border-white/10 dark:bg-[#171717]">
          {["Patient", "Age", "Phone", "Visits", "Last Visit", "Type", ""].map(h => (
            <span key={h} className="font-mono text-[11px] uppercase text-[#888888]">{h}</span>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Users size={28} className="text-[#888888]" />
              <p className="text-[14px] text-[#888888]">No patients match your search.</p>
            </div>
          ) : filtered.map(patient => (
            <div key={patient.id} className="flex flex-col md:grid md:grid-cols-[1fr_80px_160px_100px_130px_80px_40px] gap-2 md:gap-3 px-5 md:px-6 py-4 items-start md:items-center">
              {/* Mobile: name + type */}
              <div className="flex items-center justify-between w-full md:contents">
                <p className="text-[14px] font-medium text-[#171717] dark:text-white">{patient.name}</p>
                <span className={`md:hidden inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#fafafa] text-[#888888] dark:bg-white/5`}>
                  N/A
                </span>
              </div>

              <p className="text-[13px] text-[#888888]">-</p>
              <p className="text-[13px] text-[#888888] font-mono">{patient.phone_number}</p>
              <div className="flex items-center gap-1.5 text-[13px] text-[#888888]">
                <Ticket size={12} />
                <span>- visit(s)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] md:text-[13px] text-[#888888]">
                <CalendarDays size={12} />
                <span>{new Date(patient.created_at).toLocaleDateString()}</span>
              </div>

              {/* Type (desktop) */}
              <span className={`hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#fafafa] text-[#888888] dark:bg-white/5`}>
                N/A
              </span>

              <button
                id={`btn-patient-menu-${patient.id}`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ebebeb] text-[#888888] transition hover:bg-[#fafafa] dark:border-white/10 dark:hover:bg-white/5"
              >
                <MoreHorizontal size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPatients
