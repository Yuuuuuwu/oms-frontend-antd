///src/pages/Dashboard/index.tsx
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Button, message } from "antd";
import { Bar } from "@ant-design/charts";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { useThemeLang } from "../../contexts/ThemeLangContext";
import { axiosWithAuth } from "../../utils/axiosWithAuth";

interface Summary {
  total_sales: number;
  order_count: number;
  customer_count: number;
  monthly_sales?: { month: string; value: number }[];
}

const Dashboard: React.FC = () => {
  const { theme } = useThemeLang();

  // 1. Summary 狀態，初始為 null 表示還沒取到／或失敗
  const [summary, setSummary] = useState<Summary | null>(null);
  // 2. 長條圖資料
  const [barData, setBarData] = useState<{ month: string; value: number }[]>([]);

  useEffect(() => {
    // 取得 dashboard 統計資料
    axiosWithAuth.get<Summary>(`/dashboard/summary`)
      .then((res) => {
        setSummary(res.data);
        // 如果有 monthly_sales 就設定
        if (res.data.monthly_sales) {
          setBarData(res.data.monthly_sales);
        }
      })
      .catch((err) => {
        message.error("載入統計資料失敗");
        setSummary(null);
      });
  }, []);

  return (
    <div>
      {/* ===== 快速操作區 ===== */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} href="/order/create">
            新增訂單
          </Button>
        </Col>
        <Col>
          <Button icon={<DownloadOutlined />}>下載報表</Button>
        </Col>
      </Row>

      {/* ===== 數據卡片 ===== */}
      <Row gutter={16}>
        {summary === null ? (
          // 資料還沒讀到或失敗
          <Col span={24}>
            <Card>
              <Statistic title="暫無數據" value={0} />
            </Card>
          </Col>
        ) : (
          <>
            <Col span={6}>
              <Card>
                <Statistic
                  title="總銷售額"
                  value={summary.total_sales}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="訂單數" value={summary.order_count} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="客戶數" value={summary.customer_count} />
              </Card>
            </Col>
            {/* 如果還有其他欄位再放 */}
          </>
        )}
      </Row>

      {/* ===== 長條圖＆預覽統計 ===== */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="月度銷售額">
            {barData.length > 0 ? (
              <Bar
                data={barData}
                xField="month"
                yField="value"
                height={260}
                xAxis={{
                  label: { 
                    style: { fill: theme === "dark" ? "#f7fafc" : "#222", fontWeight: 600 },
                    rotate: -45 // 傾斜月份標籤避免重疊
                  },
                  line: { style: { stroke: theme === "dark" ? "#555" : "#ccc", lineWidth: 1.5 } },
                  tickLine: { style: { stroke: theme === "dark" ? "#555" : "#ccc", lineWidth: 1.5 } },
                }}
                yAxis={{
                  label: { 
                    style: { fill: theme === "dark" ? "#f7fafc" : "#222", fontWeight: 600 }
                  },
                  line: { style: { stroke: theme === "dark" ? "#555" : "#ccc", lineWidth: 1.5 } },
                  tickLine: { style: { stroke: theme === "dark" ? "#555" : "#ccc", lineWidth: 1.5 } },
                  grid: { line: { style: { stroke: theme === "dark" ? "#31343f" : "#eee", lineDash: [4,4] } } },
                }}
                label={{ 
                  style: { fill: theme === "dark" ? "#f7fafc" : "#222", fontWeight: 600 },
                  formatter: (value) => `$${value.toLocaleString()}` // 格式化金額顯示
                }}
                color="#177ddc"
              />
            ) : (
              <div style={{ textAlign: "center", color: "#aaa", padding: 48 }}>
                暫無數據
              </div>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="數據預覽">
            {summary === null ? (
              <div style={{ textAlign: "center", color: "#aaa", padding: 48 }}>
                暫無數據
              </div>
            ) : (
              <ul style={{ paddingLeft: 16 }}>
                <li>本月新訂單：<b>{summary.order_count}</b></li>
                <li>本月新客戶：<b>{summary.customer_count}</b></li>
                <li>本月營收：<b>${summary.total_sales.toLocaleString()}</b></li>
                <li>平均訂單金額：<b>${summary.order_count > 0 ? (summary.total_sales / summary.order_count).toLocaleString() : '0'}</b></li>
                {/* 若後端有其他欄位就再加上去 */}
              </ul>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
