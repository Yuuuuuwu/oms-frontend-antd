import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";

interface EditProps {
  isNew?: boolean;
}

const OrderEdit: React.FC<EditProps> = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // 這裡可以連結後端 API
    if (isNew) {
      alert("已新增訂單（實際專案請呼叫API）");
    } else {
      alert("已更新訂單（實際專案請呼叫API）");
    }
    navigate("/orders");
  };

  return (
    <Card title={isNew ? "新增訂單" : `編輯訂單 - ${id}`}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
        <Form.Item label="狀態" name="status" rules={[{ required: true }]}>
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
