import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../api/customers";
import type { Customer } from "../../api/customers";

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number>(0); // 新增 total 狀態
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetchCustomers();
      if (res && Array.isArray(res.data)) {
        setCustomers(res.data);
        setTotal(typeof res.total === 'number' ? res.total : res.data.length);
      } else if (Array.isArray(res)) {
        setCustomers(res);
        setTotal(res.length);
      } else {
        setCustomers([]);
        setTotal(0);
      }
    } catch (e) {
      message.error("載入客戶失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleEdit = (record: Customer) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer(id);
    message.success("刪除成功");
    loadCustomers();
  };

  const onFinish = async (values: Omit<Customer, "id">) => {
    if (editing) {
      await updateCustomer(editing.id, values);
      message.success("更新成功");
    } else {
      await createCustomer(values);
      message.success("新增成功");
    }
    setOpen(false);
    loadCustomers();
  };

  const columns = [
    { title: "客戶編號", dataIndex: "id" },
    { title: "名稱", dataIndex: "name" },
    { title: "電話", dataIndex: "phone" },
    { title: "Email", dataIndex: "email" },
    {
      title: "操作",
      render: (_: any, record: Customer) => (
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
        新增客戶
      </Button>
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={loading}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title={editing ? "編輯客戶" : "新增客戶"}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="名稱" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="電話" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerPage;
