import { Stethoscope, Users, Award, HeartPulse } from "lucide-react"

const stats = [
  { label: "Patients served", value: "12,000+" },
  { label: "Specialist doctors", value: "80+" },
  { label: "Departments", value: "24" },
  { label: "Years of care", value: "15+" },
]

const values = [
  {
    icon: HeartPulse,
    title: "Patient-first care.",
    body: "Every decision we make starts with the question: does this make our patients' lives better?",
  },
  {
    icon: Stethoscope,
    title: "Clinical excellence.",
    body: "Our doctors are board-certified specialists committed to evidence-based, compassionate medicine.",
  },
  {
    icon: Award,
    title: "Transparency.",
    body: "Clear pricing, honest diagnoses, and open communication at every step of your care journey.",
  },
  {
    icon: Users,
    title: "Community.",
    body: "We treat the whole person — and the community they come from. Health starts outside the clinic.",
  },
]

const AboutPage = () => {
  return (
    <>
      <title>About Us — ClinicBook</title>
      <meta
        name="description"
        content="Learn about ClinicBook's mission to make healthcare simple, transparent, and accessible for everyone."
      />

      {/* ── Hero ── */}
      <section className="bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:py-28">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-[#888888]">
            Our story
          </p>
          <h1
            className="max-w-2xl text-[40px] font-semibold leading-[1.1] tracking-[-2px] text-[#171717] dark:text-white sm:text-[48px]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Built to make healthcare human again.
          </h1>
          <p className="mt-6 max-w-xl text-[18px] leading-7 text-[#4d4d4d] dark:text-[#888888]">
            ClinicBook started with a simple frustration: booking a doctor's
            appointment shouldn't require a phone call, a fax machine, or an
            afternoon on hold. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-[#ebebeb] bg-[#fafafa] dark:border-white/10 dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[11px] uppercase tracking-wide text-[#888888]">
                  {s.label}
                </dt>
                <dd className="mt-1 text-[32px] font-semibold leading-9 tracking-[-1.28px] text-[#171717] dark:text-white">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:py-28">
          <h2
            className="mb-12 text-[28px] font-semibold leading-9 tracking-[-1.12px] text-[#171717] dark:text-white"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            What we believe in.
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.title}
                  className="rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-8 dark:border-white/10 dark:bg-[#171717]"
                  style={{
                    boxShadow:
                      "inset 0 0 0 1px #0000000a, 0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a",
                  }}
                >
                  <Icon
                    size={20}
                    className="mb-4 text-[#888888]"
                    aria-hidden="true"
                  />
                  <h3 className="mb-2 text-[20px] font-semibold leading-7 tracking-[-0.6px] text-[#171717] dark:text-white">
                    {v.title}
                  </h3>
                  <p className="text-[16px] leading-6 text-[#4d4d4d] dark:text-[#888888]">
                    {v.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
