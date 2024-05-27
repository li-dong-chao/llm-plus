// 封装 axios
import axios from "axios"

import { getToken } from "./token";


const request = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use((config) => {
    // 有token时，自动增加鉴权信息
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response.status >= 400 && error.response.status < 500) {
        return error.response
    }
    return Promise.reject(error)
})

export { request }
