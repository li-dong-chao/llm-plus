import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, message } from 'antd';

import './index.css';
import { useAppDispatch, useAppSelector } from '@/hooks';
import fetchLogin from '@/store/modules/fetchLogin';

const Login: React.FC = () => {
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

    const onFinish = async (values: any) => {
        await dispatch(fetchLogin(values))
    };

    return (
        <div className='login-container h-full flex justify-center items-center'>
            <Card title="用户登录" style={{ width: 300 }} hoverable={true} className='bg-sky-200'>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Link to={"/"} className='flex justify-end -mt-6 mb-5'>
                        忘记密码
                    </Link>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='w-full'>
                            立即登录
                        </Button>
                    </Form.Item>
                    <span className='flex justify-center'>
                        <span className='mr-2'>
                            还没有创建账号？
                        </span>
                        <Link to={"/"}>立即注册</Link>
                    </span>
                </Form>
            </Card>

        </div>
    );
};

export default Login;