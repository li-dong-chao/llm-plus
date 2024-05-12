import { AppDispatch } from ".."
import { request } from "@/utils"
import { setToken } from "./user"


const fetchLogin = (loginForm: {
    username: string,
    password: string
}) => {
    return async (dispatch: AppDispatch) => {
        const res = await request.postForm('/login/access-token', loginForm)
        dispatch(setToken(res.data.access_token))
    }
}

export default fetchLogin;