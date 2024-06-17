import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/utils";
import { message } from 'antd'

export default function AuthRoute({ children }: {
    children: any
}) {

    const token = getToken()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            message.info("请先登录！")
            navigate("/login")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, navigate])

    return <>
        {children}
    </>
}