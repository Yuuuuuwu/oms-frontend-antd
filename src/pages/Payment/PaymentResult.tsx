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
    // 1. 讀取 RtnCode（綠界回傳交易結果）
    const rtnCode = searchParams.get("RtnCode");
    if (!rtnCode) {
      notification.error({
        message: "錯誤",
        description: "找不到交易結果代碼 (RtnCode)",
      });
      setLoading(false);
      return;
    }

    // 2. 判断交易是否成功
    const paid = rtnCode === "1";
    if (paid) {
      notification.success({
        message: "付款成功",
        description: "感謝您的付款，我們正在為您更新訂單狀態。",
      });
    } else {
      notification.error({
        message: "付款失敗",
        description: `交易結果代碼：${rtnCode}，請稍後聯絡客服或重試。`,
      });
    }

    // 3. 讀取 order_sn
    const orderSn = searchParams.get("order_sn");
    if (!orderSn) {
      notification.error({
        message: "錯誤",
        description: "找不到訂單編號 (order_sn)",
      });
      setLoading(false);
      return;
    }

    // 4. 向後端以 order_sn 查訂單資料
    axios
      .get<Order>(`/api/orders/sn/${orderSn}`)
      .then((res) => {
        setOrder(res.data);
        // 5. 三秒後自動跳回訂單詳情
        setTimeout(() => {
          setLoading(true); // 顯示切換提示
          navigate(`/orders/${res.data.id}`);
        }, 3000);
      })
      .catch(() => {
        notification.error({
          message: "錯誤",
          description: "無法查詢訂單狀態，請稍後再試。",
        });
        // 5. 三秒後自動跳回訂單列表
        setTimeout(() => navigate("/orders"), 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>付款結果</h2>
      {loading ? (
        <Spin tip={order ? "正在切換至訂單詳情中，請稍後..." : "正在加載訂單資訊..."} />
      ) : (
        <>
          {order ? (
            <p>
              {order.status === "paid"
                ? "系統已確認付款，將於 3 秒後自動前往訂單詳情。"
                : "系統處理完成，您可點擊下方按鈕手動返回訂單列表。"}
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
