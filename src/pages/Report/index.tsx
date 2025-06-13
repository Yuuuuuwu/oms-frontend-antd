import React, { useEffect, useState } from "react";
import { Card, Table, Button, DatePicker, message } from "antd";
import { fetchOrderStats, fetchProductRank, exportReportCSV } from "../../api/reports";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ReportPage: React.FC = () => {
  const [orderStats, setOrderStats] = useState([]);
  const [productRank, setProductRank] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);

  const loadOrderStats = async () => {
    setLoading(true);
    try {
      const params = dateRange
        ? { date_start: dayjs(dateRange[0]).format("YYYY-MM-DD"), date_end: dayjs(dateRange[1]).format("YYYY-MM-DD") }
        : {};
      const res = await fetchOrderStats(params);
      setOrderStats(res.data || res);
    } catch (e) {
      message.error("載入訂單統計失敗");
    }
    setLoading(false);
  };

  const loadProductRank = async () => {
    setLoading(true);
    try {
      const params = dateRange
        ? { date_start: dayjs(dateRange[0]).format("YYYY-MM-DD"), date_end: dayjs(dateRange[1]).format("YYYY-MM-DD") }
        : {};
      const res = await fetchProductRank(params);
      setProductRank(res.data || res);
    } catch (e) {
      message.error("載入商品排行失敗");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrderStats();
    loadProductRank();
    // eslint-disable-next-line
  }, [dateRange]);

  const handleExport = async (type: string) => {
    try {
      const params = dateRange
        ? { date_start: dayjs(dateRange[0]).format("YYYY-MM-DD"), date_end: dayjs(dateRange[1]).format("YYYY-MM-DD") }
        : {};
      const blob = await exportReportCSV(type, params);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      message.error("匯出失敗");
    }
  };

  return (
    <div>
      <Card title="報表統計" style={{ marginBottom: 24 }}>
        <RangePicker onChange={setDateRange} />
        <Button onClick={() => handleExport("order_stats")} style={{ marginLeft: 8 }}>
          匯出訂單統計 CSV
        </Button>
        <Button onClick={() => handleExport("product_rank")} style={{ marginLeft: 8 }}>
          匯出商品排行 CSV
        </Button>
      </Card>
      <Card title="訂單金額統計" style={{ marginBottom: 24 }}>
        <Table
          columns={[
            { title: "日期", dataIndex: "date" },
            { title: "訂單數", dataIndex: "order_count" },
            { title: "總金額", dataIndex: "total_amount" },
          ]}
          dataSource={orderStats}
          rowKey="date"
          loading={loading}
          pagination={false}
        />
      </Card>
      <Card title="商品銷售排行">
        <Table
          columns={[
            { title: "商品名稱", dataIndex: "product_name" },
            { title: "銷售數量", dataIndex: "total_qty" },
            { title: "銷售金額", dataIndex: "total_amount" },
          ]}
          dataSource={productRank}
          rowKey="product_id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ReportPage;
