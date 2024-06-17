import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message, Image } from 'antd';
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import loginImg from "@/assets/loginImg.jpg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchLogin } from '@/utils';


const loginSchema = z.object({
    username: z.string().min(1, { message: "请填写用户名" }).min(
        2, { message: "用户名长度不能小于2个字符" }).max(
            50, { message: "用户名长度不能大于50个字符" }
        ),
    password: z.string().min(1, { message: "请填写密码" }).min(
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

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        await dispatch(fetchLogin(values))
    };


    return (
        <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[700px]">
            <div className="hidden h-full w-full lg:block bg-white">
                <div className='flex items-center justify-center h-full w-full'>
                    <Image
                        src={loginImg}
                        width={700}
                        preview={false}
                    />
                </div>
            </div>
            <div className="flex items-center justify-center py-12">

                <Card className='w-[400px]'>
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">LLM-PLUS</h1>
                            <p className="text-balance text-muted-foreground">
                                欢迎使用 LLM-PLUS
                            </p>
                        </div>
                        <div className="grid gap-4 w-full h-full">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className='grid gap-2'>
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel
                                                        className="text-black"
                                                    >
                                                        用户名 / 邮箱
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入用户名或邮箱" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='grid gap-2 mt-2'>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='flex items-center'>
                                                        <FormLabel
                                                            className="text-black">
                                                            密码
                                                        </FormLabel>
                                                        {/* TODO: 忘记密码尚未实现 */}
                                                        <Link
                                                            to="#"
                                                            className="ml-auto inline-block text-sm underline"
                                                        >
                                                            忘记密码
                                                        </Link>
                                                    </div>
                                                    <FormControl>
                                                        <Input type='password' placeholder="请输入密码" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="submit" className='w-full mt-4'>
                                        立即登录
                                    </Button>
                                </form>
                            </Form>
                            {/* TODO: 手机号登录尚未实现 */}
                            <Button
                                variant="outline"
                                className="w-full">
                                手机号登陆
                            </Button>
                        </div>
                        <div className="mt-2 text-center text-sm mb-6">
                            没有账号？{" "}
                            <Link to="/register" className="underline">
                                立即注册
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div >
    )
}
