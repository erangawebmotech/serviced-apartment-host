import { Button, Col, Popconfirm, PopconfirmProps, Row } from "antd";
import { useEffect } from "react";
import roomStepIcon from "../../../assets/images/steps/roomStep.png";
import bathroomIcon from "../../../assets/images/steps/bathroom1.svg";
import { useNavigate } from "react-router-dom";
import { getDecryptedCookie } from "../../../common/commonFunctions.tsx";
import * as constants from "../../../common/constants.ts";
import { Cookies } from "typescript-cookie";
import { CurrencyEnum } from "../../../common/enums/currencyEnum.ts";

// @ts-ignore
const RoomFormRepeater = ({ unitDetails, bookingPlans, deleteUnitDetails }) => {
  const history = useNavigate();
  const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

  const confirm: PopconfirmProps["onConfirm"] = (unit: any) => {
    deleteUnitDetails(unit.id);
  };

  useEffect(() => {
    let temp: any = [];
    unitDetails.map((unit: any) => {
      const bedCount = unit.beds.reduce(
        (total: number, bed: any) => total + bed.count,
        0
      );
      temp.push({
        ...unit,
        bedCount: bedCount,
      });
    });
  }, []);
  // const cancel: PopconfirmProps["onCancel"] = (e) => {
  //   console.log(e);
  //   message.error("Click on No");
  // };

  return (
    <div>
      {unitDetails.map((unit: any) => (
        <Row className="my-3 d-flex justify-content-center justify-content-md-start">
          <Col
            xs={24}
            sm={24}
            md={3}
            lg={2}
            xl={2}
            xxl={2}
            className="d-flex align-items-center justify-content-center"
          ></Col>
          <Col
            xs={8}
            sm={8}
            md={3}
            lg={2}
            xl={2}
            xxl={2}
            className="d-flex align-items-center justify-content-center"
          >
            <img src={roomStepIcon} alt="icon" height="auto" width="50px" />
          </Col>

          <Col xs={24} sm={24} md={18} lg={20} xl={20} xxl={20}>
            {bookingPlans?.allowIndividualUnit && (
              <h5 className="font-size-3 font-weight-bold ps-0 ps-md-4 mt-1">
                {unit?.name} ({unit?.unitCategory?.name})
              </h5>
            )}

            <Row
              className={`w-100 d-flex  ps-0 ps-md-2 mt-3 ${bookingPlans?.allowIndividualUnit
                ? "justify-content-center"
                : "justify-content-start"
                }`}
            >
              {bookingPlans?.allowIndividualUnit && (
                <Col
                  xs={24}
                  sm={24}
                  md={6}
                  lg={4}
                  xl={4}
                  xxl={3}
                  className=" my-2 my-md-0 border-start border-end "
                >
                  <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                    Guests
                  </h5>
                  <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                    {unit?.maxHeadCount}
                  </h5>
                </Col>
              )}

              <Col
                xs={24}
                sm={24}
                md={6}
                lg={3}
                xl={3}
                xxl={3}
                className="border-start border-end  my-2 my-md-0"
              >
                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                  Beds
                </h5>
                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                  {unit.beds.reduce(
                    (total: number, bed: any) => total + bed.count,
                    0
                  )}
                </h5>
              </Col>
              {!bookingPlans?.allowIndividualUnit && (
                <Col
                  xs={24}
                  sm={24}
                  md={4}
                  lg={3}
                  xl={3}
                  xxl={3}
                  className="border-start border-end  d-flex align-items-start justify-content-center"
                >
                  <img
                    src={bathroomIcon}
                    alt="icon"
                    height="auto"
                    width="40px"
                  // style={{strokeWidth:"80px"}}
                  />
                </Col>
              )}
              <Col
                xs={24}
                sm={24}
                md={6}
                lg={5}
                xl={5}
                xxl={5}
                className={`border-start ${bookingPlans?.allowIndividualUnit && "border-end"
                  }   my-2 my-md-0`}
              >
                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                  {bookingPlans?.allowIndividualUnit
                    ? "Total Bathroom"
                    : "Bathrooms"}
                </h5>
                <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                  {unit.unitBathrooms.reduce(
                    (total: number, bathroom: any) => total + bathroom.count,
                    0
                  )}
                </h5>
              </Col>
              {bookingPlans?.allowIndividualUnit && (
                <Col
                  xs={24}
                  sm={24}
                  md={6}
                  lg={4}
                  xl={5}
                  xxl={5}
                  className="border-start border-end  my-2 my-md-0"
                >
                  <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                    Price
                  </h5>
                  <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                    {CurrencyEnum.USD} {parseFloat(unit.priceForMaxCount).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </h5>
                </Col>
              )}
              {bookingPlans?.allowIndividualUnit && (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={7}
                  xl={7}
                  xxl={7}
                  className="border-start border-end  my-2 my-lg-0"
                >
                  <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                    Rooms of this type
                  </h5>
                  <h5 className="font-size-4 font-weight-normal ps-0 ps-md-1 m-0 text-gray">
                    {unit.count}
                  </h5>
                </Col>
              )}
            </Row>
          </Col>
          {bookingPlans?.allowIndividualUnit && (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="d-flex justify-content-center justify-content-md-end justify-content-xl-end align-items-center"
            >
              {unit?.editable && (
                <Popconfirm
                  title="Delete this unit"
                  description="Are you sure to delete this unit details?"
                  onConfirm={() => {
                    confirm(unit);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  {" "}
                  <Button
                    size="large"
                    className=" my-3 py-4 me-0 me-lg-3 rounded-3 text-gray"
                    type="text"
                  >
                    Delete
                  </Button>
                </Popconfirm>
              )}
              <Button
                size="large"
                className="my-3 py-4  rounded-3"
                type="text"
                style={{ color: "#ef5a60" }}
                onClick={() => {
                  Cookies.set(constants.ROOM_ID, unit?.id);
                  history(`/unit/01/${propertyId}`);
                }}
              >
                Edit
              </Button>
            </Col>
          )}
        </Row>
      ))}
    </div>
  );
};

export default RoomFormRepeater;
