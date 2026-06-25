import React from "react";
import { Card } from "antd";

interface DashboardCardProps {
  label: string;
  value: string | React.ReactNode;
  trend: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  iconBgColor?: string;
  iconColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  label, 
  value, 
  trend, 
  icon, 
  onClick,
  iconBgColor = "#f0f2f5",
  iconColor = "#082942"
}) => {
  return (
    <Card
      className={`dashboard-summary-card h-100 ${onClick ? "cursor-pointer" : ""}`}
      bordered={false}
      styles={{ body: { padding: "18px 20px" } }}
      onClick={onClick}
      hoverable={!!onClick}
    >
      <div className="d-flex align-items-center justify-content-between mb-1">
        <p className="font-size-5 font-weight-medium text-gray mb-0">{label}</p>
        {icon && (
          <div 
            className="d-flex align-items-center justify-content-center" 
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: "50%", 
              backgroundColor: iconBgColor,
              color: iconColor,
              fontSize: "18px"
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <h3 className="font-size-2 font-weight-semi-bold secondary-color mb-1">{value}</h3>
      <p className="font-size-5 font-weight-normal text-gray-secondary mb-0">{trend}</p>
    </Card>
  );
};

export default DashboardCard;
