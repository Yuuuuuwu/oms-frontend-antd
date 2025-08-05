import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Typography, Space, Divider, Row, Col, Tag, Statistic } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';
import { getCurrentUser } from '../../utils/auth';

const { Title, Text } = Typography;

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  stock: number;
  image_url?: string;
}

const CheckoutPreview: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 載入使用者資訊
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // 從 state 或 localStorage 取得購物車商品
    const items = location.state?.items || JSON.parse(localStorage.getItem('checkout-items') || '[]');
    setCartItems(items);

    // 如果沒有商品，導向購物車
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [navigate, location.state]);

  // 計算總價
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = 0; // 免運費
  const finalAmount = totalAmount + shippingFee;

  // 表格欄位定義
  const columns = [
    {
      title: '商品',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CartItem) => (
        <Space>
          {record.image_url && (
            <img 
              src={record.image_url} 
              alt={text} 
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">庫存: {record.stock}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '單價',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <Text>${price.toLocaleString()}</Text>,
    },
    {
      title: '數量',
      dataIndex: 'qty',
      key: 'qty',
      render: (qty: number) => <Tag color="blue">{qty}</Tag>,
    },
    {
      title: '小計',
      key: 'subtotal',
      render: (_: any, record: CartItem) => (
        <Text strong>${(record.price * record.qty).toLocaleString()}</Text>
      ),
    },
  ];

  const handleProceedToProcess = () => {
    // 將結帳資訊傳遞到結帳處理頁面
    navigate('/checkout/process', {
      state: {
        items: cartItems,
        totalAmount,
        shippingFee,
        finalAmount,
        user
      }
    });
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <div>
      <Title level={2}>
        <ShoppingCartOutlined /> 訂單確認
      </Title>
      <Text type="secondary">請確認您的商品和訂單金額</Text>
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 左側：商品列表 */}
        <Col xs={24} lg={16}>
          <Card title="訂單商品" extra={<Text type="secondary">{cartItems.length} 項商品</Text>}>
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* 右側：訂單摘要 */}
        <Col xs={24} lg={8}>
          <Card title="訂單摘要" style={{ position: 'sticky', top: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">

              {/* 價格摘要 */}
              <div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>商品總計：</Text>
                    <Text>${totalAmount.toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>運費：</Text>
                    <Text>免費</Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 16 }}>總計：</Text>
                    <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                      ${finalAmount.toLocaleString()}
                    </Text>
                  </div>
                </Space>
              </div>

              <Divider />

              {/* 操作按鈕 */}
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={handleProceedToProcess}
                >
                  下一步：填寫資訊
                </Button>
                <Button 
                  size="large" 
                  block 
                  onClick={handleBackToCart}
                >
                  返回購物車
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPreview;
