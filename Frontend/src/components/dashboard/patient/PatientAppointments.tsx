import { useEffect } from "react";
import { CalendarDays, MapPin, Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchPatientAppointments } from "../../../Features/appointment/appointmentSlice";

const formatReadableDate = (dateStr?: string) => {
  if (!dateStr) return "Today";
  try {
    const parts = dateStr.split("T")[0].split("-");
    let d: Date;
    if (parts.length === 3) {
      d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      d = new Date(dateStr);
    }

    if (isNaN(d.getTime())) return dateStr;
    
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const formatted = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return isToday ? `Today (${formatted})` : formatted;
  } catch {
    return dateStr;
  }
};

const PatientAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, loading } = useAppSelector((state) => state.appointment);

  console.log(appointments)

  useEffect(() => {
    dispatch(fetchPatientAppointments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2 text-[#888888]">
          <div className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent text-[#171717] dark:text-white" />
          <p className="text-[13px]">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  const active = appointments.filter((a) => a.status === "waiting" || a.status === "in-consultation");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Appointments
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Manage upcoming visits. If you are not present on the appointment date, the system automatically schedules you for the next day, and cancels if you are unavailable then.
          </p>
        </div>
      </div>

      {/* Active/Upcoming Appointments */}
      {active.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="font-mono text-[12px] uppercase text-[#888888] pl-1">Upcoming</h2>
          {active.map((apt) => (
            <div
              key={apt.id}
              className={`flex flex-col md:flex-row gap-4 md:gap-6 rounded-[12px] border bg-white p-5 md:p-6 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:bg-[#0a0a0a] ${
                apt.status === "in-consultation" ? "border-[#d3e5ff] dark:border-[#0070f3]/30" : "border-[#ebebeb] dark:border-white/10"
              }`}
            >
              {/* Date/Status Block */}
              <div className={`flex flex-col items-center justify-center rounded-[8px] min-w-[120px] py-4 px-2 border ${
                apt.status === "in-consultation" 
                  ? "bg-[#d3e5ff]/30 border-[#d3e5ff] dark:bg-[#0070f3]/10 dark:border-[#0070f3]/20" 
                  : "bg-[#fafafa] border-[#ebebeb] dark:bg-[#171717] dark:border-white/10"
              }`}>
                <span className="text-[11px] font-mono text-[#888888] uppercase">
                  Appt Date
                </span>
                <span className={`text-[15px] font-semibold mt-1 text-center leading-tight ${apt.status === "in-consultation" ? "text-[#0761d1] dark:text-[#50e3c2]" : "text-[#171717] dark:text-white"}`}>
                  {formatReadableDate(apt.appointment_date)}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[16px] md:text-[18px] font-semibold tracking-[-0.32px] text-[#171717] dark:text-white">
                    {apt.doctor_name || "Assigned Doctor"}
                  </h3>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                    apt.status === "in-consultation" 
                      ? "bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/20 dark:text-[#50e3c2]" 
                      : "bg-[#f5f5f5] text-[#4d4d4d] dark:bg-white/5 dark:text-[#888888]"
                  }`}>
                    {apt.status === "in-consultation" ? <CheckCircle2 size={10} /> : null}
                    {apt.status}
                  </span>
                </div>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#888888]">
                  {apt.doctor_specialization || "General Specialist"}
                </p>
                {apt.symptoms && (
                  <p className="text-[13px] italic text-[#666666] dark:text-[#aaaaaa]">
                    Symptoms: {apt.symptoms}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mt-2 text-[13px] text-[#888888]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>{apt.hospital_name || "City Clinic"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[#171717] dark:text-white">
                    <Ticket size={13} />
                    <span>Token #{apt.token_number}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] border-dashed bg-[#fafafa] py-10 px-6 text-center dark:border-white/10 dark:bg-[#171717]">
          <AlertCircle className="h-6 w-6 text-[#888888] mb-2" />
          <h3 className="text-[15px] font-medium text-[#171717] dark:text-white">No Upcoming Appointments</h3>
          <p className="text-[13px] text-[#888888] mt-1">You do not have any active token or scheduled consultation at this moment.</p>
        </div>
      )}

      {/* Past Appointments (only shown if history is available) */}
      {past.length > 0 && (
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
            <h2 className="font-mono text-[12px] uppercase text-[#888888]">Past Appointments</h2>
          </div>
          <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
            {past.map((apt) => (
              <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-6 py-4 opacity-75">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                    <CalendarDays size={16} className="text-[#888888]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] md:text-[15px] font-medium text-[#171717] dark:text-white truncate">
                        {apt.doctor_name || "Doctor"} <span className="text-[#888888] font-normal">— {apt.doctor_specialization || "Specialist"}</span>
                      </p>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                        apt.status === "completed" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-[12px] text-[#888888]">
                      <span>{formatReadableDate(apt.appointment_date)}</span>
                      <span>·</span>
                      <span>Token #{apt.token_number}</span>
                      {apt.symptoms && (
                        <>
                          <span>·</span>
                          <span className="italic">Symptoms: {apt.symptoms}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
