import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Select,
  InputNumber,
  message,
  Space,
} from "antd";
import { getOrderDetail, updateOrder } from "../../api/orders";
import { getProducts } from "../../api/products";

const { Option } = Select;

const OrderEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
    if (id) {
      getOrderDetail(Number(id)).then((data) => {
        setOrder(data);
        setItems(data.items.map((item: any) => ({ ...item })));
        form.setFieldsValue({
          receiver_name: data.receiver_name,
          receiver_phone: data.receiver_phone,
          shipping_address: data.shipping_address,
          remark: data.remark,
        });
      });
    }
  }, [id]);

  const handleAddItem = () => {
    setItems([...items, { product_id: undefined, qty: 1 }]);
  };
  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };
  const handleItemChange = (idx: number, key: string, value: any) => {
    setItems((items) => {
      const next = [...items];
      if (key === "product_id") {
        const prod = products.find((p: any) => p.id === value);
        if (prod) {
          next[idx] = {
            ...next[idx],
            product_id: prod.id,
            product_name: prod.name,
            price: prod.price,
          };
        }
      } else {
        next[idx] = { ...next[idx], [key]: value };
      }
      return next;
    });
  };
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const onFinish = async (values: any) => {
    if (!items.length) return message.error("請至少選擇一項商品");
    setLoading(true);
    try {
      await updateOrder(Number(id), {
        ...values,
        items: items.map(({ product_id, qty }) => ({ product_id, qty })),
      });
      message.success("訂單更新成功");
      navigate(`/orders/${id}`);
    } catch (e: any) {
      message.error(e.message || "更新失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={`編輯訂單 - ${id}`}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="收件人"
          name="receiver_name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="電話"
          name="receiver_phone"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="地址"
          name="shipping_address"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="備註" name="remark">
          <Input.TextArea />
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
                  {products.map((p: any) => (
                    <Option
                      key={p.id}
                      value={p.id}
                      disabled={
                        items.some(
                          (it, i) => it.product_id === p.id && i !== idx
                        ) || p.stock === 0
                      }
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
              render: (v) => (v ? `$${v}` : "-"),
            },
            {
              title: "數量",
              dataIndex: "qty",
              render: (v, r, idx) => (
                <InputNumber
                  min={1}
                  max={
                    products.find((p: any) => p.id === r.product_id)?.stock ||
                    99
                  }
                  value={v}
                  onChange={(val) => handleItemChange(idx, "qty", val)}
                />
              ),
            },
            {
              title: "小計",
              render: (_, r) => (r.price && r.qty ? `$${r.price * r.qty}` : "-"),
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
          <span style={{ color: "#d4380d", fontSize: 18 }}>
            ${totalAmount}
          </span>
        </div>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              更新
            </Button>
            <Button onClick={() => navigate(`/orders/${id}`)}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderEdit;
