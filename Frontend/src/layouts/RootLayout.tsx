import { Outlet } from "react-router-dom"

const RootLayout = () => {
    return (
        <div className="App max-w-7xl mt-10 mx-auto">
            <h1 className="text-center text-3xl">Header</h1>
            <Outlet />
            <h1 className="text-center text-3xl">Footer</h1>
        </div>
    )
}

export default RootLayout