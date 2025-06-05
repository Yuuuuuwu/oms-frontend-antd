import React, { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const initialCustomers: Customer[] = [
  { id: "C001", name: "王小明", phone: "0912345678", email: "ming@gmail.com" },
  { id: "C002", name: "李小華", phone: "0987654321", email: "hua@gmail.com" },
];

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form] = Form.useForm();

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

  const handleDelete = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const onFinish = (values: Customer) => {
    if (editing) {
      setCustomers(customers.map((c) => (c.id === editing.id ? values : c)));
    } else {
      setCustomers([...customers, { ...values, id: `C${Date.now()}` }]);
    }
    setOpen(false);
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
      <Table columns={columns} dataSource={customers} rowKey="id" />
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
