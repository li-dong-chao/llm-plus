import { Link, useNavigate } from "react-router-dom"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { message } from "antd";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { request } from "@/utils";


const registerSchema = z.object({
    username: z.string().min(1, { message: "请填写用户名" }).min(
        2, { message: "用户名长度不能小于2个字符" }).max(
            50, { message: "用户名长度不能大于50个字符" }
        ),
    email: z.string().min(1, { message: "请填写邮箱" }).email({ message: "不是有效的邮箱格式" }),
    password: z.string().min(1, { message: "请填写密码" }).min(
        6, { message: "密码长度不能小于6个字符" }).max(
            50, { message: "密码长度不能大于50个字符" }
        )
})


export default function Register() {

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        const res = await request.post('/register', values)
        if (res.status === 200) {
            message.success("注册成功，请登录")
            navigate("/login");
        }
        else {
            message.error(res.data.detail)
        }
    };

    return (
        <div className="pt-36">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">注册</CardTitle>
                    <CardDescription>
                        请输入相关信息注册新用户
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='grid gap-2'>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>用户名</FormLabel>
                                            <FormControl>
                                                <Input placeholder="请输入用户名" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid gap-2 mt-4'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>邮箱</FormLabel>
                                            <FormControl>
                                                <Input placeholder="请输入邮箱" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid gap-2 mt-4'>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>密码</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="请输入密码" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full mt-4">
                                注册新用户
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        已创建用户？ {" "}
                        <Link to="/login" className="underline">
                            直接登录
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
