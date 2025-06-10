import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { fakeLogin } from "../../utils/auth";
=======
import { login } from "../../utils/auth";
>>>>>>> 20d2f55 (新增忘記密碼與重設密碼功能，更新登入與註冊頁面以支援 email 登入)

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
<<<<<<< HEAD
    const success = await fakeLogin(values.username, values.password);
=======
    // # 以 email 登入，login 需支援 email
    const success = await login(values.email, values.password);
>>>>>>> 20d2f55 (新增忘記密碼與重設密碼功能，更新登入與註冊頁面以支援 email 登入)
    if (success) {
      message.success("登入成功！");
      navigate("/dashboard");
    } else {
      message.error("信箱或密碼錯誤！");
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
  );
};

export default Login;
