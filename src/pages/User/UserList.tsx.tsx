import React, { useState, useEffect } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Button, Modal, Form, Input, message } from "antd";
import type { User } from "../../api/users"; // 純型別匯入
import { getUsers, createUser, deleteUser } from "../../api/users";

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const list = await getUsers();
      setData(list);
    } catch {
      message.error("取得使用者列表失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deleteUser(id);
      message.success("刪除成功");
      await fetchData();
    } catch {
      message.error("刪除失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await createUser(values);
      message.success("新增成功");
      setModalVisible(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error("新增失敗");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "使用者名稱", dataIndex: "username", key: "username" },
    { title: "信箱", dataIndex: "email", key: "email" },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (r: string) => (r === "admin" ? "Admin" : "User"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: User) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          刪除
        </Button>
      ),
    },
  ];

  return (
    <>
      <ProTable<User>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="new"
            onClick={() => setModalVisible(true)}
          >
            新增使用者
          </Button>,
        ]}
        pagination={{ pageSize: 10 }}
        headerTitle="使用者列表"
      />

      <Modal
        title="新增使用者"
        open={modalVisible}
        onOk={handleAdd}
        onCancel={() => setModalVisible(false)}
        okText="新增"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="使用者名稱"
            rules={[{ required: true, message: "請輸入使用者名稱" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="信箱"
            rules={[
              { required: true, type: "email", message: "請輸入正確信箱" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            initialValue="user"
            rules={[{ required: true, message: "請選擇角色" }]}
          >
            <Input placeholder="輸入 user 或 admin" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
