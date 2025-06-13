import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
const { Paragraph } = Typography;

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
      <Card title="忘記密碼" style={{ width: 400 }}>
        {sent ? (
          <>
            <Paragraph type="success">
              請複製下方 Token，並前往「重設密碼」頁貼上 Token 及設定新密碼。
            </Paragraph>
            {resetToken && (
              <div style={{ wordBreak: "break-all", marginTop: 16 }}>
                <b>（測試用）重設密碼 Token：</b>
                <Paragraph copyable style={{ fontSize: 12, color: "#888" }}>
                  {resetToken}
                </Paragraph>
              </div>
            )}
            <Button
              type="primary"
              href="/reset-password"
              block
              style={{ marginTop: 16 }}
            >
              前往重設密碼
            </Button>
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
