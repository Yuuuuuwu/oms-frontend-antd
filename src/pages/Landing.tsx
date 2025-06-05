import React from "react";
import { Button } from "antd";

const Landing: React.FC = () => (
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
    </div>
  </div>
);

export default Landing;
