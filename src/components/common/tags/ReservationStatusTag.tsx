import { Tag } from "antd";
import React from "react";
import { ReactNode } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  ReloadOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { ReservationStatusEnum } from "../../../common/enums/reservationStatusEnum";
import { formatNamesCmnFun } from "../../../common/commonFunctions";

interface ReservationStatusTagProps {
  reservationStatus: string;
  icon?: ReactNode;
}

const ReservationStatusTag: React.FC<ReservationStatusTagProps> = ({
  reservationStatus,
  icon,
}) => {
  const getColor = () => {
    switch (reservationStatus) {
      case ReservationStatusEnum.PENDING:
        return "blue";
      case ReservationStatusEnum.APPROVED:
        return "green";
      case ReservationStatusEnum.CANCELLED:
        return "orange";
      case ReservationStatusEnum.REJECTED:
        return "red";
      case ReservationStatusEnum.CANCELLED_BY_GUEST:
        return "orange";
      case ReservationStatusEnum.CANCELLED_BY_HOST:
        return "orange";
      case ReservationStatusEnum.CHECKED_IN:
        return "cyan";
      case ReservationStatusEnum.CHECKED_OUT:
        return "purple";
      case ReservationStatusEnum.NO_SHOW:
        return "warning";
      default:
        return "default";
    }
  };

  const getDefaultIcon = () => {
    switch (reservationStatus) {
      case ReservationStatusEnum.PENDING:
        return <ReloadOutlined />;
      case ReservationStatusEnum.APPROVED:
        return <CheckCircleOutlined />;
      case ReservationStatusEnum.CANCELLED:
        return <CloseCircleOutlined />;
      case ReservationStatusEnum.REJECTED:
        return <StopOutlined />;
      case ReservationStatusEnum.CANCELLED_BY_GUEST:
        return <CloseCircleOutlined />;
      case ReservationStatusEnum.CANCELLED_BY_HOST:
        return <CloseCircleOutlined />;
      case ReservationStatusEnum.CHECKED_IN:
        return <LoginOutlined />;
      case ReservationStatusEnum.CHECKED_OUT:
        return <LogoutOutlined />;
      case ReservationStatusEnum.NO_SHOW:
        return <InfoCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <Tag color={getColor()} icon={icon ?? getDefaultIcon()}>
      {reservationStatus?.replace(/_/g, " ")
        .toUpperCase()}
    </Tag>
  );
};

export default ReservationStatusTag;
