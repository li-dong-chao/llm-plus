
import { createSlice } from "@reduxjs/toolkit";
import { setToken as _setToken } from "@/utils";

const userStore = createSlice({
    name: "user",
    initialState: {
        token: "",
        loginError: ""
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload
            _setToken(action.payload)
        },
        setLoginError(state, action) {
            state.loginError = action.payload
        }
    }
})

const { setToken, setLoginError } = userStore.actions;

const userReducer = userStore.reducer;

export { setToken, setLoginError };
export default userReducer;