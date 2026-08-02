import { Timer, CalendarDays, Pill, FileText, CheckCircle2, XCircle, User, AlertCircle } from "lucide-react"

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchCurrentPatient, completeConsultation, updateAppointmentStatus } from "../../../Features/doctor/doctorSlice";

const DoctorCurrentPatient = () => {
  const dispatch = useAppDispatch();
  const { currentPatient, loading, error } = useAppSelector((state) => state.doctor);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchCurrentPatient());
  }, [dispatch]);

  const handleComplete = () => {
    if (!currentPatient) return;
    dispatch(completeConsultation({ id: currentPatient.id, data: { prescription: notes, symptoms: currentPatient.symptoms } }));
  };

  const handleNoShow = () => {
    if (!currentPatient) return;
    dispatch(updateAppointmentStatus({ id: currentPatient.id, status: "cancelled" }));
  };

  if (loading) {
    return <div className="text-[#888888] p-6">Loading current patient...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-6">Error: {error}</div>;
  }

  if (!currentPatient) {
    return <div className="text-[#888888] p-6">No patient currently in consultation. Call a patient from the queue.</div>;
  }

  const isFollowUp = false; // Mocked, backend doesn't provide visitType

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          Current Patient
        </h1>
        <p className="mt-2 text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Details and consultation notes for the patient currently being seen.
        </p>
      </div>

      {/* Patient card */}
      <div className="flex flex-col rounded-xl border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
        <div className="bg-[#d3e5ff] px-6 py-3 dark:bg-[#0070f3]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0761d1] opacity-75 dark:bg-[#50e3c2]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0761d1] dark:bg-[#50e3c2]" />
            </span>
            <span className="text-[14px] font-medium text-[#0761d1] dark:text-[#50e3c2]">
              Consultation in progress — Token #{currentPatient.token_number}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-[#0761d1] dark:text-[#50e3c2]">
            <Timer size={14} />
            <span className="font-mono">- elapsed</span>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Patient info */}
            <div className="w-full md:w-1/3">
              <div className="flex flex-col items-center rounded-xl border border-[#ebebeb] bg-[#fafafa] py-8 px-6 text-center dark:border-white/10 dark:bg-[#171717]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                  <User size={28} className="text-[#888888]" />
                </div>
                <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.6px] text-[#171717] dark:text-white">
                  {currentPatient.patient_name}
                </h2>
                <p className="mt-1 text-[14px] text-[#888888]">Age N/A</p>
                <p className="mt-0.5 text-[13px] text-[#888888]">{currentPatient.patient_phone}</p>
                <span className="mt-4 inline-flex items-center rounded-full bg-white border border-[#ebebeb] px-3 py-1 text-[12px] font-medium text-[#171717] dark:bg-white/5 dark:border-white/10 dark:text-white">
                  N/A · ₹N/A
                </span>
              </div>

              {/* Quick info rows */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between py-2 border-b border-[#ebebeb] dark:border-white/10">
                  <div className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <CalendarDays size={14} />
                    Last Visit
                  </div>
                  <span className="text-[13px] text-[#171717] dark:text-white">N/A</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <FileText size={14} />
                    Visit Type
                  </div>
                  <span className="text-[13px] font-medium text-[#171717] dark:text-white">{currentPatient.status}</span>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6 flex-1">
              {/* Previous diagnosis (follow-up only) */}
              {isFollowUp && (
                <div className="rounded-xl border border-[#ebebeb] bg-[#fafafa] p-5 dark:border-white/10 dark:bg-[#171717]">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={15} className="text-[#0070f3]" />
                    <h3 className="text-[14px] font-semibold text-[#171717] dark:text-white">Previous Visit Summary</h3>
                  </div>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888] mb-3">
                    <span className="font-medium text-[#171717] dark:text-white">Diagnosis: </span>
                    {currentPatient.symptoms || "N/A"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(currentPatient.prescription ? [currentPatient.prescription] : []).map((med) => (
                      <span key={med} className="flex items-center gap-1.5 rounded-md border border-[#ebebeb] bg-white px-2.5 py-1 text-[12px] text-[#4d4d4d] dark:border-white/10 dark:bg-black dark:text-[#888888]">
                        <Pill size={12} className="text-[#0070f3]" />
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation notes */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[12px] uppercase text-[#888888]">Consultation Notes</label>
                <textarea
                  id="consultation-notes"
                  rows={6}
                  placeholder="Enter observations, diagnosis, and treatment notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-[6px] border border-[#ebebeb] bg-white px-4 py-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:outline-none focus:ring-0 resize-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus:border-white"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  id="btn-complete-and-prescribe"
                  className="flex-1 flex h-12 items-center justify-center gap-2 rounded-full bg-[#171717] text-[15px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90"
                  onClick={handleComplete}
                >
                  <CheckCircle2 size={18} />
                  Complete &amp; Prescribe
                </button>
                <button
                  id="btn-noshow-current"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#ee0000]/30 bg-[#f7d4d6]/40 px-5 text-[15px] font-medium text-[#ee0000] transition hover:bg-[#f7d4d6] dark:border-[#ee0000]/20 dark:bg-[#ee0000]/10 dark:text-[#ff4d4d]"
                  onClick={handleNoShow}
                >
                  <XCircle size={18} />
                  No-show
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorCurrentPatient
