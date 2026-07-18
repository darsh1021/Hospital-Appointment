import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-300">
            <div className="mx-auto grid max-w-8xl grid-cols-[280px_1fr]">
                <aside className="min-h-screen border-r border-gray-200 bg-white p-6">
                    <h2 className="mb-4 text-lg font-medium">Navigation</h2>
                </aside>

                <div className="flex min-h-screen flex-col">
                    {/* Header */}
                    <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Dashboard
                            </h1>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">Welcome, User</span>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout