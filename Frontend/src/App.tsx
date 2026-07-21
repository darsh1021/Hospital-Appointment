import { ThemeToggle } from "./components/common/ThemeToggle"

function App() {
  return (
    <>
      <div className="App max-w-7xl mt-10 mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <h1 className="text-center text-2xl">Clinic Management System..</h1>
      </div>
    </>
  )
}

export default App
