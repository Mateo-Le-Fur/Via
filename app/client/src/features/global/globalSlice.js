import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSidebar: false,
    panel: "",
    showFilter: false,
    filter: "",
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        handleShowSidebar: (state) => {
            state.showSidebar = true
        },
        activePanel: (state, action) => {
            state.panel = action.payload
        },
        handleShowFilter: (state) => {
            state.showFilter = !state.showFilter
        },
        activeFilter: (state, action) => {
            state.filter = action.payload
        }
    }
})

export const {handleShowSidebar, activePanel, handleShowFilter, activeFilter} = globalSlice.actions

export default globalSlice.reducer