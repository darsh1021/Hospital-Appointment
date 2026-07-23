import { useState } from "react"
import { UserPlus, Phone, CreditCard, CheckCircle2 } from "lucide-react"

const ReceptionRegisterPatient = () => {
  const [visitType, setVisitType] = useState<"new" | "followup">("new")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
  const [feePaid, setFeePaid] = useState(false)

  const fee = visitType === "new" ? 400 : 200

  const inputClass =
    "w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2.5 text-[14px] text-[#171717] placeholder:text-[#888888] focus:border-[#171717] focus:outline-none dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#888888] dark:focus:border-white"

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-1.28px] text-[#171717] dark:text-white">
          Register Patient
        </h1>
        <p className="mt-1 md:mt-2 text-[15px] md:text-[16px] text-[#4d4d4d] dark:text-[#888888]">
          Add a walk-in patient to the live queue. Their token will be issued immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* ── Form ── */}
        <div className="flex flex-col gap-5 rounded-[12px] border border-[#ebebeb] bg-white p-5 md:p-8 shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#0a0a0a]">
          <p className="font-mono text-[12px] uppercase text-[#888888]">Patient Details</p>

          {/* Visit type toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717] dark:text-white">Visit Type</label>
            <div className="flex rounded-[8px] border border-[#ebebeb] overflow-hidden dark:border-white/10">
              {(["new", "followup"] as const).map(t => (
                <button
                  key={t}
                  id={`btn-visit-${t}`}
                  type="button"
                  onClick={() => setVisitType(t)}
                  className={`flex-1 py-2.5 text-[14px] font-medium transition ${
                    visitType === t
                      ? "bg-[#171717] text-white dark:bg-white dark:text-[#171717]"
                      : "bg-white text-[#888888] hover:bg-[#fafafa] dark:bg-[#0a0a0a] dark:hover:bg-white/5"
                  }`}
                >
                  {t === "new" ? "New Patient — ₹400" : "Follow-up — ₹200"}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="reg-name" className="text-[13px] font-medium text-[#171717] dark:text-white">
              Full Name <span className="text-[#ee0000]">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Patient's full name"
              className={inputClass}
            />
          </div>

          {/* Phone + Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-phone" className="text-[13px] font-medium text-[#171717] dark:text-white">
                Phone <span className="text-[#ee0000]">*</span>
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 00000 00000"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-age" className="text-[13px] font-medium text-[#171717] dark:text-white">
                Age
              </label>
              <input
                id="reg-age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 34"
                className={inputClass}
              />
            </div>
          </div>

          {/* Fee paid toggle */}
          <div className="flex items-center justify-between rounded-[8px] border border-[#ebebeb] bg-[#fafafa] px-4 py-3.5 dark:border-white/10 dark:bg-[#171717]">
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-[#888888]" />
              <div>
                <p className="text-[14px] font-medium text-[#171717] dark:text-white">Fee Collected</p>
                <p className="text-[12px] text-[#888888]">₹{fee} — {visitType === "new" ? "New Consultation" : "Follow-up"}</p>
              </div>
            </div>
            <button
              id="btn-fee-toggle"
              type="button"
              onClick={() => setFeePaid(f => !f)}
              className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${
                feePaid ? "bg-[#171717] dark:bg-white" : "bg-[#ebebeb] dark:bg-white/10"
              }`}
            >
              <span
                className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform dark:bg-[#171717] ${
                  feePaid ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Submit */}
          <button
            id="btn-add-to-queue"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171717] text-[15px] font-medium text-white transition hover:bg-[#171717]/90 disabled:opacity-40 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90"
            disabled={!name || !phone || !feePaid}
          >
            <UserPlus size={18} />
            Add to Queue
          </button>
          {!feePaid && (
            <p className="text-center text-[12px] text-[#888888]">
              Collect the fee before adding the patient to the queue.
            </p>
          )}
        </div>

        {/* ── Summary / instructions ── */}
        <div className="flex flex-col gap-4">
          {/* Token preview */}
          <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#ebebeb] bg-[#fafafa] py-8 px-6 dark:border-white/10 dark:bg-[#171717] text-center">
            <span className="font-mono text-[12px] uppercase text-[#888888]">Next Token</span>
            <span className="text-[56px] font-semibold tracking-[-2.4px] text-[#171717] leading-none mt-2 dark:text-white">
              #44
            </span>
            <span className="mt-3 inline-flex items-center rounded-full bg-white border border-[#ebebeb] px-3 py-1 text-[12px] font-medium text-[#171717] dark:bg-white/5 dark:border-white/10 dark:text-white">
              7 patients ahead
            </span>
          </div>

          {/* Steps */}
          <div className="flex flex-col rounded-[12px] border border-[#ebebeb] bg-white p-5 dark:border-white/10 dark:bg-[#0a0a0a]">
            <p className="font-mono text-[11px] uppercase text-[#888888] mb-4">Registration Steps</p>
            <div className="flex flex-col gap-3">
              {[
                { step: "01", text: "Confirm visit type (new or follow-up)" },
                { step: "02", text: "Enter patient name and phone number" },
                { step: "03", text: "Collect the appropriate fee" },
                { step: "04", text: "Toggle fee collected and submit" },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="font-mono text-[11px] text-[#888888] mt-0.5 shrink-0">{s.step}</span>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#888888]">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee reminder */}
          <div className="flex items-start gap-3 rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-4 dark:border-white/10 dark:bg-[#171717]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#0070f3]" />
            <p className="text-[12px] text-[#888888]">
              If a patient shows their previous prescription, they qualify for the{" "}
              <span className="font-medium text-[#171717] dark:text-white">₹200 follow-up fee</span>.
              Mark them as "Follow-up" above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceptionRegisterPatient
