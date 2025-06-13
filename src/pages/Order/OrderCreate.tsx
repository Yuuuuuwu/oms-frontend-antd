import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber,
  message,
  Space,
  Table,
} from "antd";
import { getProducts } from "../../api/products";
import { createOrder } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";

const { Option } = Select;

interface ProductOption {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  qty: number;
}

const OrderCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product_id: 0, name: "", price: 0, qty: 1 }]);
  };

  const handleItemChange = (idx: number, key: keyof OrderItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      if (key === "product_id") {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          next[idx] = {
            ...next[idx],
            product_id: prod.id,
            name: prod.name,
            price: prod.price,
          };
        }
      } else {
        next[idx] = { ...next[idx], [key]: value };
      }
      return next;
    });
  };

  const handleRemoveItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const onFinish = async (values: any) => {
    if (!items.length) {
      message.error("請至少選擇一項商品");
      return;
    }
    setLoading(true);
    try {
      await createOrder({
        ...values,
        items: items.map(({ product_id, qty }) => ({
          product_id,
          qty,
        })),
      });
      message.success("訂單建立成功");
      navigate("/orders");
    } catch (e: any) {
      message.error(e.message || "訂單建立失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="新增訂單">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="訂購人姓名"
          name="receiver_name"
          rules={[{ required: true }]}
        >
          {" "}
          <Input />{" "}
        </Form.Item>
        <Form.Item
          label="電話"
          name="receiver_phone"
          rules={[{ required: true }]}
        >
          {" "}
          <Input />{" "}
        </Form.Item>
        <Form.Item
          label="Email"
          name="receiver_email"
          rules={[{ type: "email" }]}
        >
          {" "}
          <Input />{" "}
        </Form.Item>
        <Form.Item
          label="地址"
          name="shipping_address"
          rules={[{ required: true }]}
        >
          {" "}
          <Input />{" "}
        </Form.Item>
        <Form.Item label="備註" name="remark">
          {" "}
          <Input.TextArea />{" "}
        </Form.Item>
        <div style={{ margin: "16px 0" }}>
          <b>商品明細</b>
          <Button
            type="dashed"
            onClick={handleAddItem}
            style={{ marginLeft: 16 }}
          >
            新增商品
          </Button>
        </div>
        <Table
          dataSource={items}
          rowKey={(_, idx) => String(idx)}
          pagination={false}
          columns={[
            {
              title: "商品",
              dataIndex: "product_id",
              render: (v, r, idx) => (
                <Select
                  style={{ width: 180 }}
                  value={v || undefined}
                  onChange={(val) => handleItemChange(idx, "product_id", val)}
                  placeholder="請選擇商品"
                >
                  {products.map((p) => (
                    <Option
                      key={p.id}
                      value={p.id}
                      disabled={items.some(
                        (it, i) => it.product_id === p.id && i !== idx
                      )}
                    >
                      {p.name}（庫存:{p.stock}）
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              title: "單價",
              dataIndex: "price",
              render: (v) => v,
            },
            {
              title: "數量",
              dataIndex: "qty",
              render: (v, r, idx) => (
                <InputNumber
                  min={1}
                  max={products.find((p) => p.id === r.product_id)?.stock || 99}
                  value={v}
                  onChange={(val) => handleItemChange(idx, "qty", val)}
                />
              ),
            },
            {
              title: "小計",
              render: (_, r) => r.price * r.qty,
            },
            {
              title: "操作",
              render: (_, __, idx) => (
                <Button
                  danger
                  type="link"
                  onClick={() => handleRemoveItem(idx)}
                >
                  移除
                </Button>
              ),
            },
          ]}
        />
        <div style={{ margin: "16px 0", textAlign: "right" }}>
          <b>總金額：</b>{" "}
          <span style={{ color: "#d4380d", fontSize: 18 }}>{totalAmount}</span>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            建立訂單
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            onClick={() => navigate("/orders")}
          >
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderCreate;
