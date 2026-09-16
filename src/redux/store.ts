import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import artisanReducer from "./slices/artisanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artisan: artisanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;