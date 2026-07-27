import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { router } from './app/routes'
import { store } from './app/store'
import { ThemeProvider } from './app/theme-provider'
import { AuthInit } from './app/AuthInit'
import './index.css'


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthInit>
          <RouterProvider router={router} />
        </AuthInit>
      </ThemeProvider>
    </Provider>
  // </StrictMode>,
)
