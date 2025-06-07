import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
// # 修改：將 fakeLogin 換成 login
import { login } from "../../utils/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    // # 修改：呼叫 login 而非 fakeLogin
    const success = await login(values.username, values.password);
    if (success) {
      message.success("登入成功！");
      navigate("/dashboard");
    } else {
      message.error("帳號或密碼錯誤！");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Card title="OMS 登入" style={{ width: 350 }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "請輸入帳號" }]}
          >
            <Input placeholder="帳號" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "請輸入密碼" }]}
          >
            <Input.Password placeholder="密碼" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登入
            </Button>
          </Form.Item>
          <Form.Item>
            沒有帳號？<a href="/register">註冊</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
