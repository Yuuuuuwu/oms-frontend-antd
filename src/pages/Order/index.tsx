import React, { useState, useEffect } from "react"; // # 修改：加入 useState, useEffect
import { ProTable } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { type Order } from "../../types/orders"; // # 修改：僅匯入 Order 型別，移除靜態 orders
import { Button, message } from "antd"; // # 修改：加入 message
import { getOrders } from "../../api/orders"; // # 修改：匯入後端 API

const columns = [
  { title: "訂單編號", dataIndex: "orderId", key: "orderId" },
  { title: "客戶名稱", dataIndex: "customer", key: "customer" },
  { title: "金額", dataIndex: "amount", key: "amount" },
  { title: "狀態", dataIndex: "status", key: "status" },
  { title: "下單日期", dataIndex: "date", key: "date" },
  {
    title: "操作",
    key: "action",
    render: (_: any, record: Order) => (
      <span>
        <Button
          type="link"
          onClick={() => (window.location.href = `/orders/${record.orderId}`)}
        >
          查看
        </Button>
        <Button
          type="link"
          onClick={() =>
            (window.location.href = `/orders/${record.orderId}/edit`)
          }
        >
          編輯
        </Button>
      </span>
    ),
  },
];

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Order[]>([]); // # 修改：新增 state 存放列表
  const [loading, setLoading] = useState<boolean>(false); // # 修改：載入狀態

  useEffect(() => {
    // # 修改：元件掛載後呼叫 API
    setLoading(true);
    getOrders()
      .then(setData)
      .catch(() => message.error("取得訂單列表失敗"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProTable<Order>
      columns={columns}
      dataSource={data} // # 修改：由 API 回傳的 data
      rowKey="orderId"
      loading={loading} // # 修改：顯示載入中
      search={false}
      toolBarRender={() => [
        <Button
          type="primary"
          key="new"
          onClick={() => navigate("/orders/new")}
        >
          新增訂單
        </Button>,
      ]}
      pagination={{ pageSize: 10 }}
      headerTitle="訂單列表"
      onRow={(record) => ({
        onDoubleClick: () => navigate(`/orders/${record.orderId}`),
      })}
    />
  );
};

export default OrderList;
