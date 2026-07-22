export const PatientLoginForm = () => {
  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="patient-name"
            className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
          >
            Patient Name
          </label>
          <input
            id="patient-name"
            type="text"
            name="name"
            spellCheck={false}
            placeholder="username"
            required
            className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
          />
        </div>

        {/* Number */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="patient-number"
            className="text-[13px] font-medium leading-4 text-[#171717] dark:text-white"
          >
            Phone Number
          </label>
          <input
            id="patient-number"
            type="tel"
            name="number"
            placeholder="1112223333"
            required
            className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
