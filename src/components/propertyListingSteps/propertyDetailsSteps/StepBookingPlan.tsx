import { Button, Checkbox, Col, Form, Grid, Row } from "antd";
import { useEffect, useState } from "react";
import PropertyListing from "../../../pages/PropertyListing";
import { useNavigate } from "react-router-dom";
import "../../../styles/propertyListingStyles.scss";
import {
  customToastMsg,
  getDecryptedCookie,
  getLastPathSegment,
  handleError,
  popUploader,
  setEncryptedCookie,
} from "../../../common/commonFunctions";
import * as constants from "../../../common/constants";
import { BookingTypeEnum } from "../../../common/enums/bookingTypeEnum";
import {
  addNewProperty,
  getPropertyById,
} from "../../../service/propertyListingService";
import { ListingStepsEnum } from "../../../common/enums/listingStepsEnum";
import { useDispatch } from "react-redux";
import { PropertyListingDetailDTO } from "../../../common/dto/PropertyListingDetailDTO";
import { PropertyTypesEnum } from "../../../common/enums/propertyTypesEnum";

const StepBookingPlan = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [entirePlace, setEntirePlace] = useState<boolean | string>(true);
  const [separateRoom, setSeparateRoom] = useState<boolean | string>(true);
  const [isDisableBtns, setIsDisableBtns] = useState<boolean>(true);
  const [hasSeparateUnitsToBook, setHasSeparateUnitsToBook] =
    useState<boolean>(true);
  const [hasEntirePropertyToBook, setHasEntirePropertyToBook] =
    useState<boolean>(true);
  const [propertyDetailsObject, setPropertyDetailsObject] =
    useState<PropertyListingDetailDTO>();
  const [form] = Form.useForm();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

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
          setPropertyDetailsObject(dataObj);
          if (dataObj) {
            setEntirePlace(
              dataObj?.allowEntireProperty
                ? dataObj?.allowEntireProperty
                : false
            );
            dataObj?.propertyType?.name != PropertyTypesEnum.APARTMENT
              ? setSeparateRoom(
                dataObj?.allowIndividualUnit
                  ? dataObj?.allowIndividualUnit
                  : false
              )
              : setSeparateRoom(false);
            if (dataObj?.propertyType?.name === PropertyTypesEnum.VILLA) {
              setHasSeparateUnitsToBook(true);
              setHasEntirePropertyToBook(true);
            }
            if (dataObj?.propertyType?.name === PropertyTypesEnum.APARTMENT) {
              setHasSeparateUnitsToBook(false);
              setHasEntirePropertyToBook(true);
            }
            if (dataObj?.propertyType?.name === PropertyTypesEnum.HOTEL) {
              setHasSeparateUnitsToBook(true);
              setHasEntirePropertyToBook(false);
            }
            if (dataObj?.propertyType?.name === PropertyTypesEnum.HOME_STAY) {
              setHasSeparateUnitsToBook(false);
              setHasEntirePropertyToBook(true);
            }
            if (dataObj?.propertyType?.name === PropertyTypesEnum.ROOMS) {
              setHasSeparateUnitsToBook(false);
              setHasEntirePropertyToBook(true);
            }
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

  const handleCreatePropertyListingBookingPlan = () => {
    let isValidate = false;

    (entirePlace === "" && separateRoom === "") ||
      (!entirePlace && !separateRoom)
      ? customToastMsg("Select at lease one option", 2)
      : (isValidate = true);

    let temp: string[] = [];
    if (entirePlace) {
      temp.push(BookingTypeEnum.ENTIRE_PROPERTY);
    }
    if (separateRoom) {
      temp.push(BookingTypeEnum.INDIVIDUAL_UNIT);
    }
    const data = {
      bookingType: temp,
    };
    const propertyId = getDecryptedCookie(constants.PROPERTY_ID);
    if (isValidate) {
      setIsDisableBtns(true);
      popUploader(dispatch, true);
      addNewProperty(data, ListingStepsEnum.BOOKING_TYPE, propertyId)
        .then(() => {
          form.resetFields();
          popUploader(dispatch, false);
          if (entirePlace) {
            // entierPropertyPrice
            history(`/property/06/${propertyId}`);
            return;
          } else if (separateRoom) {
            if (
              propertyDetailsObject &&
              propertyDetailsObject.propertyType?.name !=
              PropertyTypesEnum.HOTEL
            ) {
              history(`/property/08/${propertyId}`);
              return;
            } else {
              history(`/property/09/${propertyId}`);
              return;
            }
          }
        })
        .catch((error) => {
          popUploader(dispatch, false);
          handleError(error);
        })
        .finally(() => {
          setIsDisableBtns(false);
        });
    }
  };

  const clearStates = () => {
    setEntirePlace("");
    setSeparateRoom("");
    setIsDisableBtns(true);
  };

  return (
    <PropertyListing>
      <div className="StepBookingPlanContainer py-5 py-lg-0 h-100 w-100">
        <Row
          className="contentRow d-flex align-items-center justify-content-center pt-5 pt-lg-0 w-100"
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
                  Property Details
                </span>{" "}
                {">"} Step 05
              </h2>
              <h1 className="font-weight-medium font-size-1 me-0 me-lg-5">
                What booking options do you offer?
              </h1>
              <p className="font-size-4 font-weight-extra-light me-0 me-lg-5">
                Specify whether customers can book the entire premises or
                individual units for flexibility.
              </p>
            </div>
          </Col>

          <Col xs={24} sm={24} md={15} lg={12} xl={12} xxl={12} className={`d-flex align-self-end mb-2 py-4 pe-2  ${screens.xxl || screens.xl
            ? "align-items-center "
            : "align-items-start"
            }  `} style={{ height: "87%", overflowY: "auto" }}>
            <div
              className="py-2 px-4 rounded-4 border border-white my-4 my-lg-0 w-100 d-flex flex-column align-items-center align-items-lg-start"
              style={{ backgroundColor: "#fdfdfd6e" }}
            >
              <Form
                form={form}
                layout="vertical"
                className="mt-4 w-100 text-start"
              >
                {hasEntirePropertyToBook && (
                  <Form.Item name="entirePlace">
                    <div className="d-flex align-items-start my-3">
                      <Checkbox
                        checked={entirePlace as boolean}
                        onChange={(e) => setEntirePlace(e.target.checked)}
                        className="mt-1 bg-transparent "
                        id="entirePlaceCheckbox"
                      ></Checkbox>
                      <span
                        className=" font-size-4 ms-2"
                        onClick={() => setEntirePlace((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        Customers can book my property as entire place
                      </span>
                    </div>

                    <p className="font-size-4 mt-3 font-weight-light">
                      Your property will be available as a single booking,
                      offering guests the exclusive use of the entire space.
                      This option is perfect for families, groups, or travelers
                      seeking privacy, comfort, and a personalized experience in
                      a home-like environment. Guests can enjoy the entire
                      property without sharing any facilities with others.
                    </p>
                  </Form.Item>
                )}
                {hasSeparateUnitsToBook && (
                  <Form.Item name="separateRoom">
                    <div className="d-flex align-items-start my-3">
                      <Checkbox
                        checked={separateRoom as boolean}
                        onChange={(e) => {
                          setSeparateRoom(e.target.checked);
                        }}
                        className="mt-1 bg-transparent"
                        id="separateRoomCheckbox"
                      ></Checkbox>
                      <span
                        className=" font-size-4 ms-2"
                        onClick={() => setSeparateRoom((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        Customers can book my property as separate units
                      </span>
                    </div>

                    <p className="font-size-4 mt-3 font-weight-light">
                      Your property will be listed as separate units available
                      for individual bookings. This option allows you to cater
                      to diverse guest types, such as solo travelers, couples,
                      or small groups, maximizing occupancy. Each unit will have
                      its own amenities, providing flexibility while maintaining
                      comfort and convenience for all guests sharing the
                      property.
                    </p>
                  </Form.Item>
                )}
              </Form>
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
                history(`/property/04/${propertyId}`);
              }}
            >
              Back
            </Button>
            <Button
              disabled={isDisableBtns}
              size="large"
              type="primary"
              className="px-5 py-4 mt-3 mt-lg-0 ms-0 ms-sm-3 rounded-4"
              onClick={handleCreatePropertyListingBookingPlan}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    </PropertyListing>
  );
};

export default StepBookingPlan;
