import { Card, Col, Row } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { ChevronRight } from "react-feather";
import ReservationStatusTag from "../tags/ReservationStatusTag";
import defaultProfileImg from "../../../assets/images/profileDefaultImg.jpg";
import { CurrencyEnum } from "../../../common/enums/currencyEnum";
import IalIcon from "../../../assets/images/icon/icalIcon.png";

interface ICalReservationEventCardProps {
  index: number;
  checkInDate: string;
  checkOutDate: string;
  platform: string;
  typeColor: string;
}

const ICalReservationEventCard: React.FC<ICalReservationEventCardProps> = ({
  index,
  checkInDate,
  checkOutDate,
  platform,
  typeColor,
}) => {
  const [name, setName] = useState<string>("");

  return (
    <Card
      key={index}
      hoverable
      bordered={false}
      className="my-2"
      style={{ borderBottom: `4px solid ${typeColor}` }}
    >
      <div className="d-flex align-items-center mb-3">
        <img src={IalIcon} height={20} width={20} className="me-2" />
        <h6 className="font-size-5 primary-color m-0">
          ICal Reservation
        </h6>
      </div>
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Check In Date</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">
            {moment(checkInDate).format("YYYY.MM.DD")}
          </h5>
        </Col>
      </Row>
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Check Out Date</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">
            {moment(checkOutDate).format("YYYY.MM.DD")}
          </h5>
        </Col>
      </Row>

      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5"> Platform</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">{platform}</h5>
        </Col>
      </Row>
    </Card>
  );
};

export default ICalReservationEventCard;
