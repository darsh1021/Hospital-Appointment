import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authSlice from '../Features/auth/authSlice'
import appointmentSlice from '../Features/appointment/appointmentSlice'
import adminSlice from '../Features/admin/adminSlice'
import doctorSlice from '../Features/doctor/doctorSlice'
import patientSlice from '../Features/patient/patientSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        appointment: appointmentSlice,
        admin: adminSlice,
        doctor: doctorSlice,
        patient: patientSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
