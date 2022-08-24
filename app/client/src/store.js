import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './features/global/globalSlice';
import authReducer from "./features/auth/authSlice";
import activityReducer from "./features/activity/activitySlice"

export const store = configureStore({
    reducer: {
        global: globalReducer,
        auth: authReducer,
        activity: activityReducer
    }
})