import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Tag,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Modal,
} from "antd";
import { getOrders, updateOrderStatus } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusOptions = [
  { value: "pending", label: "待付款" },
  { value: "paid", label: "已付款" },
  { value: "shipping", label: "配送中" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<any>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getOrders({
        ...query,
        page,
        page_size: pageSize,
        ...params,
      });
      setOrders(res.data);
      setTotal(res.total);
    } catch {
      message.error("取得訂單失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, pageSize, query]);

  const onSearch = (values: any) => {
    const { status, date, keyword } = values;
    setQuery({
      status,
      date_start: date?.[0] ? dayjs(date[0]).format("YYYY-MM-DD") : undefined,
      date_end: date?.[1] ? dayjs(date[1]).format("YYYY-MM-DD") : undefined,
      keyword,
    });
    setPage(1);
  };

  const handleBatchStatus = (status: string) => {
    Modal.confirm({
      title: `確定要將選取訂單批次設為「${
        statusOptions.find((s) => s.value === status)?.label
      }」嗎？`,
      onOk: async () => {
        try {
          await updateOrderStatus(selectedRowKeys, status);
          message.success("批次狀態更新成功");
          setSelectedRowKeys([]);
          fetchOrders();
        } catch {
          message.error("批次狀態更新失敗");
        }
      },
    });
  };

  const columns = [
    { title: "訂單編號", dataIndex: "order_sn", sorter: true },
    { title: "金額", dataIndex: "total_amount", sorter: true },
    {
      title: "狀態",
      dataIndex: "status",
      filters: statusOptions.map((s) => ({ text: s.label, value: s.value })),
      render: (v: string) => {
        const colorMap: any = {
          pending: "orange",
          paid: "blue",
          shipping: "purple",
          completed: "green",
          cancelled: "red",
        };
        return (
          <Tag color={colorMap[v] || "default"}>
            {statusOptions.find((s) => s.value === v)?.label || v}
          </Tag>
        );
      },
    },
    { title: "建立日期", dataIndex: "created_at", sorter: true },
    { title: "備註", dataIndex: "remark" },
    {
      title: "操作",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => navigate(`/orders/${record.id}`)}>
          查看詳情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>訂單列表</h2>
      <Form
        form={form}
        layout="inline"
        onFinish={onSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="status" label="狀態">
          <Select allowClear style={{ width: 120 }}>
            {statusOptions.map((s) => (
              <Option key={s.value} value={s.value}>
                {s.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="日期區間">
          <RangePicker />
        </Form.Item>
        <Form.Item name="keyword" label="關鍵字">
          <Input placeholder="訂單編號/客戶/備註" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查詢
          </Button>
        </Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button
          disabled={!selectedRowKeys.length}
          onClick={() => handleBatchStatus("paid")}
        >
          批次設為已付款
        </Button>
        <Button
          disabled={!selectedRowKeys.length}
          onClick={() => handleBatchStatus("shipping")}
        >
          批次設為配送中
        </Button>
        <Button
          disabled={!selectedRowKeys.length}
          onClick={() => handleBatchStatus("completed")}
        >
          批次設為已完成
        </Button>
        <Button
          disabled={!selectedRowKeys.length}
          onClick={() => handleBatchStatus("cancelled")}
        >
          批次設為已取消
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        onChange={(pagination, filters, sorter: any) => {
          if (sorter && sorter.field) {
            setQuery((q: any) => ({
              ...q,
              sort_by: sorter.field,
              sort_order: sorter.order === "ascend" ? "asc" : "desc",
            }));
          }
        }}
      />
    </div>
  );
};

export default OrderPage;
