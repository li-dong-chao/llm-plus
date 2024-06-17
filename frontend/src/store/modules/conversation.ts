
import { createSlice } from "@reduxjs/toolkit";
import { conversationType } from "@/schemas"

const initialState: {
    conversation: conversationType
} = {
    conversation: []
}

const conversationStore = createSlice({
    name: "conversation",
    initialState: initialState,
    reducers: {
        setConversation(state, action) {
            state.conversation = action.payload
        },
        addMessage(state, action) {
            state.conversation = [
                ...state.conversation,
                action.payload
            ]
        },
        clearConversation(state) {
            state.conversation = []
        }
    }
})

const { setConversation, addMessage, clearConversation } = conversationStore.actions;

const conversationReducer = conversationStore.reducer;

export { setConversation, addMessage, clearConversation };
export default conversationReducer;