import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import ResetPassword from "./ResetPassword"; // 引入 ResetPassword 組件

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      if (res.ok) {
        const data = await res.json();
        setSent(true);
        setResetToken(data.reset_token); // 實務應寄信，這裡直接顯示 token
        message.success("重設密碼信已寄出（測試用 token 已顯示）");
      } else {
        const err = await res.json();
        message.error(err.description || "寄送失敗");
      }
    } catch {
      message.error("寄送失敗");
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
      <Card title="忘記密碼" style={{ width: 350 }}>
        {sent ? (
          <>
            <p>請至信箱收信，依指示重設密碼。</p>
            {resetToken && (
              <div style={{ wordBreak: "break-all", marginTop: 16 }}>
                <b>（測試用）重設密碼 token：</b>
                <div style={{ fontSize: 12, color: "#888" }}>{resetToken}</div>
              </div>
            )}
            <br />
            <Form.Item>
              <Button type="primary" href="/reset-password" block>
                重設密碼
              </Button>
            </Form.Item>
          </>
        ) : (
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, type: "email", message: "請輸入有效 Email" },
              ]}
            >
              <Input placeholder="請輸入註冊信箱" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                寄送重設密碼信
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
