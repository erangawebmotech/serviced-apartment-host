import { Button, Col, Grid, Row } from "antd";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import PropertyListing from "../../../pages/PropertyListing";
import {
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import { Calendar, Map, Settings, User, Users } from "react-feather";
import * as constants from "../../../common/constants";
import { updatePropertyCreateLastMainStep } from "../../../service/propertyListingService";
import { useDispatch } from "react-redux";
import { MainStepsCompleteTypeEnum } from "../../../common/enums/mainStepsCompleteTypeEnum";
import { useEffect, useState } from "react";

const StepImportantInfo = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    setIsDisableBtns(false);
  }, []);

  const updateLastMainStep = () => {
    setIsDisableBtns(true);
    popUploader(dispatch, true);
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    updatePropertyCreateLastMainStep(
      MainStepsCompleteTypeEnum.FINAL_STEP_COMPLETE,
      propertyId
    )
      .then(() => {
        history(`/main/finish/${propertyId}`);
        popUploader(dispatch, false);
      })
      .catch((error) => {
        popUploader(dispatch, false);
        handleError(error);
      }).finally(() => {
        setIsDisableBtns(false);
      });
  };

  return (
    <PropertyListing>
      <div className="StepImportantInfoContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div className="pe-0 pe-lg-5 me-0 me-xl-5">
              <h2 className="font-weight-medium font-size-3 primary-color">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const propertyId = getDecryptedCookie(
                      constants.PROPERTY_ID
                    );
                    history(`/main/finish/${propertyId}`);
                  }}
                >
                  Final Steps
                </span>{" "}
                {">"} Step 04
              </h2>
              <h1 className="font-weight-medium font-size-1">
                Setup your calendar, adjust settings and welcome your first guest
              </h1>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            className={`d-flex flex-column align-items-center align-items-lg-start mb-2 align-self-end py-2 pe-2
              ${screens.xxl || screens.xl
                ? "justify-content-start "
                : "justify-content-start"
              } 
                `}
            style={{ height: "86%", overflowY: "auto" }}
          // className={`d-flex flex-column align-items-start align-self-end mb-3 ${screens.xxl || screens.xl
          //   ? "justify-content-center"
          //   : "justify-content-start"
          //   } py-2 pe-2`}
          // style={{ height: "90%", overflowY: "auto" }}
          >
            <div className="my-4 my-lg-0 ">
              <div
                className="py-2 px-4 rounded-4 border border-white my-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <h5 className="font-size-3 font-weight-medium  mt-3">
                  Next steps to start hosting
                </h5>
                <div className="text-center text-sm-start mt-3">
                  <Row className="my-3 d-flex justify-content-center">
                    <Col
                      xs={24}
                      sm={4}
                      md={3}
                      lg={4}
                      xl={3}
                      xxl={2}
                      className="d-flex justify-content-center"
                    >
                      <Calendar size={40} className="primary-color my-3 my-sm-0" />
                    </Col>
                    <Col xs={24} sm={20} md={20} lg={20} xl={20} xxl={20}>
                      <h5 className="font-size-3 font-weight-semi-bold primary-color">
                        Set Up Your Calendar
                      </h5>
                      <p className="font-size-3 font-weight-light">
                        Choose your available dates and keep your calendar up to date. Sync with other platforms to avoid double bookings. Once your listing is live, guests can start booking within 24 hours.
                      </p>
                    </Col>
                  </Row>
                  <Row className="my-3 d-flex justify-content-center">
                    <Col
                      xs={24}
                      sm={4}
                      md={3}
                      lg={4}
                      xl={3}
                      xxl={2}
                      className="d-flex justify-content-center"
                    >
                      <Settings size={40} className="primary-color my-3 my-sm-0" />
                    </Col>
                    <Col xs={24} sm={20} md={20} lg={20} xl={20} xxl={20}>
                      <h5 className="font-size-3 font-weight-semi-bold primary-color">
                        Adjust Your Settings
                      </h5>
                      <p className="font-size-3 font-weight-light">
                        Set your house rules, select a cancellation policy, and decide how guests can book. Customize your listing to suit your preferences.
                      </p>
                    </Col>
                  </Row>
                  <Row className="mt-3 mb-2 d-flex justify-content-center">
                    <Col
                      xs={24}
                      sm={4}
                      md={3}
                      lg={4}
                      xl={3}
                      xxl={2}
                      className="d-flex justify-content-center"
                    >
                      <User
                        size={40}
                        className="primary-color my-3 my-sm-0"
                      />
                    </Col>
                    <Col xs={24} sm={20} md={20} lg={20} xl={20} xxl={20}>
                      <h5 className="font-size-3 font-weight-semi-bold primary-color">
                        Get Ready for Your First Guest
                      </h5>
                      <p className="font-size-3 font-weight-light">
                        We’re working on a comprehensive Host Resource Center to help you with tips, tools, and guidance. In the meantime, our support team is here to help you every step of the way to welcome your guest.                      </p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="btnRow w-100" style={{ height: "10%" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="d-flex justify-content-between flex-column-reverse flex-sm-row mt-1 mb-4"
          >
            <Button
              disabled={isDisableBtns}
              size="large"
              type="default"
              className="px-5 py-4 mt-3 mt-lg-0 me-0 me-sm-2 rounded-4"
              onClick={() => {
                const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
                history(`/final/03/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={() => {
                updateLastMainStep();
              }}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepImportantInfo;
