import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  // 預設測試帳號 (來自 seed_data.py)
  const testAccounts = [
    { role: "管理員", email: "admin@example.com", password: "AdminPassword123!" },
    { role: "賣家", email: "seller@example.com", password: "SellerPassword123!" },
    { role: "客戶", email: "customer@example.com", password: "CustomerPassword123!" }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 300, 
          color: "#1a1a1a", 
          marginBottom: 16,
          letterSpacing: "-0.5px"
        }}>
          OMS 訂單管理系統
        </h1>
        <p style={{ 
          fontSize: 16, 
          color: "#6b7280", 
          marginBottom: 32,
          fontWeight: 400
        }}>
          您好，這是陳冠羽製作的作品專案。
        </p>
        
        <Button
          type="primary"
          size="large"
          onClick={() => {
            localStorage.setItem(
              "oms-user",
              JSON.stringify({ id: 0, username: "訪客", email: "", role: "guest" })
            );
            navigate("/shop");
          }}
          style={{
            height: 44,
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 500,
            backgroundColor: "#007aff",
            borderColor: "#007aff",
            boxShadow: "none"
          }}
        >
          訪客模式
        </Button>
      </div>

      <div style={{
        backgroundColor: "white",
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        maxWidth: 480,
        width: "100%"
      }}>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 500, 
          color: "#1a1a1a", 
          marginBottom: 16,
          textAlign: "center"
        }}>
          測試帳號
        </h3>
        
        <div style={{ marginBottom: 16 }}>
          {testAccounts.map((account, index) => (
            <div 
              key={index}
              style={{
                padding: 12,
                borderRadius: 6,
                backgroundColor: "#f9fafb",
                marginBottom: 8,
                border: "1px solid #f3f4f6"
              }}
            >
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                color: "#374151",
                marginBottom: 4
              }}>
                {account.role}
              </div>
              <div style={{ 
                fontSize: 13, 
                color: "#6b7280",
                fontFamily: "Monaco, 'SF Mono', Consolas, monospace"
              }}>
                {account.email}
              </div>
              <div style={{ 
                fontSize: 13, 
                color: "#6b7280",
                fontFamily: "Monaco, 'SF Mono', Consolas, monospace"
              }}>
                {account.password}
              </div>
            </div>
          ))}
        </div>

        <Button
          block
          onClick={() => navigate("/login")}
          style={{
            height: 36,
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            backgroundColor: "white",
            borderColor: "#d1d5db",
            color: "#374151"
          }}
        >
          登入
        </Button>
      </div>
    </div>
  );
};

export default Landing;
