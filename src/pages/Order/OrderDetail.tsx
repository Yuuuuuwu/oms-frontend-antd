import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message, Card, Descriptions, Table } from "antd";
import { axiosWithAuth } from "../../utils/axiosWithAuth";

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosWithAuth.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => message.error("取得訂單失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  // 新增：自動刷新訂單歷程
  useEffect(() => {
    const interval = setInterval(() => {
      axiosWithAuth.get(`/orders/${id}`)
        .then((res) => {
          if (res.data) setOrder(res.data);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await axiosWithAuth.post(`/payments/ecpay/${id}`);
      const { ecpay_url, params } = res.data;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = ecpay_url;
      Object.entries(params).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error("產生付款連結失敗", e);
      message.error("產生付款連結失敗");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;
  return (
    <Card title="訂單詳情" loading={loading}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="訂單編號">
          {order?.order_sn}
        </Descriptions.Item>
        <Descriptions.Item label="金額">
          ${order?.total_amount}
        </Descriptions.Item>
        <Descriptions.Item label="狀態">{
          (() => {
            const map: Record<string, string> = { pending: "待付款", paid: "已付款", shipping: "配送中", completed: "已完成", cancelled: "已取消" };
            return map[order?.status] || order?.status;
          })()
        }</Descriptions.Item>
        {/* 新增：下單帳號 username */}
        <Descriptions.Item label="下單帳號">
          {order?.user?.username || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="收件人">
          {order?.receiver_name}
        </Descriptions.Item>
        <Descriptions.Item label="電話">
          {order?.receiver_phone}
        </Descriptions.Item>
        <Descriptions.Item label="地址">
          {order?.shipping_address}
        </Descriptions.Item>
        <Descriptions.Item label="備註">{order?.remark}</Descriptions.Item>
      </Descriptions>
      <div style={{ margin: "16px 0" }}>
        <b>商品明細</b>
        <Table
          dataSource={order?.items || []}
          rowKey="id"
          pagination={false}
          columns={[
            { title: "商品名稱", dataIndex: "product_name" },
            { title: "單價", dataIndex: "price", render: (v: number) => `$${v}` },
            { title: "數量", dataIndex: "qty" },
            { title: "小計", render: (_: any, r: any) => `$${r.price * r.qty}` },
          ]}
        />
      </div>
      <div style={{ margin: "16px 0" }}>
        <b>狀態歷程</b>
        <Table
          dataSource={order?.history || []}
          rowKey="id"
          pagination={false}
          columns={[
            { title: "狀態", dataIndex: "status", render: (v: string) => {
                const map: Record<string, string> = { pending: "待付款", paid: "已付款", shipping: "配送中", completed: "已完成", cancelled: "已取消" };
                return map[v] || v;
              }
            },
            { title: "操作人", dataIndex: "operator" },
            { title: "時間", dataIndex: "operated_at", render: (v: string) => v ? new Date(v).toLocaleString('zh-TW', { hour12: false }) : "" },
            { title: "備註", dataIndex: "remark" },
          ]}
        />
      </div>
      {order?.status === "pending" && (
        <Button type="primary" onClick={handlePay} style={{ marginTop: 16 }}>
          前往付款
        </Button>
      )}
    </Card>
  );
};

export default OrderDetail;
