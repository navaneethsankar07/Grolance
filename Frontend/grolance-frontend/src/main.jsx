import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.jsx'
import { ModalProvider } from './hooks/modal/useModalStore.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModalProvider>
    <App />
  </ModalProvider>
  </StrictMode>,
)
