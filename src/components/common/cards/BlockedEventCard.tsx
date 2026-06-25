import { Card, Col, Row } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { ChevronRight } from "react-feather";
import ReservationStatusTag from "../tags/ReservationStatusTag";

interface BlockedEventCardProps {
  index: number;
  date?: {
    date: string;
    reason: string;
  }[];
  // owner: { id: number; firstName: string; lastName: string };
  // status: string;
  unitName?: string;
  unitCount?: {
    date: string;
    subUnitDetailsDTOS: [];
  }[];
  // reason: string;
  typeColor: string;
  handleEventDetailsDrawerOpen: () => void;
}

const BlockedEventCard: React.FC<BlockedEventCardProps> = ({
  index,
  date,
  // owner,
  // status,
  unitName,
  unitCount,
  // reason,
  typeColor,
  handleEventDetailsDrawerOpen,
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
      {unitName === "Entire Property" && (
        <Row className="my-1">
          <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
            <h5 className="font-size-5">Blocked Date</h5>
          </Col>
          <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
            <h5 className="font-size-5">
              {date?.map((date: { date: string; reason: string }) => {
                return (
                  <div className="mb-2">
                    {moment(date?.date).format("YYYY.MM.DD")}
                  </div>
                );
              })}
            </h5>
          </Col>
        </Row>
      )}
      <Row className="my-1">
        <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
          <h5 className="font-size-5">
            {unitName != "Entire Property" ? "Room Category" : "Blocked"}
          </h5>
        </Col>
        <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
          <h5 className="font-size-5">{unitName}</h5>
        </Col>
      </Row>
      {unitName != "Entire Property" && (
        <Row className="my-1">
          <Col xs={12} sm={12} md={8} lg={10} xl={8} xxl={6} className="pe-2">
            <h5 className="font-size-5">Room Count</h5>
          </Col>
          <Col xs={12} sm={12} md={16} lg={14} xl={16} xxl={18}>
            <h5 className="font-size-5">
              {unitCount?.map(
                (unit: { date: string; subUnitDetailsDTOS: [] }) => {
                  return (
                    <div className="mb-2">
                      {moment(unit?.date).format("YYYY.MM.DD")} -{" "}
                      {unit?.subUnitDetailsDTOS.length} Rooms
                    </div>
                  );
                }
              )}
            </h5>
          </Col>
        </Row>
      )}

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

export default BlockedEventCard;
