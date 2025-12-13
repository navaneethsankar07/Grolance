import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.jsx'
import { ModalProvider } from './hooks/modal/useModalStore.jsx'
import store from './app/store.js'
import {Provider} from 'react-redux'
import './api/axiosInterceptors.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

    <ModalProvider>
    <App />
  </ModalProvider>
    </Provider>
  </StrictMode>,
)
