import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/client/account/auth/authslice";
import { persistReducer, persistStore, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

const resettableRootReducer = (state, action) => {
  if (
    action.type === "auth/logout" ||
    action.type === "auth/logout/fulfilled"
  ) {
    storage.removeItem("persist:auth");
    state = undefined;
  }
  return rootReducer(state, action);
};

const store = configureStore({
  reducer: resettableRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
