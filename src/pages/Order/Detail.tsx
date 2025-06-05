import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Order, orders } from "../../types/orders";
import { Card, Descriptions, Button, Table } from "antd";

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find((o) => o.orderId === id);

  if (!order) return <div>找不到資料</div>;

  return (
    <Card
      title={`訂單詳情 - ${order.orderId}`}
      extra={
        <Button
          type="primary"
          onClick={() => navigate(`/orders/${order.orderId}/edit`)}
        >
          編輯
        </Button>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="客戶名稱">{order.customer}</Descriptions.Item>
        <Descriptions.Item label="金額">{order.amount}</Descriptions.Item>
        <Descriptions.Item label="狀態">{order.status}</Descriptions.Item>
        <Descriptions.Item label="下單日期">{order.date}</Descriptions.Item>
        <Descriptions.Item label="備註">
          {order.remark || "-"}
        </Descriptions.Item>
      </Descriptions>
      <h3 style={{ marginTop: 24 }}>商品明細</h3>
      <Table
        dataSource={order.items}
        columns={[
          { title: "商品名稱", dataIndex: "name", key: "name" },
          { title: "數量", dataIndex: "qty", key: "qty" },
          { title: "單價", dataIndex: "price", key: "price" },
        ]}
        rowKey="name"
        pagination={false}
      />
      <Button style={{ marginTop: 24 }} onClick={() => navigate("/orders")}>
        返回列表
      </Button>
    </Card>
  );
};

export default OrderDetail;
