import React from "react";
import { ProTable } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { type Order, orders } from "../../types/orders";
import { Button } from "antd";

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
  return (
    <ProTable
      columns={columns}
      dataSource={orders}
      rowKey="orderId"
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
