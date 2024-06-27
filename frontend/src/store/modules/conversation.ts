
import { createSlice } from "@reduxjs/toolkit";
import { conversationType } from "@/schemas"

const initialState: {
    conversation: conversationType
} = {
    conversation: {
        title: "未命名对话",
        messages: []
    }
}

const conversationStore = createSlice({
    name: "conversation",
    initialState: initialState,
    reducers: {
        setConversation(state, action) {
            state.conversation = action.payload
        },
        setConversationTitle(state, action) {
            state.conversation = {
                title: action.payload,
                messages: state.conversation.messages,
            }
        },
        addMessage(state, action) {
            state.conversation = {
                title: state.conversation.title,
                messages: [
                    ...state.conversation.messages,
                    action.payload
                ]
            }
        },
        clearConversation(state) {
            state.conversation = {
                title: "未命名对话",
                messages: []
            }
        }
    }
})

const { setConversation, addMessage, clearConversation, setConversationTitle } = conversationStore.actions;

const conversationReducer = conversationStore.reducer;

export { setConversation, addMessage, clearConversation, setConversationTitle };
export default conversationReducer;