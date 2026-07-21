import { CalendarDays, Clock, UserRound, CheckCircle2 } from "lucide-react"

const steps = [
  { icon: UserRound, step: "01", title: "Choose a doctor.", desc: "Search by specialty, name, or department." },
  { icon: CalendarDays, step: "02", title: "Pick a slot.", desc: "Select an open date and time that works for you." },
  { icon: CheckCircle2, step: "03", title: "Confirm.", desc: "Receive your token number via SMS and email." },
  { icon: Clock, step: "04", title: "Track live.", desc: "Watch your queue position update in real-time." },
]

const BookTokenPage = () => {
  return (
    <>
      <title>Book Appointment — ClinicBook</title>
      <meta
        name="description"
        content="Book a doctor appointment online in minutes. Choose your specialist, pick a time, and get your token."
      />

      {/* Hero */}
      <section className="bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:py-28">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-[#888888]">
            Online booking
          </p>
          <h1
            className="max-w-2xl text-[40px] font-semibold leading-[1.1] tracking-[-2px] text-[#171717] dark:text-white sm:text-[48px]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Book your appointment.
          </h1>
          <p className="mt-6 max-w-lg text-[18px] leading-7 text-[#4d4d4d] dark:text-[#888888]">
            No phone calls, no waiting. Book a slot online, get your token, and
            walk in when it's your turn.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#fafafa] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-24">
          <h2
            className="mb-12 text-[28px] font-semibold leading-9 tracking-[-1.12px] text-[#171717] dark:text-white"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            How it works.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.step}
                  className="rounded-[8px] border border-[#ebebeb] bg-white p-6 dark:border-white/10 dark:bg-[#171717]"
                  style={{ boxShadow: "inset 0 0 0 1px #0000000a, 0px 1px 1px #00000005" }}
                >
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-[#888888]">
                    {s.step}
                  </p>
                  <Icon size={20} className="mb-3 text-[#171717] dark:text-white" aria-hidden="true" />
                  <h3 className="mb-1.5 text-[16px] font-semibold leading-6 tracking-[-0.32px] text-[#171717] dark:text-white">
                    {s.title}
                  </h3>
                  <p className="text-[14px] leading-5 tracking-[-0.28px] text-[#4d4d4d] dark:text-[#888888]">
                    {s.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Booking form placeholder */}
      <section className="bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[680px] px-6 py-16 lg:py-24">
          <div
            className="rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-8 dark:border-white/10 dark:bg-[#171717]"
            style={{ boxShadow: "inset 0 0 0 1px #0000000a, 0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a" }}
          >
            <h2 className="mb-6 text-[20px] font-semibold leading-7 tracking-[-0.6px] text-[#171717] dark:text-white">
              Request an appointment
            </h2>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              {/* Department */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="dept-select"
                  className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                >
                  Department
                </label>
                <select
                  id="dept-select"
                  name="department"
                  autoComplete="off"
                  className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:focus-visible:ring-white"
                >
                  <option value="">Select a department…</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopaedics">Orthopaedics</option>
                  <option value="ophthalmology">Ophthalmology</option>
                  <option value="paediatrics">Paediatrics</option>
                  <option value="general">General Medicine</option>
                </select>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="patient-name"
                  className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                >
                  Patient name
                </label>
                <input
                  id="patient-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Full name…"
                  className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
                />
              </div>
              {/* Number */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="patient-number"
                  className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                >
                  Enter number
                </label>
                <input
                  id="patient-number"
                  type="number"
                  name="number"
                  autoComplete="number"
                  placeholder="Number…"
                  className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0] cursor-pointer active:bg-[#2a2a2a] dark:active:bg-[#e0e0e0]"
              >
                Get Token
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default BookTokenPage
