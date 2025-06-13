import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { payOrder, type Payment } from "../../api/payments";

const PaymentPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]); // 實務應有 getPayments API
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 示範付款流程
  const handlePay = async (order_id: number) => {
    setOpen(true);
    form.setFieldsValue({ order_id });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payment = await payOrder(values.order_id, values);
      message.success("付款成功");
      setPayments((prev) => [...prev, payment]);
      setOpen(false);
    } catch {
      message.error("付款失敗");
    } finally {
      setLoading(false);
    }
  };

  // 假資料展示
  const columns = [
    { title: "付款ID", dataIndex: "id" },
    { title: "訂單ID", dataIndex: "order_id" },
    { title: "金額", dataIndex: "amount" },
    { title: "狀態", dataIndex: "status" },
    { title: "付款方式", dataIndex: "payment_method" },
    { title: "交易編號", dataIndex: "transaction_id" },
    { title: "付款時間", dataIndex: "paid_at" },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        新增付款
      </Button>
      <Table columns={columns} dataSource={payments} rowKey="id" />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title="付款"
        confirmLoading={loading}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="訂單ID"
            name="order_id"
            rules={[{ required: true }]}
          >
            {" "}
            <InputNumber min={1} style={{ width: "100%" }} />{" "}
          </Form.Item>
          <Form.Item
            label="金額"
            name="amount"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            {" "}
            <InputNumber min={0} style={{ width: "100%" }} />{" "}
          </Form.Item>
          <Form.Item
            label="付款方式"
            name="payment_method"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentPage;
