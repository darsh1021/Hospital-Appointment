import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/store"
import { loginPatientUser } from "../../Features/auth/authSlice"

export const PatientLoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    number: "",
  })

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.number.trim()) {
      try {
        const response = await dispatch(
          loginPatientUser({
            name: formData.name.trim() || undefined,
            number: formData.number.trim(),
          })
        ).unwrap()
        console.log(response)
        if (response?.user) {
          navigate("/dashboard/patient")
        }
      } catch (err: any) {
        console.error("Patient login failed", err)
      }
    }
  }

  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-4" onSubmit={handlePatientLogin}>
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            spellCheck={false}
            placeholder="Full Name (optional)"
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
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            placeholder="e.g. 9876543210"
            required
            className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-[14px] text-[#171717] placeholder:text-[#888888] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-[#555] dark:focus-visible:ring-white"
          />
        </div>

        {error && (
          <div className="rounded-[6px] bg-[#fef2f2] p-2.5 text-[13px] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#171717] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1 dark:bg-white dark:text-[#171717] dark:hover:bg-[#e0e0e0]"
        >
          {loading ? "Logging in..." : "Continue"}
        </button>
      </form>
    </div>
  )
}

