import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fakeRegister } from "../../utils/auth";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const success = await fakeRegister(
      values.username,
      values.password,
      values.role
    );
    if (success) {
      message.success("註冊成功！請登入");
      navigate("/login");
    } else {
      message.error("帳號已存在！");
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
      <Card title="OMS 註冊" style={{ width: 350 }}>
        <Form onFinish={onFinish}>
          <Form.Item
<<<<<<< HEAD
            name="username"
            rules={[{ required: true, message: "請輸入帳號" }]}
          >
            <Input placeholder="帳號" />
=======
            name="email"
            rules={[
              { required: true, type: "email", message: "請輸入有效 Email" },
            ]}
          >
            <Input placeholder="Email" />
>>>>>>> 20d2f55 (新增忘記密碼與重設密碼功能，更新登入與註冊頁面以支援 email 登入)
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "請輸入密碼" },
              { min: 8, message: "密碼長度至少 8 碼" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/,
                message: "密碼需包含英數字",
              },
            ]}
          >
            <Input.Password placeholder="密碼" />
          </Form.Item>
          <Form.Item
<<<<<<< HEAD
            name="role"
=======
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "請再次輸入密碼" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("兩次密碼輸入不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="確認密碼" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "請輸入暱稱" }]}
          >
            <Input placeholder="暱稱" />
          </Form.Item>
          <Form.Item
            name="role" // # 保留 role 欄位，但改為 Select
>>>>>>> 20d2f55 (新增忘記密碼與重設密碼功能，更新登入與註冊頁面以支援 email 登入)
            rules={[{ required: true, message: "請選擇角色" }]}
          >
            <Input placeholder="角色（admin/user）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              註冊
            </Button>
          </Form.Item>
          <Form.Item>
            已有帳號？<a href="/login">登入</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
