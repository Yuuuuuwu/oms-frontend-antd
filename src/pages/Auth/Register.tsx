import React from "react";
import { Form, Input, Button, Card, message, Select, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { register, login } from "../../utils/auth";
import { createOrder } from "../../api/orders";

const { Option } = Select;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [checkoutModalVisible, setCheckoutModalVisible] = React.useState(false);
  const [checkoutForm] = Form.useForm();

  const onFinish = async (values: any) => {
    const success = await register(
      values.username,
      values.email,
      values.password,
      values.role,
      values.phone
    );
    if (success) {
      // 註冊成功後自動登入
      const loginSuccess = await login(values.email, values.password);
      if (loginSuccess) {
        // 自動下單流程
        if (localStorage.getItem("oms-auto-checkout")) {
          const cartRaw = localStorage.getItem("oms-cart");
          if (cartRaw) {
            try {
              const cart = JSON.parse(cartRaw);
              if (Array.isArray(cart) && cart.length > 0) {
                setCheckoutModalVisible(true);
              }
            } catch (err) {
              console.error("Parse cart error:", err);
              message.error("購物車資料錯誤");
            }
          }
        } else {
          message.success("註冊並登入成功，歡迎！");
          navigate("/shop");
        }
      } else {
        message.error("自動登入失敗，請手動登入");
        navigate("/login");
      }
    }
  };

  const handleCheckout = async (orderInfo: any) => {
    try {
      const cartRaw = localStorage.getItem("oms-cart");
      if (!cartRaw) throw new Error("購物車是空的");

      const cart = JSON.parse(cartRaw);
      const order = await createOrder({
        receiver_name: orderInfo.receiver_name,
        receiver_phone: orderInfo.receiver_phone,
        shipping_address: orderInfo.shipping_address,
        remark: orderInfo.remark,
        items: cart.map((item: any) => ({ product_id: item.id, qty: item.qty })),
      });

      message.success("訂單建立成功");
      localStorage.removeItem("oms-cart");
      localStorage.removeItem("oms-auto-checkout");
      setCheckoutModalVisible(false);
      navigate(`/orders/${order.id}`);
    } catch (e: any) {
      message.error(e.message || "下單失敗");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", flexDirection: "column" }}>
      <Card title="註冊" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item label="用戶名" name="username" rules={[{ required: true, message: "請輸入用戶名" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "請輸入有效 Email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密碼" name="password" rules={[{ required: true, message: "請輸入密碼" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true, message: "請選擇角色" }]}>
            <Select placeholder="請選擇角色">
              <Option value="admin">管理員</Option>
              <Option value="seller">賣家</Option>
              <Option value="customer">顧客</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              註冊
            </Button>
          </Form.Item>
          <Form.Item>
            已有帳號？<a href="/login">登入</a>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="填寫收件資訊以完成下單"
        visible={checkoutModalVisible}
        onCancel={() => {
          setCheckoutModalVisible(false);
          localStorage.removeItem("oms-auto-checkout");
          message.info("已取消自動下單");
          navigate("/");
        }}
        footer={null}
      >
        <Form form={checkoutForm} layout="vertical" onFinish={handleCheckout}>
          <Form.Item label="收件人" name="receiver_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="電話" name="receiver_phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="shipping_address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="備註" name="remark">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              送出訂單
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Register;
