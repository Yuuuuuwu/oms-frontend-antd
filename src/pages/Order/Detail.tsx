import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, message, Card, Descriptions, Table } from "antd";
import { getToken } from "../../utils/auth";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetchWithAuth(`http://localhost:5000/orders/${id}`, {
    headers: { "Content-Type": "application/json" },
  })
    .then(res => res.ok ? res.json() : Promise.reject("取得訂單失敗"))
    .then(setOrder)
    .catch(() => message.error("取得訂單失敗"))
    .finally(() => setLoading(false));
}, [id]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/payments/ecpay/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const { ecpay_url, params } = await res.json();
      console.log("ECPay Params ➔", params);
      const form = document.createElement("form");
      form.method = "POST";
      form.action = ecpay_url;
      Object.entries(params).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch {
      message.error("產生付款連結失敗");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;
  return (
    <Card title="訂單詳情" loading={loading}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="訂單編號">{order.order_sn}</Descriptions.Item>
        <Descriptions.Item label="金額">{order.total_amount}</Descriptions.Item>
        <Descriptions.Item label="狀態">{order.status}</Descriptions.Item>
        <Descriptions.Item label="收件人">{order.receiver_name}</Descriptions.Item>
        <Descriptions.Item label="電話">{order.receiver_phone}</Descriptions.Item>
        <Descriptions.Item label="地址">{order.shipping_address}</Descriptions.Item>
        <Descriptions.Item label="備註">{order.remark}</Descriptions.Item>
      </Descriptions>
      <div style={{ margin: '16px 0' }}>
        <b>商品明細</b>
        <Table
          dataSource={order.items || []}
          rowKey="id"
          pagination={false}
          columns={[
            { title: "商品名稱", dataIndex: "product_name" },
            { title: "單價", dataIndex: "price" },
            { title: "數量", dataIndex: "qty" },
            { title: "小計", render: (_, r) => r.price * r.qty },
          ]}
        />
      </div>
      <div style={{ margin: '16px 0' }}>
        <b>狀態歷程</b>
        <Table
          dataSource={order.history || []}
          rowKey="id"
          pagination={false}
          columns={[
            { title: "狀態", dataIndex: "status" },
            { title: "操作人", dataIndex: "operator" },
            { title: "時間", dataIndex: "operated_at" },
            { title: "備註", dataIndex: "remark" },
          ]}
        />
      </div>
      {order.status === "pending" && (
        <Button type="primary" onClick={handlePay} style={{ marginTop: 16 }}>
          前往付款
        </Button>
      )}
    </Card>
  );
};

export default OrderDetail;
