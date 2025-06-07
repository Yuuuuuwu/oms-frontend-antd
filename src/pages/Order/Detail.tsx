import React, { useState, useEffect } from "react"; // # 修改：加入 useState, useEffect
import { useParams, useNavigate } from "react-router-dom";
import { type Order } from "../../types/orders"; // # 修改：移除靜態 orders, 僅匯入型別
import { Card, Descriptions, Button, Table, message, Spin } from "antd"; // # 修改：加入 message, Spin
import { getOrderDetail } from "../../api/orders"; // # 修改：匯入後端 API

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // # 修改：型別化 useParams
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null); // # 修改：新增 state 存放訂單
  const [loading, setLoading] = useState<boolean>(false); // # 修改：新增 loading 狀態

  useEffect(() => {
    // # 修改：元件掛載後呼叫後端
    if (!id) return;
    setLoading(true);
    getOrderDetail(id)
      .then(setOrder)
      .catch(() => message.error("取得訂單詳情失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    // # 修改：載入中顯示 Spin
    return <Spin />;
  }
  if (!order) {
    // # 修改：找不到資料時處理
    return <div>找不到資料</div>;
  }

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
