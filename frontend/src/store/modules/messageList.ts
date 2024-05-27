
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
        setMessageList(state, action) {
            state.messageList = action.payload
        },
        appendMessageList(state, action) {
            state.messageList = [
                ...state.messageList,
                action.payload
            ]
        }
    }
})

const { setMessageList, appendMessageList } = messageListStore.actions;

const messageListReducer = messageListStore.reducer;

export { setMessageList, appendMessageList };
export default messageListReducer;