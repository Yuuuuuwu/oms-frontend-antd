import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  // 訪客瀏覽：將 user 設為 guest 並導向商品頁
  const handleGuest = () => {
    localStorage.setItem(
      "oms-user",
      JSON.stringify({ id: 0, username: "訪客", email: "", role: "guest" })
    );
    navigate("/shop");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>歡迎來到 OMS 訂單管理系統</h1>
      <div>
        <Button type="primary" href="/login">
          登入
        </Button>
        <Button style={{ marginLeft: 16 }} href="/register">
          註冊
        </Button>
        <Button style={{ marginLeft: 16 }} onClick={handleGuest}>
          以訪客瀏覽
        </Button>
      </div>
    </div>
  );
};

export default Landing;
