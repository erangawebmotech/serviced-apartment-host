import { Card, Col, Row } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { ChevronRight } from "react-feather";
import ReservationStatusTag from "../tags/ReservationStatusTag";

interface MaintenanceEventCardProps {
  index: number;
  date: string;
  // owner: { id: number; firstName: string; lastName: string };
  // status: string;
  unitName?: string;
  reason: string;
  typeColor: string;
  // handleEventDetailsDrawerOpen: () => void;
}

const 
MaintenanceEventCard: React.FC<
  
MaintenanceEventCardProps
> = ({
  index,
  date,
  // owner,
  // status,
  unitName,
  reason,
  typeColor,
  // handleEventDetailsDrawerOpen,
}) => {
  const [name, setName] = useState<string>("");

  return (
    <Card
      key={index}
      hoverable
      className="my-2"
      bordered={false}
      style={{ borderBottom: `4px solid ${typeColor}` }}
    >
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Blocked Date</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">
            {moment(date).format("YYYY.MM.DD")}
          </h5>
        </Col>
      </Row>
      {/* <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Action Owner</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">
            {" "}
            {owner.firstName + " " + owner.lastName}
          </h5>
        </Col>
      </Row> */}
      {/* <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Status</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          {status}
        </Col>
      </Row> */}
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Unit</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">{unitName}</h5>
        </Col>
      </Row>
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">Reason</h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">{reason}</h5>
        </Col>
      </Row>
      {/* <Row className="d-flex justify-content-end">
        <h5
          className="font-size-5 primary-color m-0"
          onClick={() => {
            handleEventDetailsDrawerOpen();
          }}
        >
          See more <ChevronRight size={14} />
        </h5>
      </Row> */}
    </Card>
  );
};

export default 
MaintenanceEventCard;
