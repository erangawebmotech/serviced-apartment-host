import { Card, Col, Row } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { ChevronRight } from "react-feather";
import ReservationStatusTag from "../tags/ReservationStatusTag";
import defaultProfileImg from "../../../assets/images/profileDefaultImg.jpg";
import { CurrencyEnum } from "../../../common/enums/currencyEnum";

interface ReservationEventCardProps {
  index: number;
  reservationNumber: string;
  checkInDate: string;
  checkOutDate: string;
  reservationOwner: {
    id: number;
    firstName: string;
    lastName: string;
    file: {
      smallPath: string;
    };
  };
  status: string;
  specialRequest: string;
  totalAmount: number;
  typeColor: string;
  isOnlyPropertyOwner: boolean,
  handleEventDetailsDrawerOpen: () => void;
}

const ReservationEventCard: React.FC<ReservationEventCardProps> = ({
  index,
  reservationNumber,
  checkInDate,
  checkOutDate,
  reservationOwner,
  status,
  specialRequest,
  totalAmount,
  isOnlyPropertyOwner,
  typeColor,
  handleEventDetailsDrawerOpen,
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
      <h6 className="font-size-5 primary-color mb-3">
        Res. Number : {reservationNumber}
      </h6>
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
      {!isOnlyPropertyOwner && <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Account Holder</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">
            {" "}
            <img
              src={
                reservationOwner?.file?.smallPath
                  ? reservationOwner?.file?.smallPath
                  : defaultProfileImg
              }
              alt="cusImg"
              height={30}
              width={30}
              style={{ objectFit: "cover" }}
              className="me-2 rounded-5"
            />
            {`${reservationOwner?.firstName ?? ""} ${reservationOwner?.lastName ?? ""}`.trim()}
          </h5>
        </Col>
      </Row>}
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Status</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <ReservationStatusTag reservationStatus={status} />
        </Col>
      </Row>
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5"> Special Request</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">{specialRequest}</h5>
        </Col>
      </Row>
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5"> Total Amount</h5>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={16}
          lg={14}
          xl={16}
          xxl={18}
          className="d-flex align-items-center"
        >
          <h5 className="font-size-4 secondary-color">
            {CurrencyEnum.USD}{" "}
            {totalAmount.toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </h5>
        </Col>
      </Row>
      <Row className="d-flex justify-content-end">
        <h5
          className="font-size-5 primary-color m-0"
          onClick={() => {
            handleEventDetailsDrawerOpen();
          }}
        >
          See more <ChevronRight size={14} />
        </h5>
      </Row>
    </Card>
  );
};

export default ReservationEventCard;
