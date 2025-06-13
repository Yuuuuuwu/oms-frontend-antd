import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type User,
} from "../../api/users";

const { Option } = Select;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0); // 新增 total 狀態
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res && Array.isArray(res.data)) {
        setUsers(res.data);
        setTotal(typeof res.total === 'number' ? res.total : res.data.length);
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

  const handleEdit = (record: User) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteUser(id);
      message.success("刪除成功");
      fetchUsers();
    } catch {
      message.error("刪除失敗");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (editing) {
        await updateUser(editing.id, values);
        message.success("更新成功");
      } else {
        await createUser(values);
        message.success("新增成功");
      }
      setOpen(false);
      fetchUsers();
    } catch {
      message.error(editing ? "更新失敗" : "新增失敗");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "暱稱", dataIndex: "username" },
    { title: "信箱", dataIndex: "email" },
    { title: "手機", dataIndex: "phone" },
    { title: "角色", dataIndex: "role" },
    {
      title: "啟用",
      dataIndex: "is_active",
      render: (v: boolean) => (v ? "是" : "否"),
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
        pagination={{ total }} // 若有分頁需求
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
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item label="手機" name="phone">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item
            label="密碼"
            name="password"
            rules={editing ? [] : [{ required: true, min: 6 }]}
          >
            {" "}
            <Input.Password />{" "}
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true }]}
            initialValue="user"
          >
            <Select>
              <Option value="user">一般用戶</Option>
              <Option value="admin">管理員</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
