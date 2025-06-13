import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { Bar } from "@ant-design/charts";

const fakeSummary = {
  total_sales: 8800,
  order_count: 12,
  customer_count: 5,
  conversion_rate: 78,
};
const fakeBarData = [
  { month: "2025-01", value: 1200 },
  { month: "2025-02", value: 1500 },
  { month: "2025-03", value: 1800 },
  { month: "2025-04", value: 2100 },
  { month: "2025-05", value: 2200 },
];

const FakeDashboard: React.FC = () => (
  <div>
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card>
          <Statistic title="總銷售額" value={fakeSummary.total_sales} prefix="￥" />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="訂單數" value={fakeSummary.order_count} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="客戶數" value={fakeSummary.customer_count} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="轉換率" value={fakeSummary.conversion_rate} suffix="%" />
        </Card>
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 24 }}>
      <Col span={16}>
        <Card title="月度銷售額">
          <Bar
            data={fakeBarData}
            xField="value"
            yField="month"
            color="#1890ff"
            height={260}
            xAxis={{
              label: { style: { fill: "#222", fontWeight: 600 } },
              line: { style: { stroke: "#ccc", lineWidth: 1.5 } },
              tickLine: { style: { stroke: "#ccc", lineWidth: 1.5 } },
              grid: { line: { style: { stroke: "#eee", lineDash: [4, 4] } } },
            }}
            yAxis={{
              label: { style: { fill: "#222", fontWeight: 600 } },
              line: { style: { stroke: "#ccc", lineWidth: 1.5 } },
              tickLine: { style: { stroke: "#ccc", lineWidth: 1.5 } },
              grid: { line: { style: { stroke: "#eee", lineDash: [4, 4] } } },
            }}
            label={{ style: { fill: "#222", fontWeight: 600 } }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="數據預覽（假資料展示）">
          <ul style={{ paddingLeft: 16 }}>
            <li>本月新訂單：<b>12</b></li>
            <li>本月新客戶：<b>5</b></li>
            <li>本月營收：<b>￥8,800</b></li>
            <li>本月活躍用戶：<b>21</b></li>
          </ul>
          <div style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>
            * 實際數據將於串接後端後自動顯示
          </div>
        </Card>
      </Col>
    </Row>
  </div>
);

export default FakeDashboard;
