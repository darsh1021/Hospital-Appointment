import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <Outlet />
    </div>
  )
}

export default AuthLayout
