import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/user'
import messageListReducer from './modules/messageList'


const store = configureStore({
    reducer: {
        user: userReducer,
        messageList: messageListReducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store;