import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card } from 'antd';

import './index.css';
import { useAppDispatch } from '@/hooks';
import fetchLogin from '@/store/modules/fetchLogin';

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const onFinish = (values: any) => {
        dispatch(fetchLogin(values))
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='w-full'>
                            立即登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        </div>
    );
};

export default Login;