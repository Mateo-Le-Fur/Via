import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSidebar: false,
    panel: "",
    showFilter: false,
    filter: "",
    showList: false,
    showSuggestionBox: false,
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        handleShowSidebar: (state) => {
            state.showSidebar = true
        },
        handleHideSidebar: (state) => {
            state.showSidebar = false
        },
        activePanel: (state, action) => {
            state.panel = action.payload
        },
        handleShowFilter: (state) => {
            state.showFilter = !state.showFilter
        },
        activeFilter: (state, action) => {
            state.filter = action.payload
        },
        handleShowList: (state) => {
            state.showList = true
        },
        handleHideList: (state) => {
            state.showList = false
        },
        handleShowSuggestionBox: (state) => {
            state.showSuggestionBox = true
        },
        handleHideSuggestionBox: (state) => {
            state.showSuggestionBox = false
        },
    }
})

export const { handleShowSidebar, handleHideSidebar, activePanel, handleShowFilter, activeFilter, handleShowList, handleHideList, handleShowSuggestionBox, handleHideSuggestionBox } = globalSlice.actions

export default globalSlice.reducer