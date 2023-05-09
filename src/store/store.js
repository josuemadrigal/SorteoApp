import { configureStore } from '@reduxjs/toolkit';
import {RegistroSlice} from './storeRegistro';


export const store = configureStore({
    reducer: {

        registro: RegistroSlice.reducer

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export * from './store';
