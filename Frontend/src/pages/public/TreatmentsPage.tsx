import { NavLink } from "react-router-dom"
import { ArrowRight, Heart, Brain, Bone, Eye, Baby, Stethoscope } from "lucide-react"

const treatments = [
  { icon: Heart, name: "Cardiology", desc: "Heart disease, hypertension, arrhythmia.", slug: "cardiology" },
  { icon: Brain, name: "Neurology", desc: "Stroke, epilepsy, migraine management.", slug: "neurology" },
  { icon: Bone, name: "Orthopaedics", desc: "Fractures, joint replacements, physio.", slug: "orthopaedics" },
  { icon: Eye, name: "Ophthalmology", desc: "Cataract, glaucoma, refractive surgery.", slug: "ophthalmology" },
  { icon: Baby, name: "Paediatrics", desc: "Newborn to adolescent primary care.", slug: "paediatrics" },
  { icon: Stethoscope, name: "General Medicine", desc: "Routine checkups, preventive care.", slug: "general" },
]

const TreatmentsPage = () => {
  return (
    <>
      <title>Treatments — ClinicBook</title>
      <meta
        name="description"
        content="Explore the range of medical specialties and treatments offered at ClinicBook's partner clinics."
      />

      {/* Hero */}
      <section className="bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:py-28">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-[#888888]">
            Specialties
          </p>
          <h1
            className="max-w-2xl text-[40px] font-semibold leading-[1.1] tracking-[-2px] text-[#171717] dark:text-white sm:text-[48px]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            World-class care, every specialty.
          </h1>
          <p className="mt-6 max-w-lg text-[18px] leading-7 text-[#4d4d4d] dark:text-[#888888]">
            From routine checkups to complex procedures, our network covers the
            full spectrum of modern medicine.
          </p>
        </div>
      </section>

      {/* Treatment cards */}
      <section className="bg-[#fafafa] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((t) => {
              const Icon = t.icon
              return (
                <div
                  key={t.slug}
                  className="group flex flex-col justify-between rounded-[8px] border border-[#ebebeb] bg-white p-6 transition-shadow hover:shadow-[0px_2px_2px_#0000000a,0px_8px_16px_-4px_#0000000a] dark:border-white/10 dark:bg-[#171717]"
                  style={{ boxShadow: "inset 0 0 0 1px #0000000a, 0px 1px 1px #00000005" }}
                >
                  <div>
                    <div className="mb-4 inline-flex size-10 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] dark:bg-white/5 dark:border-white/10">
                      <Icon size={18} className="text-[#171717] dark:text-white" aria-hidden="true" />
                    </div>
                    <h2 className="mb-1.5 text-[16px] font-semibold leading-6 tracking-[-0.32px] text-[#171717] dark:text-white">
                      {t.name}
                    </h2>
                    <p className="text-[14px] leading-5 tracking-[-0.28px] text-[#4d4d4d] dark:text-[#888888]">
                      {t.desc}
                    </p>
                  </div>
                  <NavLink
                    to={`/book-token?dept=${t.slug}`}
                    className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[#0070f3] transition-colors hover:text-[#0761d1] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#0070f3]"
                  >
                    Book appointment
                    <ArrowRight size={13} aria-hidden="true" />
                  </NavLink>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default TreatmentsPage
