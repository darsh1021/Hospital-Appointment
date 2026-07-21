import { CalendarDays, Stethoscope, ShieldCheck } from "lucide-react"

// ── Feature card data ──
export const features = [
  {
    icon: CalendarDays,
    title: "Instant booking.",
    body: "Reserve your slot online in under 60 seconds. No waiting on hold, no phone tag.",
    orb: "radial-gradient(ellipse 70% 60% at 80% 20%, #a7e5d3 0%, transparent 70%)",
  },
  {
    icon: Stethoscope,
    title: "Expert specialists.",
    body: "Browse verified doctors across every department — filter by specialty or next availability.",
    orb: "radial-gradient(ellipse 70% 60% at 20% 80%, #c8b8e0 0%, transparent 70%)",
  },
  {
    icon: ShieldCheck,
    title: "Secure records.",
    body: "Your health data is encrypted end-to-end and governed by strict access controls.",
    orb: "radial-gradient(ellipse 70% 60% at 80% 80%, #f4c5a8 0%, transparent 70%)",
  },
]

export const stats = [
  { value: "12,000+", label: "Patients served" },
  { value: "80+",     label: "Specialist doctors" },
  { value: "24",      label: "Departments" },
  { value: "< 60 s", label: "Avg. booking time" },
]

export const orbCards = [
  {
    orb: "radial-gradient(ellipse 80% 70% at 50% 30%, #a7e5d3 0%, #f4c5a8 50%, transparent 100%)",
    label: "Online Booking",
    title: "Your slot, your time.",
    body: "Skip the call queue. Book, reschedule, or cancel any appointment directly from your phone.",
  },
  {
    orb: "radial-gradient(ellipse 80% 70% at 50% 30%, #c8b8e0 0%, #a8c8e8 50%, transparent 100%)",
    label: "Live Queue",
    title: "Walk in exactly on time.",
    body: "Your live token position and estimated wait update every 30 seconds. No sitting in waiting rooms.",
  },
  {
    orb: "radial-gradient(ellipse 80% 70% at 50% 30%, #e8b8c4 0%, #f4c5a8 50%, transparent 100%)",
    label: "Health Records",
    title: "Everything, in one place.",
    body: "Prescriptions, reports, and follow-up notes — securely stored and accessible whenever you need them.",
  },
]

export const testimonials = [
  {
    name: "Riya Sharma",
    role: "Patient",
    quote:
      "I booked a cardiology slot in under a minute. The live queue tracker meant I didn't have to sit in the waiting room the whole time.",
    rating: 5,
  },
  {
    name: "Dr. Farhan Qureshi",
    role: "General Physician",
    quote:
      "The dashboard gives me a real-time view of my queue. No-shows are down 40% since patients can see exactly when it's their turn.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Patient",
    quote:
      "Getting prescriptions and reports in one place saves so much time. The design is the cleanest healthcare app I've used.",
    rating: 5,
  },
]
