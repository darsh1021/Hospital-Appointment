import { Outlet } from "react-router-dom"
import Sidebar from "../components/common/sidebar/Sidebar"
import Header from "../components/common/Header"

const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a]">
            {/* ── Sidebar ── */}
            <Sidebar />

            {/* ── Main area ── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                <main
                    id="main-content"
                    className="flex-1 overflow-auto p-6"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
