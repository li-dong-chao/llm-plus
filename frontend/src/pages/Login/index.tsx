import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { z } from "zod";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from '@/hooks';
import fetchLogin from '@/store/modules/fetchLogin';


const LoginSchema = z.object({
    username: z.string().min(
        2, { message: "用户名长度不能小于2个字符" }).max(
            50, { message: "用户名长度不能大于50个字符" }
        ),
    password: z.string().min(
        6, { message: "密码长度不能小于6个字符" }).max(
            50, { message: "密码长度不能大于50个字符" }
        )
})


export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const token = useAppSelector(state => state.user.token)
    const loginError = useAppSelector(state => state.user.loginError)

    useEffect(() => {
        if (token) {
            message.success("登录成功")
            navigate("/");
        } else {
            if (loginError) {
                message.error(loginError)
            }
        }
    }, [token, loginError, navigate])

    const clickLogin = async (values: any) => {
        console.log(values);

        await dispatch(fetchLogin(values))
    };


    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="hidden bg-muted lg:block">
                {/* TODO: 此处应当添加一张图片 */}
                {/* <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                /> */}
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">LLM-PLUS</h1>
                        <p className="text-balance text-muted-foreground">
                            欢迎使用 LLM-PLUS
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">用户名</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder="请输入您的用户名"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">密码</Label>
                                {/* TODO: 忘记密码尚未实现 */}
                                <Link
                                    to="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    忘记密码
                                </Link>
                            </div>
                            <Input id="password" type="password" placeholder="请输入您的密码" required />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            onClick={clickLogin}
                        >
                            立即登录
                        </Button>
                        {/* TODO: 手机号登录尚未实现 */}
                        <Button
                            variant="outline"
                            className="w-full">
                            手机号登陆
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        没有账号？{" "}
                        {/* TODO: 立即注册尚未实现 */}
                        <Link to="#" className="underline">
                            立即注册
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
