import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  CreditCard,
  UserRound,
  ListOrdered,
  History,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../../app/store"
import { logoutUser } from "../../../Features/auth/authSlice"
import SidebarLink from "./SidebarLink"


type NavItem = {
  label: string
  to: string
  icon: React.ElementType
  children?: NavItem[]
}

// Role-based nav maps
const navByRole: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", to: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Doctors", to: "/dashboard/admin/doctors", icon: Stethoscope },
    { label: "Patients", to: "/dashboard/admin/patients", icon: Users },
    { label: "Reception", to: "/dashboard/admin/reception", icon: UserRound },
    { label: "Reports", to: "/dashboard/admin/reports", icon: FileText },
    { label: "Settings", to: "/dashboard/admin/settings", icon: Settings },
  ],

  doctor: [
    { label: "Dashboard", to: "/dashboard/doctor", icon: LayoutDashboard },
    { label: "Queue", to: "/dashboard/doctor/queue", icon: ListOrdered },
    {
      label: "Current Patient",
      to: "/dashboard/doctor/current-patient",
      icon: UserRound,
    },
    {
      label: "Prescription",
      to: "/dashboard/doctor/prescription",
      icon: ClipboardList,
    },
    {
      label: "Follow-ups",
      to: "/dashboard/doctor/follow-ups",
      icon: History,
    },
    { label: "Profile", to: "/dashboard/doctor/profile", icon: UserRound },
  ],
  reception: [
    { label: "Dashboard", to: "/dashboard/reception", icon: LayoutDashboard },
    {
      label: "Walk-In",
      to: "/dashboard/reception/walk-in",
      icon: Users,
    },
    {
      label: "Live Queue",
      to: "/dashboard/reception/live-queue",
      icon: ListOrdered,
    },
    {
      label: "Payments",
      to: "/dashboard/reception/payments",
      icon: CreditCard,
    },
    {
      label: "Follow-up",
      to: "/dashboard/reception/follow-up",
      icon: History,
    },
  ],
  patient: [
    { label: "Dashboard", to: "/dashboard/patient", icon: LayoutDashboard },
    {
      label: "Appointments",
      to: "/dashboard/patient/appointments",
      icon: CalendarDays,
    },
    {
      label: "Prescriptions",
      to: "/dashboard/patient/prescriptions",
      icon: ClipboardList,
    },
    {
      label: "Medical record",
      to: "/dashboard/patient/record",
      icon: FileText,
    },
    { label: "Profile", to: "/dashboard/patient/profile", icon: UserRound },
  ],
}


// ──────────────────────────────────────────────
// Sidebar
// ──────────────────────────────────────────────
const Sidebar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userRole = useAppSelector((s) => s.auth.user?.role)
  const items = navByRole[userRole ?? ''] ?? []

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/auth/login')
  }

  return (
    <aside
      id="dashboard-sidebar"
      className="relative flex h-full w-[240px] flex-col border-r border-[#ebebeb] bg-white px-3 py-5 dark:border-white/10 dark:bg-[#0a0a0a]"
      aria-label="Dashboard sidebar"
    >
      {/* Brand */}
      <div className="mb-5 px-3">
        <span className="font-[Geist,Inter,system-ui] text-[14px] font-semibold tracking-[-0.28px] text-[#171717] dark:text-white">
          ClinicBook
        </span>
        <p className="mt-0.5 font-mono text-[11px] leading-4 text-[#888888] uppercase tracking-wide">
          {userRole}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5" aria-label="Sidebar navigation">
        {items.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>

      {/* Bottom logout */}
      <div className="mt-4 border-t border-[#ebebeb] pt-4 dark:border-white/10">
        <button
          type="button"
          aria-label="Log out"
          onClick={handleLogout}
          className="group flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-[14px] text-[#4d4d4d] transition-colors hover:bg-[#fafafa] hover:text-[#ee0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:text-[#888888] dark:hover:bg-white/5 dark:hover:text-[#ee0000] dark:focus-visible:ring-white"
        >
          <LogOut
            size={15}
            aria-hidden="true"
            className="shrink-0 text-[#888888] transition-colors group-hover:text-[#ee0000]"
          />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

