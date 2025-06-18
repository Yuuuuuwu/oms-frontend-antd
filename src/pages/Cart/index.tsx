import React, { useState, useEffect } from "react";
import { Table, Button, InputNumber, message, Card, Form, Input, Modal } from "antd";
import { createOrder } from "../../api/orders";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetch = async () => {
      const productsRes = await getProducts();
      setAllProducts(productsRes.data);

      const cartRaw = localStorage.getItem("oms-cart") || "[]";
      let cartArr: { id: number; qty: number }[] = [];
      try {
        cartArr = JSON.parse(cartRaw);
      } catch {}

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

  const updateQty = (id: number, qty: number) => {
    setCart((prev: CartItem[]) => {
      const newCart = prev.map((item: CartItem) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(qty, item.stock)) }
          : item
      );
      const storageData = newCart.map(({ id, qty }: CartItem) => ({ id, qty }));
      localStorage.setItem("oms-cart", JSON.stringify(storageData));
      return newCart;
    });
  };

  const removeItem = (id: number) => {
    setCart((prev: CartItem[]) => {
      const newCart = prev.filter((item: CartItem) => item.id !== id);
      const storageData = newCart.map(({ id, qty }: CartItem) => ({ id, qty }));
      localStorage.setItem("oms-cart", JSON.stringify(storageData));
      return newCart;
    });
  };

  const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.qty, 0);

  const columns = [
    {
      title: "商品",
      dataIndex: "name",
      render: (_: any, record: CartItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {record.image_url && <img src={record.image_url} style={{ width: 40 }} alt={record.name} />}
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
          onChange={(v: number) => updateQty(record.id, v)}
        />
      ),
    },
    {
      title: "小計",
      render: (_: any, record: CartItem) => record.price * record.qty,
    },
    {
      title: "操作",
      render: (_: any, record: CartItem) => (
        <Button type="link" onClick={() => removeItem(record.id)}>
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
    <Card title="購物車">
      <Table
        dataSource={cart}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <b>總金額：￥{total}</b>
        <Button
          type="primary"
          onClick={() => setCheckoutOpen(true)}
          disabled={cart.length === 0}
          style={{ marginLeft: 16 }}
        >
          前往結帳
        </Button>
      </div>
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
