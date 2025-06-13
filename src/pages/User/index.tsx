import React, { useEffect, useState } from "react";
import { Table, message, Tag, Button, Popconfirm } from "antd";
import { getToken } from "../../utils/auth";
import { getUsers, deleteUser, User } from "../../api/users";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch(() => message.error("取得用戶失敗"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    message.success("刪除成功");
    setUsers(users.filter((u) => u.id !== id));
  };

  const columns = [
    { title: "用戶ID", dataIndex: "id" },
    { title: "帳號", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    {
      title: "角色",
      dataIndex: "role",
      render: (v: string) => (
        <Tag color={v === "admin" ? "gold" : "blue"}>{v}</Tag>
      ),
    },
    { title: "建立時間", dataIndex: "created_at" },
    {
      title: "狀態",
      dataIndex: "is_active",
      render: (v: boolean) =>
        v ? <Tag color="green">啟用</Tag> : <Tag color="red">停用</Tag>,
    },
    {
      title: "操作",
      render: (_: any, record: User) => (
        <Popconfirm title="確定刪除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger>
            刪除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>用戶管理</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default UserPage;
