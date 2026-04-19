import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { setApiPort } from './api/client'

const init = async (): Promise<void> => {
  if (window.electron?.ipcRenderer) {
    try {
      const port = await window.electron.ipcRenderer.invoke('get-backend-port')
      if (typeof port === 'number') {
        setApiPort(port)
      }
    } catch {
      console.warn('Failed to get backend port, using default')
    }
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </StrictMode>
  )
}

init()
