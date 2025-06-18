// src/pages/Shop/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, message } from "antd";
import { getProduct } from "../../api/products";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(Number(id))
      .then((data) => setProduct(data))
      .catch(() => message.error("取得商品詳情失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin />;
  if (!product) return <div>找不到商品</div>;

  return (
    <Card
      title={product.name}
      extra={<Button onClick={() => navigate(-1)}>返回</Button>}
      style={{ maxWidth: 600, margin: "32px auto", width: "100%" }}
      cover={
        product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ height: 300, objectFit: "cover" }}
          />
        )
      }
    >
      <div>價格：${product.price}</div>
      <div>庫存：{product.stock}</div>
      <div>描述：{product.desc}</div>
      <div>分類：{product.category?.name || "-"}</div>
      <Button
        type="primary"
        style={{ marginTop: 24 }}
        disabled={product.stock === 0}
        onClick={() =>
          message.success("已加入購物車（請於商品列表頁操作實際加入）")
        }
      >
        {product.stock === 0 ? "缺貨" : "加入購物車"}
      </Button>
    </Card>
  );
};

export default ProductDetail;
