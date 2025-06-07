import React from "react";
import { Form, Input, Button, Card, message, Select } from "antd"; // # 修改：新增 Select
import { useNavigate } from "react-router-dom";
import { register, type UserRole } from "../../utils/auth"; // # 修改：改為 import register 和 UserRole

const { Option } = Select; // # 修改：取得 Select.Option

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    // # 修改：呼叫 register 時多傳 email 和 role
    const success = await register(
      values.username,
      values.email, // # 修改：加入 email
      values.password,
      values.role as UserRole
    );
    if (success) {
      message.success("註冊成功！請登入");
      navigate("/login");
    } else {
      message.error("註冊失敗，請確認帳號或 Email 是否已存在！");
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
            name="email" // # 修改：新增 email 欄位
            rules={[
              { required: true, message: "請輸入 Email" },
              { type: "email", message: "請輸入有效的 Email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "請輸入密碼" }]}
          >
            <Input.Password placeholder="密碼" />
          </Form.Item>
          <Form.Item
            name="role" // # 保留 role 欄位，但改為 Select
            rules={[{ required: true, message: "請選擇角色" }]}
          >
            <Select placeholder="選擇角色">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
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
