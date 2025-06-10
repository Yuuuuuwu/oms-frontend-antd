import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../utils/auth";

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const success = await resetPassword(values.token, values.new_password);
      if (success) {
        message.success("密碼已重設成功，請重新登入");
        navigate("/login");
      } else {
        message.error("重設失敗，請確認 token 是否有效");
      }
    } catch {
      message.error("重設失敗");
    } finally {
      setLoading(false);
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
      <Card title="重設密碼" style={{ width: 500 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="token"
            label="重設密碼 Token"
            rules={[{ required: true, message: "請輸入重設密碼 Token" }]}
          >
            <Input.TextArea
              placeholder="請貼上重設密碼 Token"
              defaultValue=" "
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="新密碼"
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
            <Input.Password placeholder="請輸入新密碼" />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="確認新密碼"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "請再次輸入新密碼" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("兩次密碼輸入不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="請再次輸入新密碼" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              重設密碼
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => navigate("/login")} block>
              返回登入
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
