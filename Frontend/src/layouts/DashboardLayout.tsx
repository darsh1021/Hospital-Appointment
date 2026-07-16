import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
    return (
        <div className="App max-w-7xl mt-10 mx-auto">
            <div className="dashboard-layout grid grid-[200px_1fr] gap-4">
                <div className="sidebar border-r">
                    <h1>Sidebar</h1>
                </div>
                <div className="content">
                    <h1 className="text-center text-3xl">Dashboard Content</h1>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout