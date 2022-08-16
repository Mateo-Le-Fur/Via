import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './features/global/globalSlice';
import authReducer from "./features/auth/authSlice"

export const store = configureStore({
    reducer: {
        global: globalReducer,
        auth: authReducer
    }
})