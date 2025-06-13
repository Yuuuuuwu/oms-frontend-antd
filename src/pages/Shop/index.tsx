import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Input, Select, message } from "antd";
import { getProducts } from "../../api/products";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  desc?: string;
  image_url?: string;
  is_active: boolean;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ [id: number]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.filter((p: Product) => p.is_active));
    } catch {
      message.error("載入商品失敗");
    } finally {
      setLoading(false);
    }
  };

  // 新增：加入購物車會寫入 localStorage
  const addToCart = (id: number) => {
    // 取得現有購物車
    const cartRaw = localStorage.getItem("oms-cart");
    let cart: { id: number; qty: number }[] = [];
    if (cartRaw) {
      try {
        cart = JSON.parse(cartRaw);
      } catch {}
    }
    // 檢查是否已存在
    const idx = cart.findIndex((item) => item.id === id);
    if (idx >= 0) {
      cart[idx].qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
    localStorage.setItem("oms-cart", JSON.stringify(cart));
    message.success("已加入購物車");
  };

  const goToCart = () => {
    window.location.href = "/cart";
  };

  const filtered = products.filter(
    (p) =>
      p.name.includes(search) ||
      (p.desc && p.desc.includes(search))
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h2>商品列表</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Input
          placeholder="搜尋商品名稱/描述"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
        />
        <Button onClick={goToCart} type="primary">
          前往購物車
        </Button>
      </div>
      <Row gutter={[24, 24]}>
        {filtered.length === 0 && <div style={{ color: '#aaa', margin: 32 }}>暫無商品</div>}
        {filtered.map((p) => (
          <Col span={6} key={p.id}>
            <Card
              hoverable
              cover={p.image_url ? <img src={p.image_url} alt={p.name} style={{ height: 180, objectFit: "cover" }} /> : null}
              actions={[
                <Button
                  type="primary"
                  disabled={p.stock === 0}
                  onClick={() => addToCart(p.id)}
                >
                  {p.stock === 0 ? "缺貨" : "加入購物車"}
                </Button>,
                <Button type="link" onClick={() => navigate(`/shop/${p.id}`)}>
                  查看詳情
                </Button>,
              ]}
            >
              <Card.Meta
                title={p.name}
                description={
                  <>
                    <div>價格：￥{p.price}</div>
                    <div>庫存：{p.stock}</div>
                    <div style={{ color: '#888', fontSize: 12 }}>{p.desc}</div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShopPage;
