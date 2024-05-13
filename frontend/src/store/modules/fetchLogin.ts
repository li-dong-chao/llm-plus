import { AppDispatch } from ".."
import { request } from "@/utils"
import { setLoginError, setToken } from "./user"


const fetchLogin = (loginForm: {
    username: string,
    password: string
}) => {
    return async (dispatch: AppDispatch) => {
        const res = await request.postForm('/login/access-token', loginForm)
        if (res.status === 200) {
            dispatch(setToken(res.data.access_token));
            return
        }
        if (res.status === 401) {
            dispatch(setLoginError(res.data.detail));
            return
        }
    }
}

export default fetchLogin;