import React, { useState, useEffect } from "react"; // # 修改：保留 useState, useEffect
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Button, message, Spin } from "antd"; // # 修改：移除 Table, items 部分
import {
  getOrderDetail,
  type Order, // # 修改：從 api/orders 匯入 Order 型別（含 createdBy）
} from "../../api/orders"; // # 修改：正確 API 路徑

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // # 修改：型別化 useParams
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null); // # 修改：state 存放訂單
  const [loading, setLoading] = useState<boolean>(false); // # 修改：新增 loading 狀態

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderDetail(id)
      .then(setOrder)
      .catch(() => message.error("取得訂單詳情失敗"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Spin style={{ width: "100%", marginTop: 100 }} />; // # 修改：載入中顯示 Spin
  }
  if (!order) {
    return <div>找不到資料</div>; // # 修改：無資料時顯示訊息
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
        <Descriptions.Item label="訂單編號">{order.orderId}</Descriptions.Item>{" "}
        {/* # 新增：顯示 orderId */}
        <Descriptions.Item label="客戶名稱">{order.customer}</Descriptions.Item>
        <Descriptions.Item label="金額">{order.amount}</Descriptions.Item>
        <Descriptions.Item label="狀態">{order.status}</Descriptions.Item>
        <Descriptions.Item label="下單日期">{order.date}</Descriptions.Item>
        <Descriptions.Item label="備註">
          {order.remark || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="建立者">{order.createdBy}</Descriptions.Item>{" "}
        {/* # 新增：顯示建立者 */}
      </Descriptions>

      <Button style={{ marginTop: 24 }} onClick={() => navigate("/orders")}>
        返回列表
      </Button>
    </Card>
  );
};

export default OrderDetail;
