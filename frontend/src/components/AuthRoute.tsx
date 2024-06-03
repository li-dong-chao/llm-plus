import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "@/utils";
import { message } from 'antd'
import { request } from "@/utils";
import { set } from "zod";
import { AxiosResponse } from "axios";

export default function AuthRoute({ children }: {
    children: any
}) {

    const token = getToken()
    const navigate = useNavigate()
    const [resp, setResp] = useState<AxiosResponse<any, any>>();

    const getMe = async () => {
        const ret = await request.get("/me")
        setResp(ret)
    }
    useEffect(() => {
        if (!token) {
            message.info("请先登录！")
            navigate("/login")
        }
        getMe()
        if (resp && resp.status === 403) {
            removeToken()
            message.info("请先登录！")
            navigate("/login")
        }
        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, navigate])

    return <>
        {children}
    </>
}