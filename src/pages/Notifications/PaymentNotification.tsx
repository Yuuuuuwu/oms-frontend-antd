import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { axiosWithAuth } from '../../utils/axiosWithAuth';

const PaymentNotification: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true);
      try {
        const response = await axiosWithAuth.post('/payments/ecpay/callback');
        if (response.data === '1|OK') {
          notification.success({
            message: '付款成功',
            description: '您的付款已成功完成。',
          });
        } else {
          notification.error({
            message: '付款失敗',
            description: '付款未成功，請稍後再試。',
          });
        }
      } catch (error) {
        console.error('接收付款通知失敗', error);
        notification.error({
          message: '錯誤',
          description: '無法接收付款通知，請檢查網路連線。',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, []);

  return (
    <div>
      <h1>付款通知</h1>
      {loading ? <p>正在加載...</p> : <p>通知已處理。</p>}
    </div>
  );
};

export default PaymentNotification;