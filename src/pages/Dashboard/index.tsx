import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Button } from "antd";
import { Bar } from "@ant-design/charts";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { useThemeLang } from "../../contexts/ThemeLangContext";
import { axiosWithAuth } from "../../utils/axiosWithAuth";
import { BACKEND_URL } from "../../utils/env";

const Dashboard: React.FC = () => {
  const { theme } = useThemeLang();
  const [summary, setSummary] = useState<null | {
    total_sales: number;
    order_count: number;
    customer_count: number;
  }>(null);
  const [barData, setBarData] = useState<any[]>([]);

  useEffect(() => {
    // 取得 dashboard 統計資料
    axiosWithAuth.get(`${BACKEND_URL}/dashboard/summary`)
      .then((res) => {
        const data = res.data;
        setSummary(data);
        if (data.monthly_sales) setBarData(data.monthly_sales);
      })
      .catch(() => setSummary(null)); // 失敗時 summary 設為 null
  }, []);

  return (
    <div>
      {/* 快速操作區 */}
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
      {/* 數據卡片 */}
      <Row gutter={16}>
        {summary === null ? (
          <Col span={24}>[
            <Card key="empty">
              <Statistic title="暫無數據" value={0} />
            </Card>
          ]</Col>
        ) : (
          <>
            <Col span={6}>[
              <Card key="total_sales">
                <Statistic
                  title="總銷售額"
                  value={summary.total_sales}
                  prefix="￥"
                />
              </Card>
            ]</Col>
            <Col span={6}>[
              <Card key="order_count">
                <Statistic title="訂單數" value={summary.order_count} />
              </Card>
            ]</Col>
            <Col span={6}>[
              <Card key="customer_count">
                <Statistic title="客戶數" value={summary.customer_count} />
              </Card>
            ]</Col>
            <Col span={6}>[
              <Card key="conversion">
                <Statistic title="轉換率" value={78} suffix="%" />
              </Card>
            ]</Col>
          </>
        )}
      </Row>
      {/* 假資料區塊：展示有數據時的樣貌 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>[
          <Card key="bar" title="月度銷售額">
            {barData.length ? (
              <Bar
                data={barData}
                xField="value"
                yField="month"
                color="#1890ff"
                height={260}
                xAxis={{
                  label: {
                    style: {
                      fill: theme === "dark" ? "#f7fafc" : "#222",
                      fontWeight: 600,
                    },
                  },
                  line: {
                    style: {
                      stroke: theme === "dark" ? "#555" : "#ccc",
                      lineWidth: 1.5,
                    },
                  },
                  tickLine: {
                    style: {
                      stroke: theme === "dark" ? "#555" : "#ccc",
                      lineWidth: 1.5,
                    },
                  },
                  grid: {
                    line: {
                      style: {
                        stroke: theme === "dark" ? "#31343f" : "#eee",
                        lineDash: [4, 4],
                      },
                    },
                  },
                }}
                yAxis={{
                  label: {
                    style: {
                      fill: theme === "dark" ? "#f7fafc" : "#222",
                      fontWeight: 600,
                    },
                  },
                  line: {
                    style: {
                      stroke: theme === "dark" ? "#555" : "#ccc",
                      lineWidth: 1.5,
                    },
                  },
                  tickLine: {
                    style: {
                      stroke: theme === "dark" ? "#555" : "#ccc",
                      lineWidth: 1.5,
                    },
                  },
                  grid: {
                    line: {
                      style: {
                        stroke: theme === "dark" ? "#31343f" : "#eee",
                        lineDash: [4, 4],
                      },
                    },
                  },
                }}
                label={{
                  style: {
                    fill: theme === "dark" ? "#f7fafc" : "#222",
                    fontWeight: 600,
                  },
                }}
              />
            ) : (
              <div style={{ textAlign: "center", color: "#aaa", padding: 48 }}>
                暫無數據
              </div>
            )}
          </Card>
        ]</Col>
        <Col span={8}>[
          <Card key="preview" title="數據預覽（假資料展示）">
            <ul style={{ paddingLeft: 16 }}>
              <li>
                本月新訂單：<b>12</b>
              </li>
              <li>
                本月新客戶：<b>5</b>
              </li>
              <li>
                本月營收：<b>￥8,800</b>
              </li>
              <li>
                本月活躍用戶：<b>21</b>
              </li>
            </ul>
            <div
              style={{
                color: "#aaa",
                fontSize: 12,
                marginTop: 8,
              }}
            >
              * 實際數據將於串接後端後自動顯示
            </div>
          </Card>
        ]</Col>
      </Row>
    </div>
  );
};

export default Dashboard;
