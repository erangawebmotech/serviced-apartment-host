import { Avatar, Button, Checkbox, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/propertyListingStyles.scss";
import ColorAnimationComponent from "../components/common/ColorAnimationComponent";
import { ArrowLeft, List } from "react-feather";
import { useState } from "react";
import * as constants from "../common/constants";

import {
  customToastMsg,
  getDecryptedCookie,
  handleError,
  popUploader,
  removeCookie,
} from "../common/commonFunctions";
import { addNewProperty } from "../service/propertyListingService";
import { ListingStepsEnum } from "../common/enums/listingStepsEnum";
import { useDispatch } from "react-redux";
import { Cookies } from "typescript-cookie";

const CompleteProcess = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [serviceApartmentHasRights, setServiceApartmentHasRights] =
    useState<boolean>(false);
  const [acceptAndAgreeToTems, setAcceptAndAgreeToTems] =
    useState<boolean>(false);

  const handlePropertyComplete = () => {
    let isValidate = false;
    !serviceApartmentHasRights
      ? customToastMsg("Please read and agree to terms and conditions", 2)
      : !acceptAndAgreeToTems
      ? customToastMsg("Please read and agree to terms and conditions", 2)
      : (isValidate = true);

    if (isValidate) {
      const data = {};

      const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.FINAL_STEP, propertyId)
        .then(() => {
          popUploader(dispatch, false);
          removeCookie(constants.PROPERTY_ID);
          Cookies.remove(constants.PLAN_ID);
          Cookies.remove(constants.ROOM_ID);
          history("/listed-properties");
        })
        .catch((error) => {
          handleError(error);
          popUploader(dispatch, false);
        });
    }
  };

  return (
    <div
      className="CompleteProcessContainer d-flex"
      style={{ minHeight: "100vh" }}
    >
      <ColorAnimationComponent layoutHeight="100%" />
      <Button
        onClick={() => {
          const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
          history(`/main/finish/${propertyId}`);
        }}
        size="large"
        type="default"
        className="position-fixed rounded-circle px-2"
        style={{ top: "20px", left: "20px", height: 40 }}
      >
        <ArrowLeft size={20} className="mx-1" />
      </Button>
      <Row className="d-flex align-items-center justify-content-center py-5 m-0 w-100">
        <Col
          xs={18}
          sm={18}
          md={18}
          lg={18}
          xl={16}
          xxl={14}
          className="w-100 my-3 m-0"
        >
          <div className="text-center">
            <h1 className="font-weight-medium font-size-1">
              We are ready to go.
            </h1>
            <p className="font-size-3 font-weight-medium">
              You are successfully complete your property listing steps.
            </p>
          </div>
          <div className="w-100">
            <Row className="w-100 d-flex justify-content-center">
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                xxl={10}
                className="pe-0 pe-md-3"
              >
                <div
                  className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center justify-content-center text-center"
                  style={{ backgroundColor: "#fdfdfd6e", minHeight: 280 }}
                >
                  <Col
                    xs={5}
                    sm={3}
                    md={4}
                    lg={3}
                    xl={3}
                    xxl={3}
                    className="d-flex align-items-center justify-content-center w-100 my-3"
                  >
                    <Avatar
                      className=" py-4 w-100 d-flex align-items-center justify-content-center "
                      style={{
                        backgroundColor: "#ef5a60",
                      }}
                    >
                      <List size={30} className=" " />
                    </Avatar>
                  </Col>
                  <h5 className="font-size-3 font-weight-medium mx-0 mx-lg-3">
                    We’ll conduct some verifications before making your property
                    available for bookings
                  </h5>
                  <h5 className="font-size-5 font-weight-light mt-2 mb-4 text-gray mx-0 mx-lg-3">
                    We perform checks to ensure safety and trust for both our
                    partners and guests. We will notify you if we require any
                    additional information.
                  </h5>
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                xxl={10}
                className="ps-0 ps-md-3"
              >
                <div
                  className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center justify-content-center text-center"
                  style={{ backgroundColor: "#fdfdfd6e", minHeight: 280 }}
                >
                  <Col
                    xs={5}
                    sm={3}
                    md={4}
                    lg={3}
                    xl={3}
                    xxl={3}
                    className="d-flex align-items-center justify-content-center w-100 my-3"
                  >
                    <Avatar
                      className=" py-4 w-100 d-flex align-items-center justify-content-center "
                      style={{
                        backgroundColor: "#ef5a60",
                      }}
                    >
                      <List size={30} className=" " />
                    </Avatar>
                  </Col>
                  <h5 className="font-size-3 font-weight-medium mx-0 mx-lg-3">
                    You can edit your property details at any time after going
                    live
                  </h5>
                  <h5 className="font-size-5 font-weight-light mt-2 mb-4 text-gray mx-0 mx-lg-3">
                    Once your registration is complete, you can update your
                    calendar, pricing, photos, and other details. You can also
                    connect to a channel manager or manage bookings through our
                    platform.
                  </h5>
                </div>
              </Col>
            </Row>
            <Row className="w-100">
              <div className="d-flex align-items-start my-3">
                <Checkbox
                  onChange={(e) => {
                    setServiceApartmentHasRights(e.target.checked);
                  }}
                  className="mt-1 "
                ></Checkbox>
                <span className=" font-size-4 font-weight-light ms-2">
                  I certify that this is a legitimate accommodation business
                  with all necessary licenses and permits, which can be provided
                  upon request. Serviced Apartments LK reserves the right to
                  verify and investigate any information provided during
                  registration.
                </span>
              </div>
              <div className="d-flex align-items-start my-3">
                <Checkbox
                  onChange={(e) => {
                    setAcceptAndAgreeToTems(e.target.checked);
                  }}
                  className="mt-1 "
                ></Checkbox>
                <span className=" font-size-4 font-weight-light ms-2">
                  I have read, accepted, and agreed to the{" "}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-color font-weight-semi-bold"
                    style={{
                      cursor: "pointer",
                      marginLeft: "4px",
                      marginRight: "4px",
                    }}
                  >
                    Terms And Conditions.
                  </a>{" "}
                </span>
              </div>
            </Row>
            <Row className="d-flex justify-content-center">
              {" "}
              {/* <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                xxl={12}
                className="pe-0 pe-md-2"
              >
                <Button
                  size="large"
                  className=" w-100  mt-5 rounded-3"
                  style={{ whiteSpace: "normal", height: "auto" }}
                  onClick={() => {
                    handlePropertyComplete();
                  }}
                >
                  Register Now and Activate Later
                </Button>
              </Col> */}
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                xxl={12}
                className="ps-0 ps-md-2"
              >
                <Button
                  size="large"
                  className="w-100 mt-4 mt-md-5 rounded-3 py-2"
                  type="primary"
                  style={{ whiteSpace: "normal", height: "auto" }}
                  onClick={() => {
                    handlePropertyComplete();
                  }}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CompleteProcess;
