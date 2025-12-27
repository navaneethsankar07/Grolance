import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.jsx'
import { ModalProvider } from './hooks/modal/useModalStore.jsx'
import store, { persistor } from './app/store.js'
import {Provider} from 'react-redux'
import './api/axiosInterceptors.js'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ModalProvider>
    <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  </ModalProvider>
    </PersistGate>
    </Provider>
 // </StrictMode>,
)
