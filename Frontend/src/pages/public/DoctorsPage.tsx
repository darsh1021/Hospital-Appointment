import { NavLink } from "react-router-dom"
import { ArrowRight, Star } from "lucide-react"

const doctors = [
  { id: "d1", name: "Dr. Aisha Khan", specialty: "Cardiologist", exp: "12 yrs", rating: 4.9, available: true },
  { id: "d2", name: "Dr. Rohan Mehta", specialty: "Neurologist", exp: "9 yrs", rating: 4.8, available: true },
  { id: "d3", name: "Dr. Priya Sharma", specialty: "Paediatrician", exp: "7 yrs", rating: 4.9, available: false },
  { id: "d4", name: "Dr. Vikram Nair", specialty: "Orthopaedic Surgeon", exp: "15 yrs", rating: 4.7, available: true },
  { id: "d5", name: "Dr. Sunita Rao", specialty: "Ophthalmologist", exp: "10 yrs", rating: 4.8, available: true },
  { id: "d6", name: "Dr. Farhan Qureshi", specialty: "General Physician", exp: "6 yrs", rating: 4.6, available: false },
]

// Initials avatar background palette
const avatarColors = ["#007cf0", "#7928ca", "#ff4d4d", "#00dfd8", "#ff0080", "#f9cb28"]

const DoctorsPage = () => {
  return (
    <>
      <title>Our Doctors — ClinicBook</title>
      <meta
        name="description"
        content="Meet our team of board-certified specialists. Browse profiles and book an appointment online."
      />

      {/* Hero */}
      <section className="bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:py-28">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-[#888888]">
            Medical team
          </p>
          <h1
            className="max-w-2xl text-[40px] font-semibold leading-[1.1] tracking-[-2px] text-[#171717] dark:text-white sm:text-[48px]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Specialists you can trust.
          </h1>
          <p className="mt-6 max-w-lg text-[18px] leading-7 text-[#4d4d4d] dark:text-[#888888]">
            Every doctor in our network is board-certified, peer-reviewed, and
            committed to patient-first care.
          </p>
        </div>
      </section>

      {/* Doctor cards */}
      <section className="bg-[#fafafa] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doc, i) => (
              <article
                key={doc.id}
                className="rounded-[8px] border border-[#ebebeb] bg-white p-6 dark:border-white/10 dark:bg-[#171717]"
                style={{ boxShadow: "inset 0 0 0 1px #0000000a, 0px 1px 1px #00000005, 0px 2px 2px #0000000a" }}
              >
                {/* Avatar */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-full text-[16px] font-semibold text-white"
                    style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
                    aria-hidden="true"
                  >
                    {doc.name.split(" ").map((n) => n[0]).join("").slice(1, 3)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-semibold leading-5 tracking-[-0.3px] text-[#171717] dark:text-white">
                      {doc.name}
                    </h2>
                    <p className="text-[13px] leading-4 text-[#888888]">{doc.specialty}</p>
                  </div>
                </div>

                {/* Meta row */}
                <div className="mb-4 flex items-center gap-4 text-[13px] text-[#4d4d4d] dark:text-[#888888]">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-[#f9cb28]" aria-hidden="true" />
                    {doc.rating}
                  </span>
                  <span>{doc.exp} experience</span>
                </div>

                {/* Availability + CTA */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${
                      doc.available
                        ? "bg-[#d3e5ff] text-[#0070f3] dark:bg-[#0070f3]/20 dark:text-[#50b4ff]"
                        : "bg-[#fafafa] text-[#888888] dark:bg-white/5"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${doc.available ? "bg-[#0070f3]" : "bg-[#888888]"}`}
                      aria-hidden="true"
                    />
                    {doc.available ? "Available" : "Unavailable"}
                  </span>
                  {doc.available && (
                    <NavLink
                      to={`/book-token?doctor=${doc.id}`}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0070f3] transition-colors hover:text-[#0761d1] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#0070f3]"
                    >
                      Book
                      <ArrowRight size={13} aria-hidden="true" />
                    </NavLink>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default DoctorsPage
