
import { createSlice } from "@reduxjs/toolkit";
import { messageType } from "@/schemas";

const initialState: {
    messageList: messageType[]
} = {
    messageList: []
}

const messageListStore = createSlice({
    name: "messageList",
    initialState: initialState,
    reducers: {
        resetMessageList(state) {
            state.messageList = []
        },
        appendMessageList(state, action) {
            state.messageList = [
                ...state.messageList,
                action.payload
            ]
        },
        setMessageList(state, action) {
            state.messageList = action.payload
        }
    }
})

const { resetMessageList, appendMessageList, setMessageList } = messageListStore.actions;

const messageListReducer = messageListStore.reducer;

export { resetMessageList, appendMessageList, setMessageList };
export default messageListReducer;