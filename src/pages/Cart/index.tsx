import React, { useState, useEffect } from "react";
import { Table, Button, InputNumber, message, Card, Form, Input, Modal } from "antd";
import { createOrder } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { getProducts } from "../../api/products";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  stock: number;
  image_url?: string;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 1. 一次性讀 localStorage + 產品資料，初始化 cart state
  useEffect(() => {
    const fetch = async () => {
      const productsRes = await getProducts();
      setAllProducts(productsRes.data);

      const cartRaw = localStorage.getItem("oms-cart") || "[]";
      let cartArr: { id: number; qty: number }[] = [];
      try {
        cartArr = JSON.parse(cartRaw);
      } catch {}

      // 對照 product 資料，把 id+qty 組成 CartItem
      const cartFull: CartItem[] = cartArr
        .map(item => {
          const prod = productsRes.data.find((p: any) => p.id === item.id);
          if (!prod) return undefined;
          return {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            qty: item.qty,
            stock: prod.stock,
            image_url: prod.image_url
          } as CartItem;
        })
        .filter((x): x is CartItem => !!x);

      setCart(cartFull);
    };
    fetch();
  }, []);

  // 2. 改數量時，同步寫入 localStorage
  const updateQty = (id: number, qty: number) => {
    setCart(prev => {
      const newCart = prev.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(qty, item.stock)) }
          : item
      );
      // 只存 {id, qty} 至 localStorage
      const storageData = newCart.map(({ id, qty }) => ({ id, qty }));
      localStorage.setItem("oms-cart", JSON.stringify(storageData));
      return newCart;
    });
  };

  // 3. 移除商品時，同步寫入 localStorage
  const removeItem = (id: number) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      const storageData = newCart.map(({ id, qty }) => ({ id, qty }));
      localStorage.setItem("oms-cart", JSON.stringify(storageData));
      return newCart;
    });
  };

  // 其餘不動…
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const columns = [
    {
      title: "商品",
      dataIndex: "name",
      render: (_: any, record: CartItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {record.image_url && <img src={record.image_url} style={{ width: 40 }} />}
          <span>{record.name}</span>
        </div>
      ),
    },
    { title: "單價", dataIndex: "price" },
    {
      title: "數量",
      dataIndex: "qty",
      render: (qty: number, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={qty}
          onChange={v => updateQty(record.id, Number(v))}
        />
      ),
    },
    { title: "小計", render: (_: any, r: CartItem) => r.price * r.qty },
    {
      title: "操作",
      render: (_: any, record: CartItem) => (
        <Button danger type="link" onClick={() => removeItem(record.id)}>
          移除
        </Button>
      ),
    },
  ];

  const handleCheckout = () => {
    const user = getCurrentUser();
    if (!user || user.role === "guest") {
      localStorage.setItem("oms-auto-checkout", "1");
      navigate("/register");
      return;
    }
    setCheckoutOpen(true);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const order = await createOrder({
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone,
        shipping_address: values.shipping_address,
        remark: values.remark,
        items: cart.map(item => ({ product_id: item.id, qty: item.qty })),
      });
      message.success("訂單建立成功");
      setCart([]);
      localStorage.removeItem("oms-cart");
      setCheckoutOpen(false);
      form.resetFields();
      navigate(`/orders/${order.id}`);
    } catch (e: any) {
      message.error(e.message || "下單失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="購物車" style={{ maxWidth: 800, margin: "32px auto" }}>
      <Table
        columns={columns}
        dataSource={cart}
        rowKey="id"
        pagination={false}
        footer={() => (
          <div style={{ textAlign: "right", fontWeight: 600 }}>
            總計：<span style={{ color: "#d4380d", fontSize: 18 }}>￥{total}</span>
            <Button
              type="primary"
              style={{ marginLeft: 16 }}
              disabled={!cart.length}
              onClick={handleCheckout}
            >
              前往結帳
            </Button>
          </div>
        )}
      />
      {cart.length === 0 && (
        <div style={{ textAlign: "center", color: "#aaa", margin: 32 }}>
          購物車是空的
        </div>
      )}
      <Modal
        open={checkoutOpen}
        onCancel={() => setCheckoutOpen(false)}
        onOk={() => form.submit()}
        title="填寫收件資訊"
        confirmLoading={loading}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
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
        </Form>
      </Modal>
    </Card>
  );
};

export default CartPage;
