import { Button, Card, Col, Popover, Row, Tag } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { ChevronRight, Eye, Info, MoreVertical } from "react-feather";
import ReservationStatusTag from "../tags/ReservationStatusTag";
import defaultProfileImg from "../../../assets/images/profileDefaultImg.jpg";
import { ReservationCardDetailsObj } from "../../../common/interfaces/uiNecessaryInterface";
import { ReservationStatusEnum } from "../../../common/enums/reservationStatusEnum";
import DefaultCardImage from "../../../assets/images/DefaultCardImage.png";
import { PaymentStatusEnum } from "../../../common/enums/paymentStatusEnum";
import "../../../styles/reservation/reservationManagementStyles.scss"

interface ReservationRecodeCardProps {
  reservationDetails: ReservationCardDetailsObj;
  acceptOrRejectReservation: (params: { id: number; status: string }) => void;
}

const ReservationRecodeCard: React.FC<ReservationRecodeCardProps> = ({
  reservationDetails,
  acceptOrRejectReservation,
}) => {
  const [name, setName] = useState<string>("");
  // console.log(reservationDetails);

  const content = () => (
    <div className="d-flex flex-column">
      <h5
        className="font-size-4 my-2  font-weight-normal mx-2"
        style={{ cursor: "pointer" }}
        onClick={() => {
          localStorage.setItem("fromLocation", "reservation");
          window.open(
            `/view-reservation/${reservationDetails?.code}`,
            "_blank"
          );
        }}
      >
        View
      </h5>
      {reservationDetails?.reservationStatus ===
        ReservationStatusEnum.PENDING && (
          <h5
            className="my-2 font-size-4  font-weight-normal mx-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              acceptOrRejectReservation({
                id: reservationDetails?.id,
                status: ReservationStatusEnum.APPROVED,
              });
            }}
          >
            Approve
          </h5>
        )}
      {reservationDetails?.reservationStatus ===
        ReservationStatusEnum.PENDING && (
          <h5
            className=" font-weight-normal my-2 font-size-4 mx-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              acceptOrRejectReservation({
                id: reservationDetails?.id,
                status: ReservationStatusEnum.REJECTED,
              });
            }}
          >
            Reject
          </h5>
        )}
    </div>
  );

  return (
    <Card
      key={reservationDetails?.id}
      hoverable
      bordered={false}
      className="my-2"
      style={{ cursor: "auto" }}
    >
      <Row className="d-flex justify-content-between">
        <h2
          className="font-size-4 font-weight-semi-bold p-0"
          onClick={() => {
            localStorage.setItem("fromLocation", "reservation");
            window.open(`/view/${reservationDetails?.property?.id}`, "_blank");
          }}
          style={{ cursor: "pointer" }}
        >
          {reservationDetails?.property?.name}
        </h2>
        {/* <Popover
          placement="bottom"
          content={content}
          trigger="click"
          zIndex={3}
        >
          <MoreVertical
            style={{ cursor: "pointer" }}
            color="#332321"
            size={40}
            className="rounded-circle p-2"
          />
        </Popover> */}
        <Button
          size="middle"
          type="default"
          className=" rounded-4 mb-3 mb-sm-0"
          onClick={() => {
            localStorage.setItem("fromLocation", "reservation");
            window.open(
              `/view-reservation/${reservationDetails?.code}`,
              "_blank"
            );
          }}
        >
          {/* <Eye size={20} /> */}
          {/* <Info size={20} /> */}
          See More
        </Button>
      </Row>

      <Row className="d-flex flex-column flex-sm-row" style={{ height: "100%" }}>
        <Col
          xs={18}
          sm={10}
          md={5}
          lg={5}
          xl={4}
          xxl={4}
          className="align-self-center align-self-sm-start" style={{ height: "100%" }}
        >
          <img
            src={
              reservationDetails?.property?.file?.mediumPath
                ? reservationDetails?.property?.file?.mediumPath
                : DefaultCardImage
            }
            width="100%"
            height="120px"
            style={{
              maxHeight: "170px",
              minHeight: "100%",
              maxWidth: "250px",
            }}
            className="rounded-3 object-fit-cover reservationCardImg"
          />
        </Col>
        <Col
          xs={24}
          sm={14}
          md={19}
          lg={19}
          xl={20}
          xxl={20}
          className="mt-4 mt-sm-0"
        >
          <Row className="ps-0 ps-sm-4 ps-lg-5">
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={10}>
              <h2
                className="font-size-4 font-weight-semi-bold p-0 "
                onClick={() => {
                  localStorage.setItem("fromLocation", "reservation");
                  window.open(
                    `/view-reservation/${reservationDetails?.code}`,
                    "_blank"
                  );
                }}
                style={{ cursor: "pointer" }}
              >
                {reservationDetails?.code}
              </h2>
              <Row>
                <Col xs={12} sm={12} md={11} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    Check In Date
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">:</h2>
                </Col>
                <Col xs={11} sm={11} md={10} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    {moment(reservationDetails?.checkIn).format("YYYY.MM.DD")}
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={11} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-2">
                    Check Out Date
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-2">:</h2>
                </Col>
                <Col xs={11} sm={11} md={10} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-2">
                    {moment(reservationDetails?.checkOut).format("YYYY.MM.DD")}
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={11} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    Reservation Status
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">:</h2>
                </Col>
                <Col xs={11} sm={11} md={10} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    <ReservationStatusTag
                      reservationStatus={reservationDetails?.reservationStatus}
                    />
                  </h2>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={10}>
              {" "}
              <Row className="mt-0 mt-md-4">
                <Col xs={12} sm={12} md={11} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    Payment Status
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">:</h2>
                </Col>
                <Col xs={11} sm={11} md={10} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    <Tag
                      color={
                        reservationDetails?.paymentStatus ===
                          PaymentStatusEnum.PENDING
                          ? "gold"
                          : reservationDetails?.paymentStatus ===
                            PaymentStatusEnum.SUCCESS
                            ? "green"
                            : reservationDetails?.paymentStatus ===
                              PaymentStatusEnum.CANCELLED
                              ? "purple"
                              : reservationDetails?.paymentStatus ===
                                PaymentStatusEnum.FAILED
                                ? "red"
                                : "none"
                      }
                    >
                      {reservationDetails?.paymentStatus
                        ? reservationDetails?.paymentStatus
                        : "none"}
                    </Tag>
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={11} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    Payment Type
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">:</h2>
                </Col>
                <Col xs={11} sm={11} md={10} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    <Tag color="blue">
                      {reservationDetails?.paymentType
                        ? reservationDetails?.paymentType
                          .replace(/_/g, " ")
                          .toUpperCase()
                        : "none"}
                    </Tag>
                  </h2>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={11} lg={10} xl={9} xxl={8}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    Hosting Plan
                  </h2>
                </Col>
                <Col xs={1}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">:</h2>
                </Col>
                <Col xs={11} sm={11} md={10} lg={13} xl={14} xxl={15}>
                  {" "}
                  <h2 className="font-size-5 font-weight-medium p-0 my-1">
                    <Tag color="geekblue">
                      {reservationDetails?.property?.plan?.name
                        ? reservationDetails?.property?.plan?.name
                        : "none"}
                    </Tag>
                  </h2>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default ReservationRecodeCard;
