import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notification, Spin, Button } from "antd";
import axios from "axios";

interface Order {
  id: number;
  order_sn: string;
  status: "pending" | "paid" | "cancelled" | string;
}

const PaymentResult: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 讀取真正的 MerchantTradeNo
    const mtn = searchParams.get("MerchantTradeNo");
    if (!mtn) {
      notification.error({ message: "錯誤", description: "找不到訂單編號" });
      setLoading(false);
      return;
    }

    // 2. 解析出數字 ID
    const orderId = parseInt(mtn.replace(/^OMS/, ""), 10);
    if (isNaN(orderId)) {
      notification.error({ message: "錯誤", description: "訂單編號格式錯誤" });
      setLoading(false);
      return;
    }
    // 3. 呼叫後端取得訂單
    axios
      .get<Order>(`/api/orders/${orderId}`)
      .then((res) => {
        const ord = res.data;
        setOrder(ord);

        // 4. 根據狀態顯示通知
        switch (ord.status) {
          case "paid":
            notification.success({
              message: "付款成功",
              description: `訂單 ${ord.order_sn} 已付款成功！`,
            });
            break;
          case "pending":
            notification.warning({
              message: "尚未付款",
              description: `訂單 ${ord.order_sn} 尚未完成付款，請稍後重試或聯絡客服。`,
            });
            break;
          default:
            notification.error({
              message: "付款異常",
              description: `訂單 ${ord.order_sn} 狀態為 ${ord.status}，請聯絡客服。`,
            });
        }
      })
      .catch(() => {
        notification.error({
          message: "錯誤",
          description: "無法查詢訂單狀態，請稍後再試。",
        });
      })
      .finally(() => {
        setLoading(false);
        // 5. 3 秒後自動跳回訂單列表
        setTimeout(() => navigate("/orders"), 3000);
      });
  }, [navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>付款結果</h2>
      {loading ? (
        <Spin tip="正在加載訂單資訊..." />
      ) : (
        <>
          {order ? (
            <p>
              {order.status === "paid"
                ? "感謝您的付款，系統將於 3 秒後自動回到訂單列表。"
                : "系統處理完成，您可點擊下方按鈕返回訂單列表。"}
            </p>
          ) : (
            <p>處理完成。</p>
          )}
          <Button type="primary" onClick={() => navigate("/orders")}>
            返回訂單列表
          </Button>
        </>
      )}
    </div>
  );
};

export default PaymentResult;
