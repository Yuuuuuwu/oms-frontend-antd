import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber } from "antd";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const initialProducts: Product[] = [
  { id: "P001", name: "商品A", price: 100, stock: 10 },
  { id: "P002", name: "商品B", price: 200, stock: 5 },
];

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const handleEdit = (record: Product) => {
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
    setProducts(products.filter((p) => p.id !== id));
  };

  const onFinish = (values: Product) => {
    if (editing) {
      setProducts(products.map((p) => (p.id === editing.id ? values : p)));
    } else {
      setProducts([...products, { ...values, id: `P${Date.now()}` }]);
    }
    setOpen(false);
  };

  const columns = [
    { title: "商品編號", dataIndex: "id" },
    { title: "名稱", dataIndex: "name" },
    { title: "價格", dataIndex: "price" },
    { title: "庫存", dataIndex: "stock" },
    {
      title: "操作",
      render: (_: any, record: Product) => (
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
        新增商品
      </Button>
      <Table columns={columns} dataSource={products} rowKey="id" />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title={editing ? "編輯商品" : "新增商品"}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="名稱" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="價格" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="庫存" name="stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
