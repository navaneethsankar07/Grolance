import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/client/account/auth/authslice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
    key: "auth",
    storage,
    // Added accessToken so the user stays logged in across refreshes
    whitelist: ["user", "accessToken"] 
}

const persistedAuthReducer = persistReducer(
    authPersistConfig,
    authReducer
)

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            // Required to avoid console errors with redux-persist
            serializableCheck: false, 
        })
});

export const persistor = persistStore(store);
export default store;