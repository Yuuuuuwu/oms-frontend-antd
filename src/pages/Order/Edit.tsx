import React, { useState, useEffect } from "react"; // # 修改：保留 useState, useEffect
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Button, Card, message, Spin } from "antd"; // # 修改：加入 message, Spin
import {
  createOrder,
  getOrderDetail,
  updateOrder,
  type Order, // # 修改：從 api/orders 匯入 Order 型別
} from "../../api/orders"; // # 修改：改用正確的 API 路徑

interface EditProps {
  isNew?: boolean;
}

const OrderEdit: React.FC<EditProps> = ({ isNew }) => {
  const { id } = useParams<{ id: string }>(); // # 修改：型別化 useParams
  const navigate = useNavigate();
  const [form] = Form.useForm<Order>(); // # 修改：使用從 api 匯入的 Order 型別
  const [loading, setLoading] = useState<boolean>(false); // # 修改：新增 loading 狀態

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      getOrderDetail(id)
        .then((o) => form.setFieldsValue(o))
        .catch(() => message.error("取得訂單資料失敗"))
        .finally(() => setLoading(false));
    }
  }, [isNew, id, form]);

  const onFinish = async (values: Order) => {
    setLoading(true);
    try {
      if (isNew) {
        await createOrder(values); // # 修改：呼叫 createOrder
        message.success("新增訂單成功");
      } else if (id) {
        await updateOrder(id, values); // # 修改：呼叫 updateOrder
        message.success("更新訂單成功");
      }
      navigate("/orders");
    } catch {
      message.error(isNew ? "新增訂單失敗" : "更新訂單失敗"); // # 修改：顯示錯誤訊息
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin style={{ width: "100%", marginTop: 100 }} />; // # 修改：載入中顯示 Spin
  }

  return (
    <Card title={isNew ? "新增訂單" : `編輯訂單 - ${id}`}>
      <Form<Order> form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="訂單編號" name="orderId" rules={[{ required: true }]}>
          <Input disabled={!isNew} />
        </Form.Item>
        <Form.Item
          label="客戶名稱"
          name="customer"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="金額" name="amount" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="狀態" name="status" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="下單日期" name="date" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="備註" name="remark">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isNew ? "新增" : "更新"}
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            onClick={() => navigate("/orders")}
          >
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderEdit;
