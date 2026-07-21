import { Outlet } from "react-router-dom"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"

const RootLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-[#fafafa] dark:bg-[#0a0a0a]">
            <Navbar />
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default RootLayout