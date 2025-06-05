import React from "react";
import { Card, Col, Row, Statistic, Button, List, Tag, Alert } from "antd";
import { Bar } from "@ant-design/charts";
import {
  PlusOutlined,
  DownloadOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useThemeLang } from "../../contexts/ThemeLangContext";

const Dashboard: React.FC = () => {
  const { theme } = useThemeLang();

  // 月度銷售額假資料
  const barData = [
    { month: "1月", value: 400 },
    { month: "2月", value: 600 },
    { month: "3月", value: 800 },
    { month: "4月", value: 500 },
    { month: "5月", value: 950 },
    { month: "6月", value: 700 },
  ];
  const todoList = [
    { id: 1, content: "追蹤客戶回覆" },
    { id: 2, content: "確認昨日訂單出貨" },
    { id: 3, content: "每月報表上傳" },
  ];
  const announcement = "本月營業額已超越去年同期，感謝各部門同仁！";
  const loginRecords = [
    { time: "2025-06-05 09:01", ip: "192.168.1.1", location: "台北" },
    { time: "2025-06-04 20:15", ip: "192.168.1.2", location: "台中" },
  ];
  const topEmployees = [
    { name: "王大明", sales: 123000 },
    { name: "李小美", sales: 112000 },
  ];
  const topCustomers = [
    { name: "順發科技", orders: 58 },
    { name: "宏達電子", orders: 42 },
  ];

  return (
    <div>
      {/* 快速操作區 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            新增訂單
          </Button>
        </Col>
        <Col>
          <Button icon={<DownloadOutlined />}>下載報表</Button>
        </Col>
      </Row>
      {/* 數據卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="總銷售額" value={126560} prefix="￥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="訂單數" value={8846} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="客戶數" value={650} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="轉換率" value={78} suffix="%" />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="月度銷售額">
            <Bar
              data={barData}
              xField="value"
              yField="month"
              color="#1890ff"
              height={260}
              xAxis={{
                label: {
                  style: {
                    fill: theme === "dark" ? "#f7fafc" : "#222", // 更亮
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
                    fill: theme === "dark" ? "#f7fafc" : "#222", // 更亮
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
          </Card>
          <Card title="待辦事項" style={{ marginTop: 24 }}>
            <List
              dataSource={todoList}
              renderItem={(item) => (
                <List.Item>
                  <Tag color="blue">待辦</Tag>
                  {item.content}
                </List.Item>
              )}
            />
          </Card>
          <Card title="公告區" style={{ marginTop: 24 }}>
            <Alert message={announcement} type="success" showIcon />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="最近登入紀錄">
            <List
              dataSource={loginRecords}
              renderItem={(item) => (
                <List.Item>
                  <UserOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                  {item.time} / {item.location} / {item.ip}
                </List.Item>
              )}
            />
          </Card>
          <Card title="本月最佳員工" style={{ marginTop: 24 }}>
            <List
              dataSource={topEmployees}
              renderItem={(item) => (
                <List.Item>
                  <CrownOutlined style={{ color: "#faad14", marginRight: 8 }} />
                  {item.name}（業績￥{item.sales}）
                </List.Item>
              )}
            />
          </Card>
          <Card title="本月最佳客戶" style={{ marginTop: 24 }}>
            <List
              dataSource={topCustomers}
              renderItem={(item) => (
                <List.Item>
                  <CrownOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                  {item.name}（訂單數：{item.orders}）
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
