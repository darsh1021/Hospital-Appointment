import { MapPin, Phone, Mail, Clock } from "lucide-react"

const info = [
  { icon: MapPin, label: "Address", value: "42 Health Avenue, Medical District, Mumbai 400001" },
  { icon: Phone, label: "Phone", value: "+91 22 4567 8900" },
  { icon: Mail, label: "Email", value: "hello@clinicbook.in" },
  { icon: Clock, label: "Hours", value: "Mon–Sat: 8 am – 8 pm · Sun: 10 am – 4 pm" },
]

const ContactPage = () => {
  return (
    <>
      <title>Contact Us — ClinicBook</title>
      <meta
        name="description"
        content="Get in touch with the ClinicBook team. Find our address, phone number, and send us a message."
      />

      {/* Hero */}
      <section className="bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:py-28">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-[#888888]">
            Get in touch
          </p>
          <h1
            className="max-w-xl text-[40px] font-semibold leading-[1.1] tracking-[-2px] text-[#171717] dark:text-white sm:text-[48px]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            We're here to help.
          </h1>
          <p className="mt-6 max-w-md text-[18px] leading-7 text-[#4d4d4d] dark:text-[#888888]">
            Questions, feedback, or just want to say hello — reach out and our
            team will get back to you within one business day.
          </p>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="bg-[#fafafa] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">

            {/* Info column */}
            <div>
              <h2 className="mb-8 text-[20px] font-semibold leading-7 tracking-[-0.6px] text-[#171717] dark:text-white">
                Contact details
              </h2>
              <dl className="flex flex-col gap-6">
                {info.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex gap-3">
                      <dt className="flex size-8 shrink-0 items-center justify-center rounded-[6px] border border-[#ebebeb] bg-white dark:border-white/10 dark:bg-[#171717]">
                        <Icon size={14} className="text-[#888888]" aria-hidden="true" />
                      </dt>
                      <dd className="flex flex-col">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#888888]">
                          {item.label}
                        </span>
                        <span className="mt-0.5 text-[14px] leading-5 tracking-[-0.28px] text-[#171717] dark:text-white">
                          {item.value}
                        </span>
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>

            {/* Contact form */}
            <div
              className="rounded-[12px] border border-[#ebebeb] bg-white p-8 dark:border-white/10 dark:bg-[#171717]"
              style={{ boxShadow: "inset 0 0 0 1px #0000000a, 0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a" }}
            >
              <h2 className="mb-6 text-[20px] font-semibold leading-7 tracking-[-0.6px] text-[#171717] dark:text-white">
                Send us a message
              </h2>

              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name…"
                      className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="you@example.com…"
                      className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    autoComplete="off"
                    placeholder="How can we help?…"
                    className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us more…"
                    className="resize-none rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
