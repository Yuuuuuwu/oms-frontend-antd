import React, { useState, useEffect } from "react";
import { Table, Button, InputNumber, message, Card, Typography, Space, Divider, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/products";
import { getCurrentUser } from "../../utils/auth";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

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
        .map((item) => {
          const prod = productsRes.data.find((p: any) => p.id === item.id);
          if (!prod) return undefined;
          return {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            qty: item.qty,
            stock: prod.stock,
            image_url: prod.image_url,
          } as CartItem;
        })
        .filter((x): x is CartItem => !!x);

      setCart(cartFull);
    };
    fetch();
  }, []);

  const updateQty = (id: number, qty: number | null) => {
    if (qty === null) return;
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

  const total = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.qty,
    0
  );

  const columns = [
    {
      title: "商品",
      dataIndex: "name",
      render: (_: any, record: CartItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {record.image_url && (
            <img 
              src={record.image_url} 
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} 
              alt={record.name} 
            />
          )}
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              庫存: {record.stock}
            </Text>
          </div>
        </div>
      ),
    },
    { 
      title: "單價", 
      dataIndex: "price", 
      render: (v: number) => <Text>${v.toLocaleString()}</Text> 
    },
    {
      title: "數量",
      dataIndex: "qty",
      render: (qty: number, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={qty}
          onChange={(v) => updateQty(record.id, v)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: "小計",
      render: (_: any, record: CartItem) => (
        <Text strong>${(record.price * record.qty).toLocaleString()}</Text>
      ),
    },
    {
      title: "操作",
      render: (_: any, record: CartItem) => (
        <Button 
          type="link" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
        >
          移除
        </Button>
      ),
    },
  ];

  const handleCheckout = () => {
    const user = getCurrentUser();
    if (!user || user.role === "guest") {
      message.info("請先登入後再進行結帳");
      navigate("/login");
      return;
    }
    
    if (cart.length === 0) {
      message.warning("購物車為空，請先加入商品");
      return;
    }
    
    // 儲存結帳商品到 localStorage，然後導向結帳預覽頁面
    localStorage.setItem('checkout-items', JSON.stringify(cart));
    navigate('/checkout/preview', {
      state: {
        items: cart
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("oms-cart");
    message.success("購物車已清空");
  };

  if (cart.length === 0) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical">
              <Text type="secondary">您的購物車是空的</Text>
              <Button type="primary" onClick={() => navigate('/shop')}>
                前往購物
              </Button>
            </Space>
          }
        />
      </Card>
    );
  }

  return (
    <div>
      <Title level={2}>
        <ShoppingCartOutlined /> 購物車
      </Title>
      <Text type="secondary">共 {cart.length} 項商品</Text>
      
      <Card style={{ marginTop: 16 }}>
        <Table
          dataSource={cart}
          columns={columns}
          rowKey="id"
          pagination={false}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong>總計</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                    ${total.toLocaleString()}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
        
        <Divider />
        
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button 
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              清空購物車
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              前往結帳 (${total.toLocaleString()})
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default CartPage;