import { CreditCard, TrendingUp, CheckCircle2, XCircle, IndianRupee } from "lucide-react"

type PaymentRecord = {
  id: number
  token: number
  name: string
  visitType: "New Consultation" | "Follow-up"
  amount: number
  method: "Cash" | "UPI"
  time: string
  status: "collected" | "pending"
}

const payments: PaymentRecord[] = [
  { id: 1, token: 42, name: "Priya Sharma",   visitType: "Follow-up",        amount: 200, method: "UPI",  time: "11:05 AM", status: "collected" },
  { id: 2, token: 41, name: "Anita Desai",    visitType: "Follow-up",        amount: 200, method: "Cash", time: "11:15 AM", status: "collected" },
  { id: 3, token: 43, name: "Rahul Mehta",    visitType: "New Consultation",  amount: 400, method: "Cash", time: "11:32 AM", status: "collected" },
  { id: 4, token: 44, name: "Meena Joshi",    visitType: "Follow-up",        amount: 200, method: "UPI",  time: "12:01 PM", status: "collected" },
  { id: 5, token: 45, name: "Karan Patel",    visitType: "New Consultation",  amount: 400, method: "UPI",  time: "12:15 PM", status: "collected" },
  { id: 6, token: 46, name: "Geeta Iyer",     visitType: "New Consultation",  amount: 400, method: "Cash", time: "12:30 PM", status: "pending"   },
]

const totalCollected = payments.filter(p => p.status === "collected").reduce((s, p) => s + p.amount, 0)
const cashTotal = payments.filter(p => p.status === "collected" && p.method === "Cash").reduce((s, p) => s + p.amount, 0)
const upiTotal  = payments.filter(p => p.status === "collected" && p.method === "UPI").reduce((s, p) => s + p.amount, 0)
const pendingTotal = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0)

const ReceptionPayments = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          Payments
        </h1>
        <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Today's fee collection summary. Fees are ₹400 (new) or ₹200 (follow-up).
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Collected", value: `₹${totalCollected.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-[#171717] dark:text-white", featured: true },
          { label: "Cash",            value: `₹${cashTotal.toLocaleString("en-IN")}`,      icon: CreditCard,  color: "text-[#171717] dark:text-white", featured: false },
          { label: "UPI",             value: `₹${upiTotal.toLocaleString("en-IN")}`,       icon: TrendingUp,  color: "text-[#0070f3]",                  featured: false },
          { label: "Pending",         value: `₹${pendingTotal.toLocaleString("en-IN")}`,   icon: XCircle,     color: "text-[#ee0000]",                  featured: false },
        ].map(card => (
          <div
            key={card.label}
            className={`flex flex-col gap-2 md:gap-3 rounded-[12px] border p-4 md:p-5 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] ${
              card.featured
                ? "border-[#171717] bg-[#171717] dark:border-white dark:bg-white"
                : "border-[#ebebeb] bg-white dark:border-white/10 dark:bg-[#0a0a0a]"
            }`}
          >
            <card.icon size={16} className={card.featured ? "text-white dark:text-[#171717]" : card.color} />
            <div>
              <p className={`text-[22px] md:text-[26px] font-semibold tracking-[-1.28px] leading-none ${
                card.featured ? "text-white dark:text-[#171717]" : "text-[#171717] dark:text-white"
              }`}>
                {card.value}
              </p>
              <p className={`mt-1 text-[11px] md:text-[12px] ${card.featured ? "text-white/60 dark:text-[#171717]/60" : "text-[#888888]"}`}>
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment log */}
      <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a] overflow-hidden">
        <div className="border-b border-[#ebebeb] px-5 md:px-6 py-4 dark:border-white/10">
          <h2 className="font-mono text-[12px] uppercase text-[#888888]">Payment Log — Today</h2>
        </div>

        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[52px_1fr_160px_80px_90px_100px_110px] gap-3 border-b border-[#ebebeb] bg-[#fafafa] px-6 py-3 dark:border-white/10 dark:bg-[#171717]">
          {["#", "Patient", "Visit Type", "Amount", "Method", "Time", "Status"].map(h => (
            <span key={h} className="font-mono text-[11px] uppercase text-[#888888]">{h}</span>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-[#ebebeb] dark:divide-white/10">
          {payments.map(p => (
            <div
              key={p.id}
              className="flex flex-col md:grid md:grid-cols-[52px_1fr_160px_80px_90px_100px_110px] gap-2 md:gap-3 px-5 md:px-6 py-4 items-start md:items-center"
            >
              {/* Mobile: token + status row */}
              <div className="flex items-center justify-between w-full md:contents">
                <span className="font-mono text-[13px] font-semibold text-[#171717] dark:text-white">#{p.token}</span>
                <span className={`md:hidden inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  p.status === "collected"
                    ? "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                    : "bg-[#ffefcf] text-[#ab570a] dark:bg-[#f5a623]/20 dark:text-[#f5a623]"
                }`}>
                  {p.status === "collected" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                  {p.status === "collected" ? "Collected" : "Pending"}
                </span>
              </div>

              {/* Name */}
              <p className="text-[13px] md:text-[14px] font-medium text-[#171717] dark:text-white">{p.name}</p>

              {/* Visit type */}
              <p className="text-[12px] md:text-[13px] text-[#888888]">{p.visitType}</p>

              {/* Amount */}
              <p className="text-[13px] font-mono text-[#171717] dark:text-white">₹{p.amount}</p>

              {/* Method */}
              <span className="inline-flex items-center rounded-full bg-[#fafafa] border border-[#ebebeb] px-2 py-0.5 text-[11px] text-[#4d4d4d] dark:border-white/10 dark:bg-white/5 dark:text-[#888888]">
                {p.method}
              </span>

              {/* Time */}
              <p className="text-[12px] md:text-[13px] text-[#888888]">{p.time}</p>

              {/* Status (desktop) */}
              <span className={`hidden md:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                p.status === "collected"
                  ? "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                  : "bg-[#ffefcf] text-[#ab570a] dark:bg-[#f5a623]/20 dark:text-[#f5a623]"
              }`}>
                {p.status === "collected" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                {p.status === "collected" ? "Collected" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReceptionPayments
