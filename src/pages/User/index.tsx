// src/pages/Customer/index.tsx
import React, { useState, useEffect } from "react";
import { Table, Spin, message } from "antd";
import { getUsers } from "../../api/users";
import type { User } from "../../utils/auth";

const CustomerPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch {
        message.error("讀取使用者列表失敗");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    { title: "用戶 ID", dataIndex: "id", key: "id" },
    { title: "使用者名稱", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "角色", dataIndex: "role", key: "role" },
    { title: "註冊時間", dataIndex: "created_at", key: "created_at" },
  ];

  if (loading) return <Spin style={{ width: "100%", marginTop: 100 }} />;

  return (
    <Table<User>
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      title={() => "使用者管理"}
    />
  );
};

export default CustomerPage;
