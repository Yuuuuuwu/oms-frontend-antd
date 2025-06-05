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
          <Form.Item
            name="role"
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
