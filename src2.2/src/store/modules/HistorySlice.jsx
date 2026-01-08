import { createSlice } from '@reduxjs/toolkit'

const HistorySlice = createSlice({
    name: 'HistorySlice',
    initialState: {
        history: localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : []
    },
    reducers: {
        addHistory(state, action){
            state.history.push(action.payload)
            localStorage.setItem('history', JSON.stringify(state.history))
        }
    }
})

export default HistorySlice
export const {addHistory}=HistorySlice.actions