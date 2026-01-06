import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd';
import { login } from '../request/api';
import { useNavigate } from 'react-router-dom';
import'@ant-design/v5-patch-for-react-19'
export default function Login() {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [btnshow, setBtnshow] = useState(true)
    const [uname, setUname] = useState('')
    const [pword, setPword] = useState('')
    const denglu = async () => {
        const userdata = await login({
            username: uname,
            password: pword
        })
        if(userdata.length > 0){
            localStorage.setItem('token',JSON.stringify(userdata[0]))
             message.success('登录成功')
            navigate('/index')
        }else{
             message.error('用户名或密码错误，登陆失败')
            setPword('')
            setUname('')
        }
    };
    

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                await form.validateFields({ validateOnly: true })
                setBtnshow(false)
            } catch (error) {
                setBtnshow(true)
            }
        }, 200)
        return () => clearTimeout(timer)
    }, [form, uname, pword])
    return (
        <div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ username: '', password: '' }}
                onFinish={denglu}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            > 
                <Form.Item
                    label="用户名"

                    name="username"
                    rules={[{ required: true, message: '用户名不能为空' },
                    { min: 2, max: 6, message: '用户名长度应为2-6位' },
                     {
                        pattern: /^[\u4e00-\u9fa5]+$/, // 可选：限制只能是字母、数字、下划线
                        message: '用户名只能是汉字'
                    }
                    ]}
                >
                    <Input placeholder='请输入用户名' value={uname} onChange={(e) => setUname(e.target.value)} />
                </Form.Item>

                <Form.Item
                    label="密&emsp;码"
                    name="password"
                    rules={[{ required: true, message: '密码不能为空' },
                    { min: 6, message: '密码长度不能小于6位' },
                    ]}
                >
                    <Input.Password placeholder='请输入密码' value={pword} onChange={(e) => setPword(e.target.value)} />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" disabled={btnshow} >
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div >
    )
}
