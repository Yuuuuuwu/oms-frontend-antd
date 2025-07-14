///src/pages/Dashboard/index.tsx
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Button, message, Space, Typography } from "antd";
import { Line, Column, Area } from "@ant-design/charts";
import { PlusOutlined, DownloadOutlined, TrendingUpOutlined, BarChartOutlined } from "@ant-design/icons";
import { useThemeLang } from "../../contexts/ThemeLangContext";
import { axiosWithAuth } from "../../utils/axiosWithAuth";

const { Title, Text } = Typography;

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
  // 2. 圖表資料
  const [chartData, setChartData] = useState<{ month: string; value: number; growth?: number }[]>([]);
  // 3. 圖表類型切換
  const [chartType, setChartType] = useState<'column' | 'line' | 'area'>('column');

  useEffect(() => {
    // 取得 dashboard 統計資料
    axiosWithAuth.get<Summary>(`/dashboard/summary`)
      .then((res) => {
        setSummary(res.data);
        // 如果有 monthly_sales 就設定並計算成長率
        if (res.data.monthly_sales && res.data.monthly_sales.length > 0) {
          const processedData = res.data.monthly_sales.map((item, index) => {
            let growth = 0;
            if (index > 0) {
              const prevValue = res.data.monthly_sales![index - 1].value;
              growth = prevValue > 0 ? ((item.value - prevValue) / prevValue * 100) : 0;
            }
            return {
              ...item,
              growth: Math.round(growth * 100) / 100
            };
          });
          setChartData(processedData);
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

      {/* ===== 銷售趨勢圖表 ===== */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card 
            title={
              <Space>
                <TrendingUpOutlined />
                <Title level={4} style={{ margin: 0 }}>月度銷售趨勢</Title>
              </Space>
            }
            extra={
              <Space>
                <Button
                  type={chartType === 'column' ? 'primary' : 'default'}
                  size="small"
                  icon={<BarChartOutlined />}
                  onClick={() => setChartType('column')}
                >
                  柱狀圖
                </Button>
                <Button
                  type={chartType === 'line' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setChartType('line')}
                >
                  折線圖
                </Button>
                <Button
                  type={chartType === 'area' ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setChartType('area')}
                >
                  面積圖
                </Button>
              </Space>
            }
          >
            {chartData.length > 0 ? (
              <>
                {chartType === 'column' && (
                  <Column
                    data={chartData}
                    xField="month"
                    yField="value"
                    height={300}
                    columnStyle={{
                      fill: theme === "dark" ? "#1890ff" : "#177ddc",
                      fillOpacity: 0.8,
                      stroke: theme === "dark" ? "#40a9ff" : "#096dd9",
                      strokeWidth: 1,
                      cursor: 'pointer'
                    }}
                    xAxis={{
                      label: { 
                        style: { fill: theme === "dark" ? "#f7fafc" : "#222", fontSize: 11 },
                        rotate: -30
                      },
                      line: { style: { stroke: theme === "dark" ? "#434343" : "#e8e8e8" } },
                      tickLine: { style: { stroke: theme === "dark" ? "#434343" : "#e8e8e8" } },
                    }}
                    yAxis={{
                      label: { 
                        style: { fill: theme === "dark" ? "#f7fafc" : "#666", fontSize: 11 },
                        formatter: (value) => `$${(value / 1000).toFixed(0)}K`
                      },
                      grid: { 
                        line: { 
                          style: { 
                            stroke: theme === "dark" ? "#303030" : "#f0f0f0", 
                            lineDash: [4, 4] 
                          } 
                        } 
                      },
                    }}
                    tooltip={{
                      formatter: (datum) => ({
                        name: '銷售額',
                        value: `$${datum.value.toLocaleString()}`,
                      }),
                    }}
                    label={{
                      style: {
                        fill: theme === "dark" ? "#fff" : "#000",
                        fontSize: 10,
                        fontWeight: 500,
                      },
                      formatter: (value) => `$${(value / 1000).toFixed(0)}K`
                    }}
                    animation={{
                      appear: {
                        animation: 'wave-in',
                        duration: 1500,
                      },
                    }}
                  />
                )}
                
                {chartType === 'line' && (
                  <Line
                    data={chartData}
                    xField="month"
                    yField="value"
                    height={300}
                    lineStyle={{
                      stroke: theme === "dark" ? "#1890ff" : "#177ddc",
                      lineWidth: 3,
                    }}
                    point={{
                      size: 6,
                      style: {
                        fill: theme === "dark" ? "#1890ff" : "#177ddc",
                        stroke: '#fff',
                        lineWidth: 2,
                      },
                    }}
                    xAxis={{
                      label: { 
                        style: { fill: theme === "dark" ? "#f7fafc" : "#222", fontSize: 11 },
                        rotate: -30
                      },
                      line: { style: { stroke: theme === "dark" ? "#434343" : "#e8e8e8" } },
                    }}
                    yAxis={{
                      label: { 
                        style: { fill: theme === "dark" ? "#f7fafc" : "#666", fontSize: 11 },
                        formatter: (value) => `$${(value / 1000).toFixed(0)}K`
                      },
                      grid: { 
                        line: { 
                          style: { 
                            stroke: theme === "dark" ? "#303030" : "#f0f0f0", 
                            lineDash: [4, 4] 
                          } 
                        } 
                      },
                    }}
                    tooltip={{
                      formatter: (datum) => ({
                        name: '銷售額',
                        value: `$${datum.value.toLocaleString()}`,
                      }),
                    }}
                    animation={{
                      appear: {
                        animation: 'path-in',
                        duration: 2000,
                      },
                    }}
                  />
                )}

                {chartType === 'area' && (
                  <Area
                    data={chartData}
                    xField="month"
                    yField="value"
                    height={300}
                    areaStyle={{
                      fill: `l(270) 0:${theme === "dark" ? "#1890ff" : "#177ddc"} 0.5:${theme === "dark" ? "#40a9ff" : "#69c0ff"} 1:#ffffff`,
                      fillOpacity: 0.6,
                    }}
                    line={{
                      style: {
                        stroke: theme === "dark" ? "#1890ff" : "#177ddc",
                        lineWidth: 2,
                      },
                    }}
                    xAxis={{
                      label: { 
                        style: { fill: theme === "dark" ? "#f7fafc" : "#222", fontSize: 11 },
                        rotate: -30
                      },
                      line: { style: { stroke: theme === "dark" ? "#434343" : "#e8e8e8" } },
                    }}
                    yAxis={{
                      label: { 
                        style: { fill: theme === "dark" ? "#f7fafc" : "#666", fontSize: 11 },
                        formatter: (value) => `$${(value / 1000).toFixed(0)}K`
                      },
                      grid: { 
                        line: { 
                          style: { 
                            stroke: theme === "dark" ? "#303030" : "#f0f0f0", 
                            lineDash: [4, 4] 
                          } 
                        } 
                      },
                    }}
                    tooltip={{
                      formatter: (datum) => ({
                        name: '銷售額',
                        value: `$${datum.value.toLocaleString()}`,
                      }),
                    }}
                    animation={{
                      appear: {
                        animation: 'wave-in',
                        duration: 2000,
                      },
                    }}
                  />
                )}
              </>
            ) : (
              <div style={{ 
                textAlign: "center", 
                color: theme === "dark" ? "#8c8c8c" : "#aaa", 
                padding: 48,
                background: theme === "dark" ? "#1f1f1f" : "#fafafa",
                borderRadius: 8,
                border: `1px dashed ${theme === "dark" ? "#434343" : "#d9d9d9"}`
              }}>
                <TrendingUpOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                <div>暫無銷售數據</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  數據載入中或暫無銷售記錄
                </Text>
              </div>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                <Title level={4} style={{ margin: 0 }}>數據洞察</Title>
              </Space>
            }
          >
            {summary === null ? (
              <div style={{ 
                textAlign: "center", 
                color: theme === "dark" ? "#8c8c8c" : "#aaa", 
                padding: 48,
                background: theme === "dark" ? "#1f1f1f" : "#fafafa",
                borderRadius: 8,
                border: `1px dashed ${theme === "dark" ? "#434343" : "#d9d9d9"}`
              }}>
                <BarChartOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                <div>暫無數據</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  數據載入中或暫無統計記錄
                </Text>
              </div>
            ) : (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 基本統計 */}
                <div>
                  <Title level={5} style={{ marginBottom: 12, color: theme === "dark" ? "#f7fafc" : "#333" }}>
                    📈 基本統計
                  </Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary">總營收</Text>
                      <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                        ${summary.total_sales.toLocaleString()}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary">訂單數量</Text>
                      <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                        {summary.order_count}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary">客戶數量</Text>
                      <Text strong style={{ color: '#722ed1', fontSize: 16 }}>
                        {summary.customer_count}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary">平均訂單</Text>
                      <Text strong style={{ color: '#fa8c16', fontSize: 16 }}>
                        ${summary.order_count > 0 ? Math.round(summary.total_sales / summary.order_count).toLocaleString() : '0'}
                      </Text>
                    </div>
                  </Space>
                </div>

                {/* 趨勢分析 */}
                {chartData.length > 1 && (
                  <div>
                    <Title level={5} style={{ marginBottom: 12, color: theme === "dark" ? "#f7fafc" : "#333" }}>
                      📊 趨勢分析
                    </Title>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">最高月份</Text>
                        <Text strong style={{ color: '#52c41a' }}>
                          {chartData.reduce((max, curr) => curr.value > max.value ? curr : max).month}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">最高銷售</Text>
                        <Text strong style={{ color: '#52c41a' }}>
                          ${Math.max(...chartData.map(d => d.value)).toLocaleString()}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">平均月銷售</Text>
                        <Text strong style={{ color: '#1890ff' }}>
                          ${Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toLocaleString()}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">總趨勢</Text>
                        <Text strong style={{ 
                          color: chartData[chartData.length - 1]?.value > chartData[0]?.value ? '#52c41a' : '#ff4d4f' 
                        }}>
                          {chartData[chartData.length - 1]?.value > chartData[0]?.value ? '📈 上升' : '📉 下降'}
                        </Text>
                      </div>
                    </Space>
                  </div>
                )}

                {/* 快速操作 */}
                <div>
                  <Title level={5} style={{ marginBottom: 12, color: theme === "dark" ? "#f7fafc" : "#333" }}>
                    ⚡ 快速操作
                  </Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Button 
                      type="link" 
                      size="small" 
                      style={{ padding: 0, height: 'auto', color: '#1890ff' }}
                      href="/orders"
                    >
                      查看所有訂單 →
                    </Button>
                    <Button 
                      type="link" 
                      size="small" 
                      style={{ padding: 0, height: 'auto', color: '#1890ff' }}
                      href="/customers"
                    >
                      管理客戶資料 →
                    </Button>
                    <Button 
                      type="link" 
                      size="small" 
                      style={{ padding: 0, height: 'auto', color: '#1890ff' }}
                      href="/reports"
                    >
                      詳細銷售報表 →
                    </Button>
                  </Space>
                </div>
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
