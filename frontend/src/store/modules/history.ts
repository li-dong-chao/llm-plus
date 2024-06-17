
import { createSlice } from "@reduxjs/toolkit";
import { conversationType } from "@/schemas";

const initialState: {
    history: conversationType[]
} = {
    history: []
}

const historyStore = createSlice({
    name: "history",
    initialState: initialState,
    reducers: {
        setHistory(state, action) {
            state.history = action.payload
        }
    }
})

const { setHistory } = historyStore.actions;

const historyReducer = historyStore.reducer;

export { setHistory };
export default historyReducer;