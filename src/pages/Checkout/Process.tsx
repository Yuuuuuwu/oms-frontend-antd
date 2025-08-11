import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Radio, 
  message,
  Steps,
  Divider,
  Alert
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CreditCardOutlined, 
  EnvironmentOutlined, 
  ShoppingCartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { createOrder } from '../../api/orders';
import { payOrder } from '../../api/payments';
import { getCurrentUser } from '../../utils/auth';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CheckoutData {
  items: any[];
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  user: any;
}

const CheckoutProcess: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('ecpay');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 從 Preview 頁面接收資料
    const data = location.state as CheckoutData;
    if (!data || !data.items || data.items.length === 0) {
      message.error('無效的訂單資料');
      navigate('/cart');
      return;
    }
    
    setCheckoutData(data);
    
    // 預填使用者資料
    form.setFieldsValue({
      receiver_name: data.user?.name || '',
      receiver_phone: data.user?.phone || '',
    });
  }, [location.state, navigate, form]);

  const steps = [
    {
      title: '填寫資料',
      icon: <EnvironmentOutlined />,
    },
    {
      title: '選擇付款',
      icon: <CreditCardOutlined />,
    },
    {
      title: '確認訂單',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    if (currentStep === 0) {
      // 驗證第一步驟表單
      try {
        await form.validateFields(['receiver_name', 'receiver_phone', 'shipping_address']);
        setCurrentStep(1);
      } catch (error) {
        message.error('請填寫完整的收件資訊');
      }
    } else if (currentStep === 1) {
      // 驗證付款方式
      if (!paymentMethod) {
        message.error('請選擇付款方式');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitOrder = async () => {
    if (!checkoutData) return;
    
    setLoading(true);
    try {
      // 先驗證並獲取所有表單數據
      const formValues = await form.validateFields();
      console.log('表單驗證通過，獲取的數據:', formValues);
      
      const orderData = {
        items: checkoutData.items.map(item => ({
          product_id: item.id,
          qty: item.qty
        })),
        receiver_name: formValues.receiver_name,
        receiver_phone: formValues.receiver_phone,
        shipping_address: formValues.shipping_address,
        remark: formValues.remark || ''
      };

      console.log('準備發送的訂單數據:', orderData);
      console.log('checkoutData.items:', checkoutData.items);

      const order = await createOrder(orderData);
      
      // 如果是 ECPay，進行付款流程
      if (paymentMethod === 'ecpay') {
        const paymentData = {
          amount: checkoutData.finalAmount,
          payment_method: 'ecpay',
          order_id: order.id
        };
        
        const paymentResult = await payOrder(order.id, paymentData);
        
        // 清空購物車
        localStorage.removeItem('oms-cart');
        localStorage.removeItem('checkout-items');
        
        // 導向付款結果頁面
        navigate('/payments/payment_result', {
          state: {
            order,
            payment: paymentResult,
            success: true
          }
        });
      } else {
        // 其他付款方式的處理
        message.success('訂單建立成功！');
        localStorage.removeItem('oms-cart');
        localStorage.removeItem('checkout-items');
        navigate('/orders');
      }
    } catch (error: any) {
      console.error('訂單建立失敗:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.description || '訂單建立失敗，請稍後再試';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) {
    return <div>載入中...</div>;
  }

  return (
    <div>
      <Title level={2}>
        <ShoppingCartOutlined /> 結帳流程
      </Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Steps current={currentStep} items={steps} />
      </Card>

      <Row gutter={[24, 24]}>
        {/* 左側：表單區域 */}
        <Col xs={24} lg={16}>
          <Form form={form} layout="vertical">
            {currentStep === 0 && (
              <Card title="收件資訊" extra={<Text type="secondary">步驟 1/3</Text>}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="收件人姓名"
                      name="receiver_name"
                      rules={[{ required: true, message: '請輸入收件人姓名' }]}
                    >
                      <Input placeholder="請輸入姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="聯絡電話"
                      name="receiver_phone"
                      rules={[{ required: true, message: '請輸入聯絡電話' }]}
                    >
                      <Input placeholder="請輸入電話號碼" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="配送地址"
                  name="shipping_address"
                  rules={[{ required: true, message: '請輸入配送地址' }]}
                >
                  <TextArea 
                    rows={3} 
                    placeholder="請輸入詳細地址（含縣市、區域、街道及門牌號）" 
                  />
                </Form.Item>

                <Form.Item label="備註" name="remark">
                  <TextArea rows={2} placeholder="特殊需求或備註（非必填）" />
                </Form.Item>
              </Card>
            )}

            {currentStep === 1 && (
              <Card title="付款方式" extra={<Text type="secondary">步驟 2/3</Text>}>
                <Radio.Group 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="ecpay">
                      <Space>
                        <CreditCardOutlined style={{ color: '#1890ff' }} />
                        <div>
                          <Text strong>ECPay 線上付款</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            支援信用卡、ATM、超商代碼等多種付款方式
                          </Text>
                        </div>
                      </Space>
                    </Radio>
                    <Radio value="bank_transfer">
                      <Space>
                        <div>
                          <Text strong>銀行轉帳</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            轉帳後請主動聯絡客服確認
                          </Text>
                        </div>
                      </Space>
                    </Radio>
                    <Radio value="cod">
                      <Space>
                        <div>
                          <Text strong>貨到付款</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            配送時現金付款（可能需加收手續費）
                          </Text>
                        </div>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
                
                {paymentMethod === 'bank_transfer' && (
                  <Alert
                    style={{ marginTop: 16 }}
                    message="銀行轉帳資訊"
                    description={
                      <div>
                        <Text>銀行：玉山銀行</Text><br />
                        <Text>帳號：1234-567-890123</Text><br />
                        <Text>戶名：OMS 訂單管理系統</Text>
                      </div>
                    }
                    type="info"
                    showIcon
                  />
                )}
              </Card>
            )}

            {currentStep === 2 && (
              <Card title="訂單確認" extra={<Text type="secondary">步驟 3/3</Text>}>
                <Alert
                  message="請確認您的訂單資訊"
                  description="按下「確認訂單」後將無法修改訂單內容"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                
                <div>
                  <Text strong>收件資訊：</Text>
                  <div style={{ marginLeft: 16, marginTop: 8 }}>
                    <Text>姓名：{form.getFieldValue('receiver_name')}</Text><br />
                    <Text>電話：{form.getFieldValue('receiver_phone')}</Text><br />
                    <Text>地址：{form.getFieldValue('shipping_address')}</Text><br />
                    {form.getFieldValue('remark') && (
                      <Text>備註：{form.getFieldValue('remark')}</Text>
                    )}
                  </div>
                  
                  <Divider />
                  
                  <Text strong>付款方式：</Text>
                  <div style={{ marginLeft: 16, marginTop: 8 }}>
                    <Text>
                      {paymentMethod === 'ecpay' && 'ECPay 線上付款'}
                      {paymentMethod === 'bank_transfer' && '銀行轉帳'}
                      {paymentMethod === 'cod' && '貨到付款'}
                    </Text>
                  </div>
                  
                  <Divider />
                  
                  <Text strong>訂單金額：</Text>
                  <div style={{ marginLeft: 16, marginTop: 8 }}>
                    <Text>商品總計：${checkoutData.totalAmount.toLocaleString()}</Text><br />
                    <Text>運費：免費</Text><br />
                    <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                      總計：${checkoutData.finalAmount.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </Card>
            )}
          </Form>
        </Col>

        {/* 右側：訂單摘要 */}
        <Col xs={24} lg={8}>
          <Card title="訂單摘要" style={{ position: 'sticky', top: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>商品数量：</Text>
                <Text>{checkoutData.items.length} 項</Text>
              </div>
              
              <div>
                <Text strong>商品總計：</Text>
                <Text>${checkoutData.totalAmount.toLocaleString()}</Text>
              </div>
              
              <div>
                <Text strong>運費：</Text>
                <Text>免費</Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <Text strong style={{ fontSize: 16 }}>總計：</Text>
                <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                  ${checkoutData.finalAmount.toLocaleString()}
                </Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Space direction="vertical" style={{ width: '100%' }}>
                {currentStep < 2 && (
                  <Button 
                    type="primary" 
                    size="large" 
                    block 
                    onClick={handleNext}
                  >
                    {currentStep === 0 ? '下一步' : '確認付款方式'}
                  </Button>
                )}
                
                {currentStep === 2 && (
                  <Button 
                    type="primary" 
                    size="large" 
                    block 
                    loading={loading}
                    onClick={handleSubmitOrder}
                  >
                    確認訂單
                  </Button>
                )}
                
                {currentStep > 0 && (
                  <Button 
                    size="large" 
                    block 
                    onClick={handlePrev}
                  >
                    上一步
                  </Button>
                )}
                
                <Button 
                  size="large" 
                  block 
                  onClick={() => navigate('/cart')}
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

export default CheckoutProcess;
