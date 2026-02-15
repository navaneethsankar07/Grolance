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
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
};
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
<PersistGate
  persistor={persistor}
  onBeforeLift={() => {
    store.dispatch({ type: "app/rehydrated" });
  }}
>    <ModalProvider>
    <QueryClientProvider client={queryClient}>
    <PayPalScriptProvider options={initialOptions}>
    <App />
</PayPalScriptProvider>
  </QueryClientProvider>
  </ModalProvider>
    </PersistGate>
    </Provider>
 // </StrictMode>,

)
