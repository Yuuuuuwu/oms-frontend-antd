import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { type Order, orders } from "../../types/orders";
import { Form, Input, InputNumber, Button, Card } from "antd";

interface EditProps {
  isNew?: boolean;
}

const OrderEdit: React.FC<EditProps> = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = !isNew ? orders.find((o) => o.orderId === id) : undefined;

  const [form] = Form.useForm();

  React.useEffect(() => {
    if (order) {
      form.setFieldsValue(order);
    }
  }, [order, form]);

  const onFinish = (values: Order) => {
    // 這裡可以連結後端 API
    if (isNew) {
      alert("已新增訂單（實際專案請呼叫API）");
    } else {
      alert("已更新訂單（實際專案請呼叫API）");
    }
    navigate("/orders");
  };

  return (
    <Card title={isNew ? "新增訂單" : `編輯訂單 - ${order?.orderId}`}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={order}
      >
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
