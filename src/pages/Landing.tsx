import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

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
      >
        開始使用
      </Button>
    </div>
  );
};

export default Landing;
