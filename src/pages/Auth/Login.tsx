import React from "react";
import { App, Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    // # 以 email 登入，login 需支援 email
    const success = await login(values.email, values.password);
    if (success) {
      messageApi.success("登入成功！");
      navigate("/shop");
    } else {
      messageApi.error("信箱或密碼錯誤！");
    }
  };

  return (
    <App>
      {contextHolder}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f2f5",
          flexDirection: "column",
        }}
      >
        <Card title="OMS 登入" style={{ width: 350 }}>
          <Form onFinish={onFinish} autoComplete="off">
            <Form.Item
              name="email"
              rules={[
                { required: true, type: "email", message: "請輸入有效 Email" },
              ]}
            >
              <Input placeholder="Email" autoComplete="email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "請輸入密碼" }]}
            >
              <Input.Password
                placeholder="密碼"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登入
              </Button>
            </Form.Item>
            <Form.Item>
              沒有帳號？<a href="/register">註冊</a>
            </Form.Item>
            <Form.Item>
              <a href="/forgot-password">忘記密碼？</a>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </App>
  );
};

export default Login;
