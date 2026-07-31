import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authSlice from '../Features/auth/authSlice'
import appointmentSlice from '../Features/appointment/appointmentSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        appointment: appointmentSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
