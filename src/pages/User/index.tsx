import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Tag } from "antd";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/users";
import dayjs from "dayjs"; // 建議用 dayjs 格式化時間
import type { User } from "../../types/User";

const { Option } = Select;

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 初始化撈資料
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res && Array.isArray(res.data)) {
        setUsers(res.data);
        setTotal(typeof res.total === "number" ? res.total : res.data.length);
      } else {
        setUsers([]);
        setTotal(0);
      }
    } catch {
      message.error("取得使用者失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 點擊編輯
  const handleEdit = (record: User) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // 點擊新增
  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  // 刪除使用者
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteUser(id);
      message.success("刪除成功");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      message.error("刪除失敗");
    } finally {
      setLoading(false);
    }
  };

  // 新增或更新送出
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (editing) {
        const updatedUser = await updateUser(editing.id, values);
        message.success("更新成功");
        setUsers((prev) =>
          prev.map((u) => (u.id === editing.id ? { ...u, ...updatedUser } : u))
        );
      } else {
        const newUser = await createUser(values);
        message.success("新增成功");
        setUsers((prev) => [...prev, newUser]);
        setTotal((prev) => prev + 1);
      }
      setOpen(false);
    } catch {
      message.error(editing ? "更新失敗" : "新增失敗");
    } finally {
      setLoading(false);
    }
  };

  // 表格欄位定義
  const columns = [
    { title: "UserID", dataIndex: "id" },
    { title: "暱稱", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "手機", dataIndex: "phone" },
    {
      title: "角色",
      dataIndex: "role",
      render: (v: string) => (
        <Tag color={v === "admin" ? "gold" : "blue"}>{v}</Tag>
      ),
    },
    {
      title: "狀態",
      dataIndex: "is_active",
      render: (v: boolean) =>
        v ? <Tag color="green">啟用</Tag> : <Tag color="red">停用</Tag>,
    },
    {
      title: "創建時間",
      dataIndex: "created_at",
      render: (v: string) =>
        v ? dayjs(v).format("YYYY/MM/DD HH:mm:ss") : "",
    },
    {
      title: "最後登入時間",
      dataIndex: "last_login",
      render: (v: string) =>
        v ? dayjs(v).format("YYYY/MM/DD HH:mm:ss") : "",
    },
    {
      title: "操作",
      render: (_: any, record: User) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            編輯
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            刪除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        新增使用者
      </Button>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ total }}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title={editing ? "編輯使用者" : "新增使用者"}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="暱稱" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="手機" name="phone">
            <Input />
          </Form.Item>
          <Form.Item
            label="密碼"
            name="password"
            rules={editing ? [] : [{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true }]}
            initialValue="customer"
          >
            <Select>
              <Option value="customer">一般用戶</Option>
              <Option value="admin">管理員</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
