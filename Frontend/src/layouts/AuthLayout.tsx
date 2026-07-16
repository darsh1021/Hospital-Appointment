import { NavLink, Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div>
      <h1 className="text-center text-3xl">Auth Layout</h1>
      <nav className="text-center text-2xl my-4 bg-gray-200 p-4 rounded">
        <NavLink to="/auth/login" className="mx-2 hover:bg-gray-300 rounded-xl p-2"> Login</NavLink>
        <NavLink to="/auth/forgot-password" className="mx-2 hover:bg-gray-300 rounded-xl p-2"> Forgot Password</NavLink>
        <NavLink to="/auth/reset-password" className="mx-2 hover:bg-gray-300 rounded-xl p-2"> Reset Password</NavLink>        
      </nav>
      <Outlet />
    </div>
  )
}

export default AuthLayout
