import HistorySlice from './modules/HistorySlice'
import { configureStore } from '@reduxjs/toolkit'

let store=configureStore({
    reducer:{
        HistorySlice:HistorySlice.reducer
    }
})

export default store