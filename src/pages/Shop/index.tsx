// src/pages/Shop/index.tsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Input, message } from "antd";
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      // 強制型別轉換，並處理 is_active 預設為 true
      setProducts((res.data as any[]).filter((p) => p.is_active !== false));
    } catch {
      message.error("載入商品失敗");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (id: number) => {
    const cartRaw = localStorage.getItem("oms-cart") || "[]";
    let cart: { id: number; qty: number }[] = [];
    try {
      cart = JSON.parse(cartRaw);
    } catch {}
    const idx = cart.findIndex((item) => item.id === id);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ id, qty: 1 });
    }
    localStorage.setItem("oms-cart", JSON.stringify(cart));
    message.success("已加入購物車");
  };

  const previewCart = () => {
    const cartRaw = localStorage.getItem("oms-cart");
    let cart = cartRaw ? JSON.parse(cartRaw) : [];
    if (cart.length === 0) {
      message.info("購物車為空");
      return;
    }
    // 用 navigate 而非 window.location
    navigate("/cart", { state: { cart } });
  };

  const filtered = products.filter(
    (p) => p.name.includes(search) || (p.desc && p.desc.includes(search))
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h2>商品列表</h2>

      {/* 搜尋列 + 預覽購物車 */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Input
          placeholder="搜尋商品名稱／描述"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
        />
        <Button
          onClick={previewCart}
          type="primary"
          style={{ whiteSpace: "nowrap" }}
        >
          預覽購物車
        </Button>
      </div>

      {/* 商品卡片 */}
      <Row gutter={[16, 24]}>
        {filtered.length === 0 && (
          <div style={{ color: "#aaa", margin: 32 }}>暫無商品</div>
        )}
        {filtered.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <Card
              hoverable
              style={{ width: "100%" }}
              cover={
                p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    style={{ height: 180, objectFit: "cover" }}
                  />
                )
              }
              actions={[
                <Button
                  type="primary"
                  disabled={p.stock === 0}
                  onClick={() => addToCart(p.id)}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {p.stock === 0 ? "缺貨" : "加入購物車"}
                </Button>,
                <Button
                  type="link"
                  onClick={() => navigate(`/shop/${p.id}`)}
                  style={{ whiteSpace: "nowrap" }}
                >
                  查看詳情
                </Button>,
              ]}
            >
              <Card.Meta
                title={p.name}
                description={
                  <>
                    {/* 將 ¥ 換成 $ */}
                    <div>價格：${p.price}</div>
                    <div>庫存：{p.stock}</div>
                    {p.desc && (
                      <div style={{ color: "#888", fontSize: 12 }}>
                        {p.desc}
                      </div>
                    )}
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
