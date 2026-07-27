import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Clock, Users, Ticket, AlertCircle, History, ChevronRight } from "lucide-react"
import axiosInstance from "../../../api/axios"
import { useAppSelector } from "../../../app/store"

interface PatientAppointment {
  id: number
  token_number: number
  appointment_date: string
  status: string
  symptoms?: string
  doctor_name?: string
  doctor_specialization?: string
  hospital_name?: string
}

const formatReadableDate = (dateStr?: string) => {
  if (!dateStr) return "Today";
  try {
    // Handle YYYY-MM-DD string cleanly without UTC offset shifts
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

const PatientOverview = () => {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [appointments, setAppointments] = useState<PatientAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/api/patient/appointments")
        if (response.data?.appointments) {
          setAppointments(response.data.appointments)
        }
      } catch (err) {
        console.error("Failed to fetch patient appointments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const activeAppointment = appointments.find(
    (a) => a.status === "scheduled" || a.status === "waiting" || a.status === "in-consultation"
  ) || appointments[0]

  const hasActiveToken = Boolean(activeAppointment)

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
            Welcome back, {user?.name || "Patient"}
          </h1>
          <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
            Track your live queue status and manage your digital tokens.
          </p>
        </div>
        <button
          id="btn-book-appointment"
          onClick={() => navigate("/book-token")}
          className="flex h-10 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
        >
          <Ticket size={15} />
          Book New Token
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 rounded-[12px] border border-[#ebebeb] bg-white dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-2 text-[#888888]">
            <div className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent text-[#171717] dark:text-white" />
            <p className="text-[13px]">Loading your token info...</p>
          </div>
        </div>
      ) : hasActiveToken ? (
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] overflow-hidden dark:border-white/10 dark:bg-[#0a0a0a]">
          {/* Status Banner */}
          <div className="bg-[#d3e5ff]/50 px-5 md:px-6 py-3.5 dark:bg-[#0070f3]/10 flex items-start sm:items-center gap-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0 text-[#0761d1] dark:text-[#50e3c2]" />
            <span className="text-[13px] md:text-[14px] font-medium text-[#0761d1] dark:text-[#50e3c2]">
              You have an active appointment token <strong>#{activeAppointment.token_number}</strong> scheduled for 
              <strong>
                {formatReadableDate(activeAppointment.appointment_date)}</strong>.
            </span>
          </div>

          <div className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              
              {/* Token Info */}
              <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] bg-[#fafafa] w-full md:w-1/3 py-8 px-4 dark:border-white/10 dark:bg-[#171717] text-center">
                <span className="font-mono text-[12px] uppercase text-[#888888]">Your Token</span>
                <span className="text-[56px] md:text-[64px] font-semibold tracking-[-2.4px] text-[#171717] leading-none mt-2 dark:text-white">
                  #{activeAppointment.token_number}
                </span>
                <span className="mt-4 inline-flex items-center rounded-full bg-white border border-[#ebebeb] px-3 py-1 text-[12px] font-medium text-[#171717] dark:bg-white/5 dark:border-white/10 dark:text-white">
                  {activeAppointment.doctor_specialization || "General Consultation"}
                </span>
              </div>

              {/* Live Tracker */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 w-full md:w-2/3">
                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 dark:border-white/10 dark:bg-[#0a0a0a]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <Ticket size={14} /> Doctor
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[16px] md:text-[18px] font-semibold tracking-[-0.5px] text-[#171717] leading-tight dark:text-white">
                      {activeAppointment.doctor_name || "Assigned Specialist"}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 dark:border-white/10 dark:bg-[#0a0a0a]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <Users size={14} /> Hospital
                  </span>
                  <span className="text-[14px] font-medium text-[#171717] leading-tight mt-1 dark:text-white">
                    {activeAppointment.hospital_name || "City Health Clinic"}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-white p-4 md:p-5 dark:border-white/10 dark:bg-[#0a0a0a]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <Clock size={14} /> Date
                  </span>
                  <span className="text-[14px] md:text-[15px] font-semibold tracking-[-0.3px] text-[#171717] leading-snug mt-1 dark:text-white">
                    {formatReadableDate(activeAppointment.appointment_date)}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-4 md:p-5 dark:border-white/10 dark:bg-[#171717]">
                  <span className="flex items-center gap-2 text-[13px] text-[#888888]">
                    <AlertCircle size={14} /> Token Status
                  </span>
                  <span className="text-[15px] font-semibold text-[#0070f3] capitalize mt-1 dark:text-[#6ee7b7]">
                    {activeAppointment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] border-dashed bg-[#fafafa] py-16 px-6 text-center dark:border-white/10 dark:bg-[#171717]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#ebebeb] dark:bg-[#0a0a0a] dark:border-white/10">
            <Ticket className="h-5 w-5 text-[#888888]" />
          </div>
          <h3 className="mt-4 text-[16px] font-medium text-[#171717] dark:text-white">No active tokens</h3>
          <p className="mt-2 text-[14px] text-[#888888] max-w-sm">
            You don't have any appointments scheduled for today. Book a new appointment to join the queue.
          </p>
          <button
            onClick={() => navigate("/book-token")}
            className="mt-6 flex h-10 items-center justify-center gap-2 rounded-full bg-[#171717] px-6 text-[14px] font-medium text-white transition hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717]"
          >
            Book Appointment
          </button>
        </div>
      )}

      {/* Recent Activity */}
      {appointments.length > 0 && (
        <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 flex items-center gap-2 dark:border-white/10">
            <History size={15} className="text-[#888888]" />
            <h2 className="font-mono text-[12px] uppercase text-[#888888]">Your Appointment History</h2>
          </div>
          <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
            {appointments.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between px-5 md:px-6 py-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fafafa] border border-[#ebebeb] dark:border-white/10 dark:bg-white/5">
                    <span className="font-mono text-[11px] font-bold text-[#171717] dark:text-white">#{visit.token_number}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#171717] dark:text-white truncate">
                      {visit.doctor_specialization || "Consultation"} — {visit.doctor_name || "Doctor"}
                    </p>
                    <p className="text-[12px] text-[#888888]">{visit.appointment_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex rounded-full bg-[#fafafa] px-2.5 py-1 text-[11px] font-medium text-[#171717] capitalize dark:bg-white/5 dark:text-white">
                    {visit.status}
                  </span>
                  <ChevronRight size={15} className="text-[#888888]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientOverview

