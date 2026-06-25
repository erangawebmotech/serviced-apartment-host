import React from "react";
import { Card } from "antd";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  children,
  extra,
}) => {
  return (
    <Card
      className="dashboard-section-card h-100"
      bordered={false}
      title={<span className="font-size-4 font-weight-semi-bold secondary-color">{title}</span>}
      extra={extra}
      styles={{ body: { padding: "18px 20px" } }}
    >
      {children}
    </Card>
  );
};

export default DashboardSection;
