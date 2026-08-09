import { CalendarDays, Clock, UserRound, CheckCircle2 } from "lucide-react"

export const steps = [
  {
    icon: UserRound,
    step: "01",
    title: "Choose a doctor.",
    desc: "Search by specialty, name, or department and see real-time availability.",
  },
  {
    icon: CalendarDays,
    step: "02",
    title: "Pick a slot.",
    desc: "Select an open date and time that works for you — no phone call needed.",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Confirm.",
    desc: "Receive your token number instantly via SMS and email.",
  },
  {
    icon: Clock,
    step: "04",
    title: "Track live.",
    desc: "Watch your queue position update every 30 seconds in real-time.",
  },
]

export const departments = [
    "General Medicine",
    "Dermatology",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "ENT"
]

export const queuePatients = [
  { token: 38, name: "Arjun M.",    dept: "Cardiology",    wait: "now",    status: "active"  },
  { token: 39, name: "Priya K.",    dept: "Neurology",     wait: "~4 min", status: "waiting" },
  { token: 40, name: "Rohit S.",    dept: "Orthopaedics",  wait: "~8 min", status: "waiting" },
  { token: 41, name: "Divya P.",    dept: "Cardiology",    wait: "~12 min",status: "waiting" },
  { token: 42, name: "Meera T.",    dept: "Paediatrics",   wait: "~16 min",status: "waiting" },
]
