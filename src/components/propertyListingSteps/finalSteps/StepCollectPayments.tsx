import { Button, Checkbox, Col, Row } from "antd";
import { useEffect, useState } from "react";
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
import * as constants from "../../../common/constants";
import { useDispatch } from "react-redux";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";

const StepCollectPayments = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [payAtPropertyOption, setPayAtPropertyOption] =
    useState<boolean>(false);
  const [isInstantBookingAvailable, setIsInstantBookingAvailable] =
    useState<boolean>(false);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);

  useEffect(() => {
    const currentURL = window.location.pathname;
    const lastSegment = getLastPathSegment(currentURL);
    setEncryptedCookie(constants.PROPERTY_ID, parseInt(lastSegment));
    loadPropertyDetailsPropertyId();
  }, []);

  const loadPropertyDetailsPropertyId = () => {
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);

    if (propertyId) {
      popUploader(dispatch, true);
      getPropertyById(propertyId)
        .then((resp) => {
          const dataObj: PropertyListingDetailDTO = resp?.data;
          if (
            dataObj &&
            (dataObj?.payAtProperty || dataObj?.allowInstantBooking)
          ) {
            setPayAtPropertyOption(
              dataObj?.payAtProperty ? dataObj?.payAtProperty : false
            );
            setIsInstantBookingAvailable(
              dataObj?.allowInstantBooking
                ? dataObj?.allowInstantBooking
                : false
            );
          }
          popUploader(dispatch, false);
          setIsDisableBtns(false);
        })
        .catch((err) => {
          popUploader(dispatch, false);
          handleError(err);
        });
    }
  };

  const handleCreatePropertyListingCollectPayments = () => {
    const data = {
      payAtProperty: payAtPropertyOption,
      allowInstantBooking: isInstantBookingAvailable,
    };

    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    // if (isValidate) {
    setIsDisableBtns(true);
    popUploader(dispatch, true);
    addNewProperty(data, ListingStepsEnum.PAY_AT_PROPERTY, propertyId)
      .then(() => {
        clearStates();
        popUploader(dispatch, false);
        history(`/final/02/${propertyId}`);
      })
      .catch((error) => {
        handleError(error);
        popUploader(dispatch, false);
      })
      .finally(() => {
        setIsDisableBtns(false);
      });
    // }
  };

  const clearStates = () => {
    setPayAtPropertyOption(false);
    setIsDisableBtns(true);
  };

  return (
    <PropertyListing>
      <div className="StepCollectPaymentsContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center pt-5 pt-lg-0 w-100"
          style={{ height: "90%" }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div className="pe-0 pe-lg-5 me-0 me-lg-5">
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
                {">"} Step 01
              </h2>
              <h1 className="font-weight-medium font-size-1">
                How can guests make payments for their stay?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-xl-5">
                Specify whether payments can be made online or upon arrival at
                the property for greater convenience.
              </p>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            xxl={12}
            className="d-flex flex-column justify-content-start py-1 pe-0 pe-lg-2 align-self-end"
            style={{ height: "88%", overflowY: "auto" }}
          >
            <div className="my-4 my-lg-0">
              <div
                className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <h5 className="font-size-3 font-weight-medium mt-3">
                  How can your guests pay for their stay?
                </h5>
                <div className="text-start">
                  <div className="d-flex align-items-start my-3">
                    <Checkbox checked={true} className="mt-1 "></Checkbox>
                    <span className=" font-size-3 font-weight-light ms-2">
                      <span className="font-weight-medium">
                        Online Payment :{" "}
                      </span>{" "}
                      Guests can make payments during the reservation process.
                      Payments are securely facilitated through{" "}
                      <a
                        href="https://servicedapartments.lk/country/sri-lanka/"
                        target="_blank"
                        style={{ color: "#ef5a60" }}
                      >
                        Serviced Apartments LK
                      </a>{" "}
                    </span>
                  </div>
                  <div
                    className="d-flex align-items-start my-3"
                    onClick={() => setPayAtPropertyOption(!payAtPropertyOption)}
                    style={{ cursor: "pointer" }}
                  >
                    <Checkbox
                      checked={payAtPropertyOption}
                      className="me-1 mt-1"
                      id="PsyAtPropertyCheckbox"
                    ></Checkbox>
                    <span className="font-size-3 font-weight-light ms-2">
                      <span className="font-weight-medium">
                        Pay At Property :{" "}
                      </span>{" "}
                      Guests can pay in person upon arrival at the property.
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="py-2 px-4 rounded-4 border border-white my-4  w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <div className="text-start">
                  <div
                    className="d-flex align-items-start my-3"
                    onClick={() =>
                      setIsInstantBookingAvailable(!isInstantBookingAvailable)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Checkbox
                      checked={isInstantBookingAvailable}
                      className="me-1 mt-1"
                      id="PsyAtPropertyCheckbox"
                    ></Checkbox>
                    <span className="font-size-3 font-weight-light ms-2">
                      <span className="font-weight-medium">
                        Instant Booking Availability :{" "}
                      </span>{" "}
                      Reservations are approved immediately when guests make an
                      online payment - no host approval needed.
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="py-2 px-4 rounded-4 border border-white my-4 w-100 d-flex flex-column align-items-center align-items-lg-start"
                style={{ backgroundColor: "#fdfdfd6e" }}
              >
                <h5 className="font-size-3 font-weight-medium  mt-3">
                  How payments work with Serviced Apartments LK :
                </h5>

                <ul className="text-start font-size-3 font-weight-light">
                  <li className=" mt-3 mb-2">
                    <span className="font-weight-medium">
                      Secure Payment Options :{" "}
                    </span>{" "}
                    Guests can pay using secure stripe payment gateway.
                  </li>
                  <li className="mb-2">
                    <span className="font-weight-medium">
                      Hassle-Free Transactions :{" "}
                    </span>{" "}
                    We handle payment processing to eliminate fraud risks,
                    chargebacks, and invalid cards.
                  </li>
                  <li className="mb-3 mt-2">
                    <span className="font-weight-medium">
                      Payouts To You :{" "}
                    </span>{" "}
                    Earnings are transferred to your bank account by the 15th of
                    each month, covering all bookings with check-outs from the
                    previous month.
                  </li>
                </ul>
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
                history(`/main/finish/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingCollectPayments}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepCollectPayments;
