import React from "react";
import { Card, Descriptions } from "antd";
import { getCurrentUser } from "../../utils/auth";

const Profile: React.FC = () => {
  const user = getCurrentUser();
  if (!user) return null;
  return (
    <Card title="個人資料">
      <Descriptions>
        <Descriptions.Item label="帳號">{user.username}</Descriptions.Item>
        <Descriptions.Item label="角色">{user.role}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Profile;
