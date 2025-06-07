import React, { useState, useEffect } from "react"; // # 保留：useState, useEffect
import { ProTable } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { type Order, getOrders, deleteOrder } from "../../api/orders"; // # 修改：匯入 getOrders, deleteOrder
import { getCurrentUser } from "../../utils/auth"; // # 修改：匯入 getCurrentUser
import { Button, message } from "antd"; // # 保留：message

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const current = getCurrentUser(); // # 修改：取得目前使用者
  const [data, setData] = useState<Order[]>([]); // # 保留：state 存放列表
  const [loading, setLoading] = useState<boolean>(false); // # 保留：loading 狀態

  // # 修改：抽出 fetchData，方便重整
  const fetchData = async () => {
    setLoading(true);
    try {
      const list = await getOrders();
      setData(list);
    } catch {
      message.error("取得訂單列表失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // # 修改：初始化時呼叫
  }, []);

  const columns = [
    { title: "訂單編號", dataIndex: "orderId", key: "orderId" },
    { title: "客戶名稱", dataIndex: "customer", key: "customer" },
    { title: "金額", dataIndex: "amount", key: "amount" },
    { title: "狀態", dataIndex: "status", key: "status" },
    { title: "下單日期", dataIndex: "date", key: "date" },
    { title: "建立者", dataIndex: "createdBy", key: "createdBy" }, // # 已有：顯示 createdBy
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Order) => {
        const canDelete =
          current?.role === "admin" || record.createdBy === current?.username; // # 修改：admin 可刪所有，user 只能刪自己
        return (
          <span>
            <Button
              type="link"
              onClick={() => navigate(`/orders/${record.orderId}`)}
            >
              查看
            </Button>
            <Button
              type="link"
              onClick={() => navigate(`/orders/${record.orderId}/edit`)}
            >
              編輯
            </Button>
            {canDelete && ( // # 修改：只有有權限才顯示刪除
              <Button
                type="link"
                danger
                onClick={async () => {
                  setLoading(true);
                  try {
                    await deleteOrder(record.orderId); // # 修改：呼叫 deleteOrder
                    message.success("刪除成功");
                    await fetchData(); // # 修改：刪除後重新載入列表
                  } catch {
                    message.error("刪除失敗");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                刪除
              </Button>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <ProTable<Order>
      columns={columns}
      dataSource={data}
      rowKey="orderId"
      loading={loading}
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
