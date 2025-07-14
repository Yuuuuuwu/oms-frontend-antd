import React, { useState } from "react";
import { Button, Card, Row, Col, Typography, Space, message, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, ShopOutlined, CopyOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  // 預設使用者帳號資料 (來自 seed_data.py)
  const defaultAccounts = [
    {
      role: "管理員",
      email: "admin@example.com",
      password: "AdminPassword123!",
      name: "系統管理員",
      description: "系統管理、用戶管理、數據統計",
      color: "#ff4d4f",
      permissions: ["完整系統權限", "用戶管理", "數據分析", "系統設定"]
    },
    {
      role: "賣家",
      email: "seller@example.com",
      password: "SellerPassword123!",
      name: "賣家測試",
      description: "商品管理、訂單處理、庫存管理",
      color: "#1890ff",
      permissions: ["商品管理", "訂單處理", "庫存管理", "銷售報表"]
    },
    {
      role: "客戶",
      email: "customer@example.com",
      password: "CustomerPassword123!",
      name: "客戶測試",
      description: "商品瀏覽、下單購買、訂單查詢",
      color: "#52c41a",
      permissions: ["商品瀏覽", "購物下單", "訂單查詢", "個人資料"]
    }
  ];

  // 複製到剪貼簿
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [key]: true });
      message.success('已複製到剪貼簿');
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [key]: false });
      }, 2000);
    } catch (err) {
      message.error('複製失敗');
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* 主標題 */}
        <Title level={1} style={{ color: "white", marginBottom: 16 }}>
          🛒 OMS 訂單管理系統
        </Title>
        <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 40 }}>
          現代化的訂單管理系統，支援多角色權限管理、商品展示、訂單處理等完整功能
        </Paragraph>

        {/* 訪客體驗按鈕 */}
        <Card
          style={{
            marginBottom: 40,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <ShopOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
              <Title level={3} style={{ margin: 0 }}>
                🎯 訪客體驗模式
              </Title>
              <Text type="secondary">
                無需登入即可瀏覽商品，體驗購物流程
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<ShopOutlined />}
              onClick={() => {
                localStorage.setItem(
                  "oms-user",
                  JSON.stringify({ id: 0, username: "訪客", email: "", role: "guest" })
                );
                navigate("/shop");
              }}
              style={{
                height: 50,
                fontSize: 16,
                borderRadius: 25,
              }}
            >
              開始購物體驗
            </Button>
          </Space>
        </Card>

        {/* 登入帳號展示 */}
        <Card
          title={
            <Space>
              <UserOutlined style={{ color: "#1890ff" }} />
              <span style={{ fontSize: 18 }}>🔑 請登入不同權限帳號</span>
            </Space>
          }
          style={{
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
          headStyle={{
            background: "linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%)",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            系統預設了三種不同權限的測試帳號，您可以點擊帳號進行快速登入體驗
          </Paragraph>

          <Row gutter={[24, 24]}>
            {defaultAccounts.map((account, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: 12,
                    border: `2px solid ${account.color}`,
                    cursor: "pointer",
                  }}
                  bodyStyle={{ padding: 20 }}
                  onClick={() => navigate("/login")}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {/* 角色標題 */}
                    <div style={{ textAlign: "center" }}>
                      <UserOutlined
                        style={{
                          fontSize: 32,
                          color: account.color,
                          marginBottom: 8,
                        }}
                      />
                      <Title level={4} style={{ margin: 0, color: account.color }}>
                        {account.role}
                      </Title>
                      <Text type="secondary">{account.name}</Text>
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    {/* 帳號資訊 */}
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Email：</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Text
                            code
                            style={{ fontSize: 12, flex: 1 }}
                            copyable={{
                              text: account.email,
                              onCopy: () => copyToClipboard(account.email, `email-${index}`),
                            }}
                          >
                            {account.email}
                          </Text>
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <Text strong>密碼：</Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Text
                            code
                            style={{ fontSize: 12, flex: 1 }}
                            copyable={{
                              text: account.password,
                              onCopy: () => copyToClipboard(account.password, `pwd-${index}`),
                            }}
                          >
                            {account.password}
                          </Text>
                        </div>
                      </div>

                      {/* 權限說明 */}
                      <div>
                        <Text strong style={{ color: account.color }}>
                          🔐 主要功能：
                        </Text>
                        <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
                          {account.permissions.map((permission, pIndex) => (
                            <li key={pIndex} style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      block
                      style={{
                        backgroundColor: account.color,
                        borderColor: account.color,
                        borderRadius: 8,
                        marginTop: 8,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/login");
                      }}
                    >
                      登入 {account.role}
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 14 }}>
              💡 提示：點擊帳號卡片可快速跳轉到登入頁面，帳號密碼支援一鍵複製
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Landing;
