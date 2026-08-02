import { useEffect } from "react";
import { ClipboardList, AlertCircle, FileText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchPatientPrescriptions } from "../../../Features/patient/patientSlice";

const formatReadableDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};

const PatientPrescriptions = () => {
  const dispatch = useAppDispatch();
  const { prescriptions, loading, error } = useAppSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatientPrescriptions());
  }, [dispatch]);

  if (loading) {
    return <div className="p-6 text-[#888888]">Loading prescriptions...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Prescriptions
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            View your digital prescriptions from completed consultations.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        {prescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#ebebeb] border-dashed bg-[#fafafa] py-10 px-6 text-center dark:border-white/10 dark:bg-[#171717]">
            <AlertCircle className="h-6 w-6 text-[#888888] mb-2" />
            <h3 className="text-[15px] font-medium text-[#171717] dark:text-white">No Prescriptions</h3>
            <p className="text-[13px] text-[#888888] mt-1">You do not have any prescriptions yet.</p>
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div key={rx.id} className="flex flex-col rounded-xl border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
              {/* Header / Title */}
              <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 dark:border-white/10 bg-[#fafafa] dark:bg-[#171717]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                    <ClipboardList size={16} className="text-[#888888]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#171717] dark:text-white">{rx.symptoms || "Consultation"}</h3>
                    <p className="text-[13px] text-[#888888]">{rx.doctor_name} ({rx.doctor_specialization}) · {formatReadableDate(rx.appointment_date)}</p>
                  </div>
                </div>
              </div>

              {/* Meds list preview */}
              <div className="p-5 md:p-6">
                <h4 className="font-mono text-[11px] uppercase text-[#888888] mb-4">Doctor's Prescription & Notes</h4>
                <div className="flex items-start gap-3">
                  <FileText size={15} className="mt-0.5 text-[#888888]" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] text-[#171717] dark:text-white whitespace-pre-wrap">{rx.prescription}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions
