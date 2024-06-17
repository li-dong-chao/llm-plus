import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/user'
import historyReducer from './modules/history'
import conversationReducer from './modules/conversation'


const store = configureStore({
    reducer: {
        user: userReducer,
        history: historyReducer,
        conversation: conversationReducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store;