import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { Result, Button } from 'antd';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/dashboard'
}) => {
  const user = getCurrentUser();

  // 如果沒有登入，重導向到登入頁
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 如果沒有權限，顯示無權限頁面
  if (!allowedRoles.includes(user.role)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您沒有權限存取此頁面"
        extra={
          <Button type="primary" onClick={() => window.location.href = fallbackPath}>
            返回首頁
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;