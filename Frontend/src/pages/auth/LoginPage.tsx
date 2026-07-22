import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Stethoscope } from "lucide-react"
import { StaffLoginForm } from "../../components/auth/StaffLoginForm"
import { PatientLoginForm } from "../../components/auth/PatientLoginForm"

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'staff'>('patient')

  return (
    <>
      <title>Log In — ClinicBook</title>
      <meta name="description" content="Sign in to your ClinicBook account." />

      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-12 dark:bg-[#0a0a0a]">
        <div className="w-full max-w-[400px]">

          {/* Brand mark */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <span className="flex size-10 items-center justify-center rounded-[8px] bg-[#171717] text-white dark:bg-white dark:text-[#171717]">
              <Stethoscope size={18} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.6px] text-[#171717] dark:text-white">
                Welcome back.
              </h1>
              <p className="mt-1 text-[14px] leading-5 text-[#888888]">
                Sign in to your ClinicBook account.
              </p>
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-[12px] border border-[#ebebeb] bg-white p-8 dark:border-white/10 dark:bg-[#171717]"
            style={{ boxShadow: "inset 0 0 0 1px #0000000a, 0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a" }}
          >
            {/* Tabs / Slider */}
            <div className="mb-6 flex rounded-[8px] bg-[#f4f4f5] p-1 dark:bg-[#27272a]">
              <button
                type="button"
                onClick={() => setActiveTab('patient')}
                className={`flex-1 rounded-[6px] py-1.5 text-[13px] font-medium transition-all ${
                  activeTab === 'patient'
                    ? 'bg-white text-[#171717] shadow-sm dark:bg-[#3f3f46] dark:text-white'
                    : 'text-[#71717a] hover:text-[#171717] dark:text-[#a1a1aa] dark:hover:text-white'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={`flex-1 rounded-[6px] py-1.5 text-[13px] font-medium transition-all ${
                  activeTab === 'staff'
                    ? 'bg-white text-[#171717] shadow-sm dark:bg-[#3f3f46] dark:text-white'
                    : 'text-[#71717a] hover:text-[#171717] dark:text-[#a1a1aa] dark:hover:text-white'
                }`}
              >
                Staff
              </button>
            </div>

            {activeTab === 'patient' ? <PatientLoginForm /> : <StaffLoginForm />}
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-[13px] text-[#888888]">
            Don't have an account?{" "}
            <NavLink
              to="/auth/signup"
              className="text-[#0070f3] hover:text-[#0761d1] focus-visible:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#0070f3]"
            >
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginPage
