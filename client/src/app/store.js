import { configureStore , combineReducers} from '@reduxjs/toolkit'
import authReducer from '../features/client/account/auth/authslice'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore,PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    auth: authReducer,
});

const resettableRootReducer = (state, action) => {
    if (action.type === 'auth/logout') {
        storage.removeItem('persist:auth');
        state = undefined;
    }
    return rootReducer(state, action);
};

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["user"] 
}

const persistedReducer = persistReducer(authPersistConfig, resettableRootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false

        })
});

export const persistor = persistStore(store);
export default store;